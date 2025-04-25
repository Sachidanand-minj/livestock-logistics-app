const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/shipment', require('./routes/shipment'));
app.use('/api/admin', adminRoutes); 
app.use('/api/user', userRoutes);
app.use('/uploads', express.static('uploads'));


const server = app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
app.get('/', (req, res) => {
  res.send('🚀 Livestock Logistics Backend is running!');
});

// Socket Setup
require('./sockets/socket')(server);
