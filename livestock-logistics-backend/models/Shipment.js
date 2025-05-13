const mongoose = require('mongoose');

const ShipmentSchema = new mongoose.Schema({
  livestockType: { type: String, required: true },
  quantity: { type: Number, required: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },

  // Roles
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // will auto-fill as senderId
  transporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

  // Tracking & status
  currentLocation: {
    lat: Number,
    lng: Number
  },
  status: {
    type: String,
    enum: ['Unassigned', 'Pending Confirmation', 'Confirmed', 'In Transit', 'Delivered'],
    default: 'Unassigned'
  },
  isConfirmed: { type: Boolean, default: false },
  timestamps: {
    startedAt: Date,
    completedAt: Date
  },
    // 📸 Proof verification
    proofPhoto: { type: String, default: "" },
    proofVideo: { type: String, default: "" },
    proofUploaded: { type: Boolean, default: false },
    proofRejected: { type: Boolean, default: false },
    proofStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
    
}, { timestamps: true });

module.exports = mongoose.model('Shipment', ShipmentSchema);
