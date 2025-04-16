const Shipment = require('../models/Shipment');

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
