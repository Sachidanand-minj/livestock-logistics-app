const Shipment = require('../models/Shipment');
const { sendNotification } = require('./notificationController');

// 🟢 1. Create a new shipment (Sender = Receiver)
exports.createShipment = async (req, res) => {
  try {
    const { livestockType, quantity, source, destination } = req.body;
    const senderId = req.user.id;

    const shipment = await Shipment.create({
      livestockType,
      quantity,
      source,
      destination,
      senderId,
      receiverId: senderId, // ✅ sender is also receiver
      status: 'Unassigned',
      isConfirmed: false
    });

    res.status(201).json(shipment);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create shipment', details: error.message });
  }
};



// 🟡 2. Get all shipments (for dashboards)
exports.getAllShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find()
      .populate('senderId', 'name email phone')
      .populate('receiverId', 'name email phone')
      .populate('transporterId', 'name email phone');

    res.json(shipments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shipments' });
  }
};



// 🔵 3. Accept a shipment (Transporter only)
exports.acceptShipment = async (req, res) => {
  const shipmentId = req.params.id;
  const transporterId = req.user.id;

  try {
    const shipment = await Shipment.findById(shipmentId);

    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    if (shipment.status !== 'Unassigned' || shipment.transporterId) {
      return res.status(400).json({ error: 'Shipment already assigned or accepted' });
    }

    shipment.transporterId = transporterId;
    shipment.status = 'Pending Confirmation';

    await shipment.save();

    res.json({
      message: 'Shipment accepted. Awaiting sender confirmation.',
      shipment
    });
  } catch (err) {
    res.status(500).json({ error: 'Error accepting shipment', details: err.message });
  }
};



// 🟣 4. Confirm transporter (Sender only)
exports.confirmTransporter = async (req, res) => {
  const shipmentId = req.params.id;
  const senderId = req.user.id;

  try {
    const shipment = await Shipment.findById(shipmentId);

    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    if (shipment.senderId.toString() !== senderId) {
      return res.status(403).json({ error: 'Not authorized to confirm this shipment' });
    }

    if (shipment.status !== 'Pending Confirmation' || !shipment.transporterId) {
      return res.status(400).json({ error: 'Shipment is not ready for confirmation' });
    }

    shipment.status = 'Confirmed';
    shipment.isConfirmed = true;

    await shipment.save();

    res.json({
      message: 'Transporter confirmed successfully',
      shipment
    });
  } catch (err) {
    res.status(500).json({ error: 'Error confirming transporter', details: err.message });
  }
};

// Upload proof (photo + video)
exports.uploadProof = async (req, res) => {
  const { shipmentId } = req.params;
  const files = req.files;

  try {
    const shipment = await Shipment.findById(shipmentId);
    if (!shipment) return res.status(404).json({ msg: 'Shipment not found' });

    shipment.proofPhoto = files.photo?.[0]?.path || '';
    shipment.proofVideo = files.video?.[0]?.path || '';
    shipment.proofUploaded = true;
    shipment.proofStatus = 'pending'; // 🔄 reset status on reupload
    
    await shipment.save();

    res.status(200).json({ msg: 'Proof uploaded successfully', shipment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error during proof upload' });
  }
};

// Admin approval or rejection of proof
exports.verifyProof = async (req, res) => {
  const { shipmentId } = req.params;
  const { approved } = req.body;

  try {
    const shipment = await Shipment.findById(shipmentId);
    if (!shipment) return res.status(404).json({ msg: 'Shipment not found' });

    shipment.proofStatus = approved ? 'approved' : 'rejected';
    await shipment.save();

    // 🔔 Emit notification to transporter
    await sendNotification(
      shipment.transporterId,
      approved ? 'success' : 'error',
      approved
        ? 'Your proof has been approved. You can now start tracking.'
        : 'Your uploaded proof has been rejected. Please re-upload.',
      '/dashboard?tab=myShipments'
    );

    res.status(200).json({ msg: `Proof ${approved ? 'approved' : 'rejected'}.`, shipment });
  } catch (err) {
    console.error('Error verifying proof:', err);
    res.status(500).json({ msg: 'Server error during proof verification' });
  }
};
