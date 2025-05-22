
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from "../Footer.js";
import ChatBot from "../ChatBot.js"
import ClipLoader from "react-spinners/ClipLoader"; // <-- make sure you import this

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const clientId = localStorage.getItem("clientId");

  useEffect(() => {
    const fetchNotifications = async () => {
      console.log("👀 Fetching notifications for clientId:", clientId);
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/client/notifications/${clientId}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.notifications)) {
          const sorted = data.notifications.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setNotifications(sorted);
        } else {
          console.error('Unexpected response:', data);
          setNotifications([]);
        }
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      fetchNotifications();
    } else {
      console.warn("⚠️ No clientId found!");
      setLoading(false);
    }
  }, [clientId]);

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/client/notifications/${id}/read`, {
        method: 'PATCH',
      });
      const data = await res.json();
      if (data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, read: true } : n))
        );
      } else {
        console.error('⚠️ Failed to mark as read:', data);
      }
    } catch (err) {
      console.error('❌ Error marking as read:', err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/client/notifications/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
      } else {
        console.error('⚠️ Failed to delete notification:', data);
      }
    } catch (err) {
      console.error('❌ Error deleting notification:', err);
    }
  };
  if (loading) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f3f4f6'
      }}>
        <ClipLoader size={50} color="#4b9cd3" />
      </div>
    );
  }

  if (!notifications.length) return <p style={{ paddingLeft: '1rem' }}>No notifications found.</p>;

  return (
    <div style={{ maxWidth: '600px', marginLeft: '1rem', padding: '1rem' }}>
      <h2 style={{ color: '#1E5470' }}>Notifications</h2>
      {notifications.map((notif) => (
        <Link to={`/property/${notif.propertyId}`} style={{ textDecoration: 'none' }}>
        <div
          key={notif._id}
          style={{
            border: '1px solid #ccc',
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '8px',
            backgroundColor: notif.read ? '#f0f0f0' : '#6EC1D133', // lighter accent for unread
            color: '#1C2529',
          }}
        >
          <p style={{ marginBottom: '0.5rem' }}>{notif.message}</p>
          <small>{new Date(notif.createdAt).toLocaleString()}</small>
          <div style={{ marginTop: '0.75rem' }}>
            {!notif.read && (
              <button
                onClick={() => markAsRead(notif._id)}
                style={{
                  marginRight: '0.5rem',
                  backgroundColor: '#6EC1D1',
                  color: 'white',
                  border: 'none',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Mark as Read
              </button>
            )}
            <button
              onClick={() => deleteNotification(notif._id)}
              style={{
                backgroundColor: '#1C2529',
                color: 'white',
                border: 'none',
                padding: '0.4rem 0.8rem',
                borderRadius: '4px',
                cursor: 'pointer',height:"auto"
              }}
            >
              Delete
            </button>
          </div>
        </div>
        </Link>
      ))}
      <ChatBot/>
      
    </div>
  );
};

export default NotificationsPage;
