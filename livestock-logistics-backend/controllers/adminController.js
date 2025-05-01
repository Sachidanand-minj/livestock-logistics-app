const User = require('../models/User');
const Shipment = require('../models/Shipment');
const bcrypt = require('bcryptjs');

/**
 * List all users (excluding sensitive fields)
 */
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

/**
 * List all users whose status is still 'pending'
 */
exports.getPendingUsers = async (req, res) => {
  try {
    const pending = await User.find({ status: 'pending' })
      .select('-password -resetToken -resetExpires');
    res.json(pending);
  } catch (err) {
    console.error('getPendingUsers error:', err);
    res.status(500).json({ error: 'Error fetching pending users' });
  }
};

/**
 * Approve a pending user by setting status → 'approved'
 */
exports.approveUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    ).select('-password -resetToken -resetExpires');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('approveUser error:', err);
    res.status(500).json({ error: 'Error approving user' });
  }
};

/**
 * Create a new user (admin-only). Auto-approves the account.
 */
exports.createUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // basic validation
    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // check for duplicate email
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashed,
      role,
      status: 'approved'
    });

    // remove sensitive fields before sending
    const safeUser = user.toObject();
    delete safeUser.password;
    delete safeUser.resetToken;
    delete safeUser.resetExpires;

    res.status(201).json({ msg: 'User created', user: safeUser });
  } catch (err) {
    console.error('createUser error:', err);
    res.status(500).json({ error: 'Error creating user' });
  }
};

/**
 * Delete a non-admin user
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.role === 'admin') {
      return res
        .status(403)
        .json({ error: 'Cannot delete admin users' });
    }

    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('deleteUser error:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

/**
 * Delete a shipment by ID
 */
exports.deleteShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);

    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    await shipment.deleteOne();
    res.json({ message: 'Shipment deleted successfully' });
  } catch (err) {
    console.error('deleteShipment error:', err);
    res.status(500).json({ error: 'Failed to delete shipment' });
  }
};
