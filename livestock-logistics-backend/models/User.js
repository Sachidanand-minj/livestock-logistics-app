const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: {type: String, required: true, match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number']},
  password: String,
  role: { type: String, enum: ['sender', 'transporter', 'admin'], default: 'sender' },
  avatar: String,
  resetToken: String,
  resetExpires: Date

});

module.exports = mongoose.model('User', UserSchema);
