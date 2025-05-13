import React, { useContext, useState, useRef, useEffect } from 'react';
import { NotificationContext } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const NotificationDropdown = () => {
  const { notifications, unreadCount, markAsRead } = useContext(NotificationContext);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClick = (notification) => {
    markAsRead(notification._id);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative p-2 rounded-full hover:bg-gray-200"
        onClick={() => setOpen(!open)}
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded shadow-lg z-50">
          <div className="p-2 border-b text-gray-700 font-semibold">Notifications</div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-sm text-gray-500">No new notifications.</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`p-3 text-sm cursor-pointer border-b hover:bg-gray-100 ${
                    !n.read ? 'bg-blue-50 font-semibold' : 'bg-white'
                  }`}
                  onClick={() => handleClick(n)}
                >
                  <div className={`text-sm ${n.type === 'error' ? 'text-red-600' : 'text-gray-800'}`}>
                    {n.message}
                  </div>
                  {n.timestamp && (
                    <div className="text-xs text-gray-500">
                      {new Date(n.timestamp).toLocaleString()}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
