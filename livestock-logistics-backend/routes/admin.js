const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const { getAllUsers, deleteUser, deleteShipment } = require('../controllers/adminController');

// Get all users
router.get('/users', auth, role('admin'), getAllUsers);

// Delete user
router.delete('/users/:id', auth, role('admin'), deleteUser);

// Delete shipment
router.delete('/shipments/:id', auth, role('admin'), deleteShipment);

module.exports = router;
