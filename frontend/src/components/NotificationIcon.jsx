import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { ACCESS_TOKEN } from '../constants';
import Popup from './Popup';
import LogDetail from './LogDetail';

const apiURL = import.meta.env.VITE_API_URL;

const NotificationIcon = () => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [active, setActive] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState(null);
  const [showLogDetail, setShowLogDetail] = useState(false);
  const containerRef = useRef(null);

  const fetchNotifications = () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    axios.get(`${apiURL}/api/notifications/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      const notifs = response.data;
      setNotifications(notifs);
      setNotificationCount(notifs.length);
      if (notifs.length > 0) {
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

  // Close notifications dropdown if clicking outside of the container
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [containerRef]);

  const handleIconClick = () => {
    setShowNotifications(!showNotifications);
  };

  const markNotificationAsRead = (notificationId) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    axios.put(`${apiURL}/api/notifications/${notificationId}/read/`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      // Remove the read notification from the list and update the count
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      setNotificationCount(prev => prev - 1);
    })
    .catch(error => {
      console.error("Error marking notification as read:", error);
    });
  };

  const handleNotificationClick = (notification) => {
    // Mark the notification as read
    markNotificationAsRead(notification.id);
  
    // Close the dropdown immediately
    setShowNotifications(false);
  
    // Use the log_id from the notification payload to show details if available
    if (notification.log_id) {
      setSelectedLogId(notification.log_id);
      setShowLogDetail(true);
    }
  };  

  const closeLogDetail = () => {
    setShowLogDetail(false);
    setSelectedLogId(null);
  };

  return (
    <div className="relative" ref={containerRef}>
      <div onClick={handleIconClick} style={{ cursor: "pointer" }}>
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
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg border rounded z-20">
          <ul>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <li 
                  key={notification.id} 
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleNotificationClick(notification)}
                >
                  {notification.message}
                </li>
              ))
            ) : (
              <li className="p-2">No new notifications</li>
            )}
          </ul>
        </div>
      )}
      {showLogDetail && selectedLogId && (
        <Popup onClose={closeLogDetail}>
          <LogDetail id={selectedLogId} />
        </Popup>
      )}
    </div>
  );
};

export default NotificationIcon;
