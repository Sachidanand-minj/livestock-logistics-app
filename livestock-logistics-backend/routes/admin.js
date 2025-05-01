const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const {
  getAllUsers,
  getPendingUsers,
  approveUser,
  createUser,
  deleteUser,
  deleteShipment
} = require('../controllers/adminController');

// 🛡 Protected routes (admin only)
router.get('/users', auth, role('admin'), getAllUsers);
router.get('/pending-users', auth, role('admin'), getPendingUsers);
router.patch('/users/:id/approve', auth, role('admin'), approveUser); // ✅ Add this
router.post('/users', auth, role('admin'), createUser);
router.delete('/users/:id', auth, role('admin'), deleteUser);
router.delete('/shipments/:id', auth, role('admin'), deleteShipment);

module.exports = router;
