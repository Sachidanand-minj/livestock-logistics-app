const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const { name, phone, password } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) return res.status(404).json({ error: 'User not found' });

  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (password) user.password = await bcrypt.hash(password, 10);
  if (req.file) {
    updates.avatar = `/uploads/avatars/${req.file.filename}`;  // or wherever you save it
  }

  await user.save();

  res.json({ message: 'Profile updated successfully', name: user.name });
};


exports.uploadAvatar = async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      user.avatar = `/uploads/avatars/${req.file.filename}`;
      await user.save();
  
      res.json({ message: 'Avatar uploaded', avatar: user.avatar });
    } catch (err) {
      console.error('Upload error:', err);
      res.status(500).json({ error: 'Failed to upload avatar' });
    }
  };
  