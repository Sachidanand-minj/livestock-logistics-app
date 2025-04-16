const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // adjust path based on your folder

// Replace with your actual MongoDB URI
const MONGO_URI = 'mongodb://localhost:27017/livestock-logistics';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const createAdmin = async () => {
  try {
    const existing = await User.findOne({ email: 'admin@logistics.com' });
    if (existing) {
      console.log('Admin user already exists.');
      mongoose.disconnect();
      return;
    }

    const hashedPassword = await bcrypt.hash('Admin@123', 10); // use strong password

    const admin = new User({
      name: 'Super Admin',
      email: 'admin@logistics.com',
      phone: '8168582883',
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Failed to create admin:', err.message);
    mongoose.disconnect();
  }
};

createAdmin();
