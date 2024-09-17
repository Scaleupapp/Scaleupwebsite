import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Notifications.css'; // Import specific styles
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadingMarkAll, setLoadingMarkAll] = useState(false); // To handle loading state for Mark All as Read
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('https://scaleupapp.club/api/content/notifications', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setNotifications(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch notifications');
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    const notificationIds = notifications.map((notification) => notification._id);
    setLoadingMarkAll(true);
    try {
      await axios.post(
        'https://scaleupapp.club/api/content/notifications/mark-as-read',
        { notificationIds },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setNotifications([]); // Clear notifications after marking them as read
      setLoadingMarkAll(false);
    } catch (error) {
      setError('Failed to mark notifications as read');
      setLoadingMarkAll(false);
    }
  };

  const goToHomepage = () => {
    navigate('/profile');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="notifications-container">
      <h2>Your Notifications</h2>
      <div className="notifications-list">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div key={notification._id} className="notification-item">
              <p>{notification.content}</p>
              <span>{new Date(notification.createdAt).toLocaleString()}</span>
            </div>
          ))
        ) : (
          <p>No new notifications</p>
        )}
      </div>
      <div className="notifications-actions">
        <button onClick={goToHomepage} className="homepage-button">
          Go to Homepage
        </button>
        <button onClick={markAllAsRead} className="mark-all-read-button" disabled={loadingMarkAll}>
          {loadingMarkAll ? 'Marking...' : 'Mark All as Read'}
        </button>
      </div>
    </div>
  );
};

export default Notifications;
