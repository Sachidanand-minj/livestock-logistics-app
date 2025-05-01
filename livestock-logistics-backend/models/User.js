const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: String,
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: {
    type: String,
    required: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number']
  },
  password: String,
  role: { type: String, enum: ['sender', 'transporter', 'admin'],required: true},
  status: {
    type:String,
    enum:['pending','approved'],
    default:'pending',
  },
  avatar: String,
  resetToken: String,
  resetExpires: Date,
  transporter: {
    businessName: String,
    businessType: String,
    gstNumber: String,
    panNumber: String,
    contactPersonName: String,
    contactPersonPhone: String,
    vehicleType: String,
    vehicleNumber: String,
    driverName: String,
    driverLicenseNumber: String,
    documents: {
      gstCertificate: String,
      panCard: String,
      license: String,
      vehicleRc: String,
      insurance: String
    },
    bankDetails: {
      accountHolderName: String,
      accountNumber: String,
      ifscCode: String,
      bankName: String
    },
    declarationAccepted: Boolean,
  }  
},{ timestamps: true });

module.exports = mongoose.model('User', UserSchema);
