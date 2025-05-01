const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    // basic validation
    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    // check duplicate
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    // hash password
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, phone, password: hashed, role });
    await user.save();
    res
      .status(201)
      .json({ msg: 'Registration successful — pending admin approval' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // look up user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    if (user.status === 'pending') {
      return res
        .status(403)
        .json({ error: 'Account pending admin approval' });
    }
    // verify password
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // sign token
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
      status: user.status,
      avatar: user.avatar
        ? `${req.protocol}://${req.get('host')}${user.avatar}`
        : null
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
};

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

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // create reset token & expiry
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetToken = resetToken;
    user.resetExpires = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    const resetUrl = `${CLIENT_URL}/reset-password/${resetToken}`;
    const html = `
      <p>Hello ${user.name},</p>
      <p>You requested a password reset. Click the link below to reset your password (valid 15 minutes):</p>
      <a href="${resetUrl}" target="_blank">${resetUrl}</a>
    `;
    await sendEmail({
      to: user.email,
      subject: 'Livestock Logistics Password Reset',
      html
    });

    res.json({ message: 'Password reset link sent to email' });
  } catch (err) {
    console.error('forgotPassword error:', err);
    res.status(500).json({ error: 'Server error sending reset email' });
  }
};

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
    // hash & save new password
    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetExpires = undefined;
    await user.save();

    // auto-login: issue new JWT
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
