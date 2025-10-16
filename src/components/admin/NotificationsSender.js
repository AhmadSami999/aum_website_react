import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { createNotification, assignNotificationToUsers } from '../../firebase/firestore';
import './NotificationsSender.css';

function NotificationsSender() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState('admins');
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      const users = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
      console.log("Fetched users:", users); // for debug
      setAllUsers(users);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      let recipients = [];
      if (target === 'admins') {
        recipients = allUsers.filter(u => u.role === 'admin');
      } else if (target === 'students') {
        recipients = allUsers.filter(u => u.role === 'student');
      } else {
        recipients = allUsers.filter(u => selectedUserIds.includes(u.uid));
      }

      const notifId = await createNotification(title, message, recipients.map(u => u.uid));
      await assignNotificationToUsers(notifId, recipients);

      setStatus('success: Notification sent!');
      setTitle('');
      setMessage('');
      setSelectedUserIds([]);
      setSearch('');
    } catch (err) {
      console.error(err);
      setStatus('error: Failed to send notification.');
    }
  };

  const formatUserLabel = (user) => {
    const email = user.email || '[no email]';
    const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.displayName || '';
    const role = user.role || 'no role';
    return `${email}${name ? ' — ' + name : ''} (${role})`;
  };

  const filteredUsers = allUsers
    .filter(u =>
      formatUserLabel(u).toLowerCase().includes(search.trim().toLowerCase()) &&
      !selectedUserIds.includes(u.uid)
    )
    .sort((a, b) => formatUserLabel(a).localeCompare(formatUserLabel(b)));

  const handleUserSelect = (user) => {
    setSelectedUserIds(prev => [...prev, user.uid]);
    setSearch('');
    setShowDropdown(false);
  };

  const handleRemoveUser = (uid) => {
    setSelectedUserIds(prev => prev.filter(id => id !== uid));
  };

  const renderStatus = () => {
    if (!status) return null;
    const isError = status.startsWith('error:');
    return (
      <div className={`message ${isError ? 'error' : 'success'}`}>
        {status.replace(/^(success:|error:)\s*/, '')}
      </div>
    );
  };

  return (
    <div className="home-editor">
      <h2>Send Notification</h2>
      {renderStatus()}

      <div className="editor-sections">
        <div className="editor-section">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label>Recipients</label>
              <select value={target} onChange={e => setTarget(e.target.value)}>
                <option value="admins">All Admins</option>
                <option value="students">All Students</option>
                <option value="custom">Specific Users</option>
              </select>
            </div>

            {target === 'custom' && (
              <div className="form-group">
                <label>Select Users</label>
                <div className="autosuggest-wrapper" ref={dropdownRef}>
                  <input
                    type="text"
                    placeholder="Type to search..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                  />
                  {showDropdown && search.trim() !== '' && (
                    <ul className="suggestion-dropdown">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                          <li key={user.uid} onClick={() => handleUserSelect(user)}>
                            {formatUserLabel(user)}
                          </li>
                        ))
                      ) : (
                        <li className="no-match">No matching users</li>
                      )}
                    </ul>
                  )}
                </div>

                {selectedUserIds.length > 0 && (
                  <div className="selected-users">
                    {allUsers
                      .filter(u => selectedUserIds.includes(u.uid))
                      .map(user => (
                        <span className="user-tag" key={user.uid}>
                          {user.email || user.displayName || user.uid}
                          <button onClick={() => handleRemoveUser(user.uid)}>×</button>
                        </span>
                      ))}
                  </div>
                )}
              </div>
            )}

            <div className="save-section">
              <button type="submit">Send Notification</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NotificationsSender;
