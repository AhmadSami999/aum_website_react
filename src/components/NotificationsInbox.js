import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserNotifications, markNotificationAsRead } from '../firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import './NotificationsInbox.css';

function NotificationsInbox() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (!currentUser) return;
      const userNotifs = await fetchUserNotifications(currentUser.uid);
      const withDetails = await Promise.all(
        userNotifs.map(async (n) => {
          const notifDoc = await getDoc(doc(db, 'notifications', n.notificationId));
          const notifData = notifDoc.exists() ? notifDoc.data() : {};
          return { ...n, ...notifData };
        })
      );
      setNotifications(withDetails);
    };
    load();
  }, [currentUser]);

  const handleMarkAsRead = async (notificationId) => {
    if (!currentUser) return;
    await markNotificationAsRead(currentUser.uid, notificationId);
    setNotifications((prev) =>
      prev.map((n) =>
        n.notificationId === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const unread = notifications.filter(n => !n.read);
  const read = notifications.filter(n => n.read);

  return (
    <div className="notifications-inbox">
      <h2>Notifications</h2>

      {unread.length > 0 && (
        <section className="notif-section">
          <h3>Unread</h3>
          {unread.map(n => (
            <div key={n.notificationId} className="notif-card unread">
              <div className="notif-header">
                <strong>{n.title}</strong>
              </div>
              <p className="notif-message">{n.message}</p>
              <div className="notif-actions">
                <button onClick={() => handleMarkAsRead(n.notificationId)}>
                  Mark as Read
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {read.length > 0 && (
        <section className="notif-section">
          <h3>Read</h3>
          {read.map(n => (
            <div key={n.notificationId} className="notif-card">
              <div className="notif-header">
                <strong>{n.title}</strong>
              </div>
              <p className="notif-message">{n.message}</p>
            </div>
          ))}
        </section>
      )}

      {notifications.length === 0 && <p className="no-notifs">No notifications found.</p>}
    </div>
  );
}

export default NotificationsInbox;
