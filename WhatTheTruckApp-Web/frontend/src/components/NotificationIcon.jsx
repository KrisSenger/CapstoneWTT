import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ACCESS_TOKEN } from '../constants';

const NotificationIcon = () => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [active, setActive] = useState(false);

  const fetchNotifications = () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    axios.get('http://localhost:8000/api/notifications/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      const notifications = response.data;
      setNotificationCount(notifications.length);
      if (notifications.length > 0) {
        setActive(true);
        setTimeout(() => setActive(false), 5000);
      }
    })
    .catch(error => {
      console.error("Error fetching notifications:", error);
    });
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <svg
        className={`w-6 h-6 ${active ? 'text-red-500' : 'text-gray-500'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
        />
      </svg>
      {notificationCount > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
          {notificationCount}
        </span>
      )}
    </div>
  );
};

export default NotificationIcon;
