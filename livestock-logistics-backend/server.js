require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const shipmentRoutes = require('./routes/shipment'); // ✅ assumes correct file path

const app = express();
app.use(cors());
app.use(express.json());

// Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

// Static file access for uploaded files
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes); // ✅ keep only once
app.use('/api/shipment', shipmentRoutes); // ✅ this matches frontend POST path
// 🔥 REMOVE this (already covered above): app.use('/api/admin', adminRoutes);
// 🔥 REMOVE this (confusing duplicate): app.use('/api', shipmentRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('🚀 Livestock Logistics Backend is running!');
});

// Start server
const server = app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`)
);

// WebSocket support
require('./sockets/socket')(server);
