const Notification = require('../models/Notification');

/**
 * Save and emit a new notification
 */
const sendNotification = async (userId, type, message, link = '') => {
  try {
    const notification = await Notification.create({ userId, type, message, link });

    if (global.io) {
      global.io.to(userId.toString()).emit('new-notification', notification);
    }

    return notification;
  } catch (err) {
    console.error('sendNotification error:', err);
  }
};

/**
 * Fetch all notifications for a user
 */
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching notifications' });
  }
};

/**
 * Mark a notification as read
 */
const markNotificationAsRead = async (req, res) => {
  try {
    const notifId = req.params.id;
    await Notification.findByIdAndUpdate(notifId, { read: true });
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark as read' });
  }
};

module.exports = {
  sendNotification,
  getNotifications,
  markNotificationAsRead,
};
