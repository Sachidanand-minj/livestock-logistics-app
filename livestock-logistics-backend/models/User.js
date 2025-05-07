const mongoose = require('mongoose');

// Sub-schema for transporter-specific details
const TransporterSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: function() { return this.parent().role === 'transporter'; },
    trim: true
  },
  businessType: {
    type: String,
    required: function() { return this.parent().role === 'transporter'; }
  },
  gstNumber: {
    type: String,
    required: function() { return this.parent().role === 'transporter'; }
    // validation temporarily removed for testing
  },
  panNumber: {
    type: String,
    required: function() { return this.parent().role === 'transporter'; }
    // validation temporarily removed for testing
  },
  contactPersonName: {
    type: String,
    required: function() { return this.parent().role === 'transporter'; }
  },
  contactPersonPhone: {
    type: String,
    required: function() { return this.parent().role === 'transporter'; },
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number']
  },
  vehicleType: {
    type: String,
    required: function() { return this.parent().role === 'transporter'; }
  },
  vehicleNumber: {
    type: String,
    required: function() { return this.parent().role === 'transporter'; }
  },
  driverName: {
    type: String,
    required: function() { return this.parent().role === 'transporter'; }
  },
  driverLicenseNumber: {
    type: String,
    required: function() { return this.parent().role === 'transporter'; }
  },
  documents: {
    gstCertificate: {
      type: String,
      required: function() { return this.parent().role === 'transporter'; }
    },
    panCard: {
      type: String,
      required: function() { return this.parent().role === 'transporter'; }
    },
    license: {
      type: String,
      required: function() { return this.parent().role === 'transporter'; }
    },
    vehicleRc: {
      type: String,
      required: function() { return this.parent().role === 'transporter'; }
    },
    insurance: {
      type: String,
      required: function() { return this.parent().role === 'transporter'; }
    }
  },
  bankDetails: {
    accountHolderName: {
      type: String,
      required: function() { return this.parent().role === 'transporter'; }
    },
    accountNumber: {
      type: String,
      required: function() { return this.parent().role === 'transporter'; }
    },
    ifscCode: {
      type: String,
      required: function() { return this.parent().role === 'transporter'; }
    },
    bankName: {
      type: String,
      required: function() { return this.parent().role === 'transporter'; }
    }
  },
  declarationAccepted: {
    type: Boolean,
    required: function() { return this.parent().role === 'transporter'; }
  }
}, { _id: false });

// Main User schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number']
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['sender', 'transporter', 'admin'],
    required: true
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verificationDetails: String, // optional admin comment
  avatar: String,
  resetToken: String,
  resetExpires: Date,

  // Nested transporter details
  transporter: {
    type: TransporterSchema,
    default: {}
  },

  rejectionReason: String
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
