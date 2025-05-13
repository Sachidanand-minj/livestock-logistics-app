const Notification = require('../models/Notification');

function notificationSocket(io) {
  io.on('connection', (socket) => {
    console.log('🔔 New client connected');

    socket.on('registerUser', (userId) => {
      socket.join(userId);
      console.log(`✅ User ${userId} joined room`);
    });

    // optional custom events
    socket.on('disconnect', () => {
      console.log('❌ Client disconnected');
    });
  });
}

module.exports = notificationSocket;