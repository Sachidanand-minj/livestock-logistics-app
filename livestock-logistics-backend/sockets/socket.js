const Shipment = require('../models/Shipment');

module.exports = (server) => {
  const io = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('🚛 Transporter connected via Socket.IO');

    socket.on('locationUpdate', async ({ shipmentId, lat, lng }) => {
      try {
        const shipment = await Shipment.findById(shipmentId);
        if (!shipment) return;

        // Push to travel history and update current location
        shipment.travelHistory = shipment.travelHistory || [];
        shipment.travelHistory.push({ lat, lng, timestamp: new Date() });
        shipment.currentLocation = { lat, lng };
        shipment.status = 'In Transit';
        shipment.timestamps = shipment.timestamps || {};
        shipment.timestamps.startedAt = shipment.timestamps.startedAt || new Date();

        await shipment.save();

        io.emit('locationUpdated', { shipmentId, lat, lng });
      } catch (err) {
        console.error('Location update error:', err.message);
      }
    });

    socket.on('completeShipment', async ({ shipmentId }) => {
      try {
        await Shipment.findByIdAndUpdate(shipmentId, {
          status: 'Delivered',
          'timestamps.completedAt': new Date()
        });

        io.emit('shipmentCompleted', { shipmentId });
      } catch (err) {
        console.error('Completion error:', err.message);
      }
    });

    socket.on('disconnect', () => {
      console.log('Transporter disconnected');
    });
  });
};
