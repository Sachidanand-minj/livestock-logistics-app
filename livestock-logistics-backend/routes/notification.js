const express = require('express');
const router = express.Router();
const { createNotification, getNotifications, markAsRead } = require('../controllers/notificationController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.post('/', authenticateUser, createNotification);
router.get('/', authenticateUser, getNotifications);
router.patch('/:id/read', authenticateUser, markAsRead);

module.exports = router;