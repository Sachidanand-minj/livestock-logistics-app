// const Shipment = require('../models/Shipment');

// module.exports = (server) => {
//   const io = require('socket.io')(server, {
//     cors: {
//       origin: '*',
//       methods: ['GET', 'POST']
//     }
//   });

//   io.on('connection', (socket) => {
//     console.log('New transporter connected');

//     socket.on('locationUpdate', async ({ shipmentId, lat, lng }) => {
//       await Shipment.findByIdAndUpdate(shipmentId, {
//         currentLocation: { lat, lng },
//         status: 'In Transit'
//       });
//       io.emit('locationUpdated', { shipmentId, lat, lng });
//     });

//     socket.on('completeShipment', async ({ shipmentId }) => {
//       await Shipment.findByIdAndUpdate(shipmentId, {
//         status: 'Delivered',
//         'timestamps.completedAt': new Date()
//       });
//       io.emit('shipmentCompleted', { shipmentId });
//     });
//   });
// };


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

    // Receive location updates
    socket.on('locationUpdate', async ({ shipmentId, lat, lng }) => {
      try {
        await Shipment.findByIdAndUpdate(shipmentId, {
          currentLocation: { lat, lng },
          status: 'In Transit',
          'timestamps.startedAt': new Date()
        });

        // Broadcast to frontend
        io.emit('locationUpdated', { shipmentId, lat, lng });
      } catch (err) {
        console.error('Location update error:', err.message);
      }
    });

    // Shipment complete
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
