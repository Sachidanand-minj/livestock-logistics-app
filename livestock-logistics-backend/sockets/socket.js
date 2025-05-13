const Shipment = require('../models/Shipment');
const Notification = require('../models/Notification');

module.exports = (server) => {
  const io = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // 🔥 Make globally accessible
  global.io = io;

  io.on('connection', (socket) => {
    console.log('✅ New client connected');

    // 🔔 User joins personal notification room
    socket.on('registerUser', (userId) => {
      if (userId) {
        socket.join(userId.toString());
        console.log(`📥 User ${userId} joined room`);
      }
    });

    // 📍 Transporter sends location update
    socket.on('locationUpdate', async ({ shipmentId, lat, lng }) => {
      try {
        const shipment = await Shipment.findById(shipmentId);
        if (!shipment) return;

        shipment.travelHistory = shipment.travelHistory || [];
        shipment.travelHistory.push({ lat, lng, timestamp: new Date() });

        shipment.currentLocation = { lat, lng };
        shipment.status = 'In Transit';
        shipment.timestamps = shipment.timestamps || {};
        shipment.timestamps.startedAt = shipment.timestamps.startedAt || new Date();

        await shipment.save();

        io.emit('locationUpdated', { shipmentId, lat, lng });
      } catch (err) {
        console.error('🚨 Location update error:', err.message);
      }
    });

    // ✅ Mark shipment as delivered
    socket.on('completeShipment', async ({ shipmentId }) => {
      try {
        await Shipment.findByIdAndUpdate(shipmentId, {
          status: 'Delivered',
          'timestamps.completedAt': new Date()
        });

        io.emit('shipmentCompleted', { shipmentId });
      } catch (err) {
        console.error('🚨 Completion error:', err.message);
      }
    });

    // 🔌 Cleanup
    socket.on('disconnect', () => {
      console.log('❌ Client disconnected');
    });
  });
};
