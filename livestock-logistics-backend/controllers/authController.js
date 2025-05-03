const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Register new user (sender, transporter, or admin)
exports.registerUser = async (req, res) => {
  console.log('>>> registerUser hit');
  console.log('req.headers[\"content-type\"]:', req.headers['content-type']);
  console.log('req.body:', req.body);
  console.log('req.files:', req.files);
  try {
    // Destructure common fields
    const { name, email, phone, password, role } = req.body;

    // Basic validation
    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check for duplicate email
    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Prepare base user data
    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone,
      password: hashed,
      role
    };

    // If transporter, include transporter-specific details and documents
    if (role === 'transporter') {
      const {
        businessName,
        businessType,
        gstNumber,
        panNumber,
        contactPersonName,
        contactPersonPhone,
        vehicleType,
        vehicleNumber,
        driverName,
        driverLicenseNumber,
        accountHolderName,
        accountNumber,
        ifscCode,
        bankName,
        declarationAccepted
      } = req.body;

      userData.transporter = {
        businessName,
        businessType,
        gstNumber,
        panNumber,
        contactPersonName,
        contactPersonPhone,
        vehicleType,
        vehicleNumber,
        driverName,
        driverLicenseNumber,
        bankDetails: {
          accountHolderName,
          accountNumber,
          ifscCode,
          bankName
        },
        declarationAccepted: declarationAccepted === 'true',
        documents: {
          gstCertificate: req.files?.gstCertificate?.[0]?.path,
          panCard:       req.files?.panCard?.[0]?.path,
          license:       req.files?.license?.[0]?.path,
          vehicleRc:     req.files?.vehicleRc?.[0]?.path,
          insurance:     req.files?.insurance?.[0]?.path
        }
      };
    }

    // Create and save the user
    const user = new User(userData);
    await user.save();

    // Response
    res.status(201).json({ msg: 'Registration successful — pending admin approval' });
  } catch (err) {
    console.error('Register error:', err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    res.status(500).json({ error: 'Server error during registration' });
  }
};

// User login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    if (user.verificationStatus === 'pending') {
      return res.status(403).json({ error: 'Account pending admin approval' });
    }
    if (user.verificationStatus === 'rejected') {
      return res.status(403).json({ error: 'Account rejected by admin' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      role:   user.role,
      name:   user.name,
      userId: user._id,
      phone:  user.phone,
      status: user.verificationStatus,
      avatar: user.avatar ? `${req.protocol}://${req.get('host')}${user.avatar}` : null
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// Get all users (excluding sensitive fields)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -resetToken -resetExpires');
    res.json(users);
  } catch (err) {
    console.error('getAllUsers error:', err);
    res.status(500).json({ error: 'Error fetching users' });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Create reset token and expiry
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetToken = resetToken;
    user.resetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const resetUrl = `${CLIENT_URL}/reset-password/${resetToken}`;
    const html = `
      <p>Hello ${user.name},</p>
      <p>You requested a password reset. Click the link below to reset your password (valid for 15 minutes):</p>
      <a href="${resetUrl}" target="_blank">${resetUrl}</a>
    `;
    await sendEmail({ to: user.email, subject: 'Livestock Logistics Password Reset', html });

    res.json({ message: 'Password reset link sent to email' });
  } catch (err) {
    console.error('forgotPassword error:', err);
    res.status(500).json({ error: 'Server error sending reset email' });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }
    const user = await User.findOne({
      resetToken: token,
      resetExpires: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    // Hash and save new password
    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetExpires = undefined;
    await user.save();

    // Auto-login with new JWT
    const newToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ message: 'Password reset successful', token: newToken });
  } catch (err) {
    console.error('resetPassword error:', err);
    res.status(500).json({ error: 'Server error during password reset' });
  }
};
