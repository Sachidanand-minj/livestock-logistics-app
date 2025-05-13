const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const requireAuth = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const {
  getProfile,
  updateProfile,
  uploadAvatar
} = require('../controllers/userController');
const {
  getNotifications,
  markNotificationAsRead
} = require('../controllers/notificationController');

// 👤 User Profile
router.route('/me')
  .get(auth, getProfile)
  .put(auth, updateProfile);

router.post('/avatar', auth, upload.single('avatar'), uploadAvatar);

// 🔔 Notifications
router.get('/notifications', auth, getNotifications);
router.patch('/notifications/:id/read', auth, markNotificationAsRead);

module.exports = router;
