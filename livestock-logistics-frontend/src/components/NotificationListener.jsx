import { useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { NotificationContext } from '../context/NotificationContext';

const socket = io('https://livestocklogistics.animbiz.com', {
  transports: ['websocket'], // optional but improves reliability
});

const NotificationListener = () => {
  const { addNotification } = useContext(NotificationContext);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) return;

    socket.emit('registerUser', userId);

    socket.on('newNotification', (notification) => {
      addNotification(notification);
    });

    return () => {
      socket.off('newNotification');
    };
  }, [userId]);

  return null; // No UI rendered
};

export default NotificationListener;
