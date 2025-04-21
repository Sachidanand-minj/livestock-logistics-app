const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendEmail = require('../utils/sendEmail'); // 👈 utility to send email

exports.registerUser = async (req, res) => {  
  try {
    const { name, email, phone, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, phone, password: hashedPassword, role });
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Email already exists or invalid data' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(401).json({ error: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });

  res.json({token,
    role: user.role,
    name: user.name,        // ✅ ensure this exists
    userId: user._id,
    avatar: user.avatar || ''
  });
};


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching users' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetExpires = Date.now() + 1000 * 60 * 15; // 15 minutes

    user.resetToken = resetToken;
    user.resetExpires = resetExpires;
    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    // Set up nodemailer
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
      }
    });

    const mailOptions = {
      from: '"Livestock Support" <dev.animstock@gmail.com>',
      to: user.email,
      subject: 'Password Reset Link',
      html: `
        <p>Hello ${user.name},</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}" target="_blank">${resetUrl}</a>
        <p>This link will expire in 15 minutes.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Reset link sent to your email' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetExpires = undefined;
    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
