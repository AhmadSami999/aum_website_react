// /src/components/admin/UserManager.js

import React, { useState, useEffect } from 'react';
import {
  fetchAllUsers,
  updateUserRole,
  sendResetPasswordEmail,
  addUser,
  deleteUser
} from '../../firebase/firestore';
import './UserManager.css';

function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingRoles, setPendingRoles] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [welcomeCheckboxes, setWelcomeCheckboxes] = useState({});
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'student',
    autoPassword: true
  });
  const [sendWelcome, setSendWelcome] = useState(true);
  const [showGeneratedPassword, setShowGeneratedPassword] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      const fetchedUsers = await fetchAllUsers();
      setUsers(fetchedUsers);
      setLoading(false);
    };
    loadUsers();
  }, []);

  const handleRoleChange = (uid, newRole) => {
    setPendingRoles(prev => ({ ...prev, [uid]: newRole }));
    if (newRole === 'student') {
      setWelcomeCheckboxes(prev => ({ ...prev, [uid]: true }));
    } else {
      setWelcomeCheckboxes(prev => {
        const updated = { ...prev };
        delete updated[uid];
        return updated;
      });
    }
  };

  const handleSaveAllRoles = async () => {
    const updates = Object.entries(pendingRoles);
    for (const [uid, role] of updates) {
      await updateUserRole(uid, role);
    }
    setPendingRoles({});
    const refreshedUsers = await fetchAllUsers();
    setUsers(refreshedUsers);
  };

  const handlePasswordReset = async (email) => {
    await sendResetPasswordEmail(email);
    alert('Password reset email sent.');
  };

  const handleDeleteUser = async (uid) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await deleteUser(uid);
      const refreshedUsers = await fetchAllUsers();
      setUsers(refreshedUsers);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'role') {
      setNewUser(prev => ({
        ...prev,
        role: value
      }));
      if (value === 'student') {
        setSendWelcome(true);
      } else {
        setSendWelcome(false);
      }
    } else if (name === 'sendWelcome') {
      setSendWelcome(checked);
    } else {
      setNewUser(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleAddUser = async () => {
    const finalPassword = newUser.autoPassword ? generatePassword() : newUser.password;
    const newUserData = {
      email: newUser.email,
      role: newUser.role,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      password: finalPassword
    };

    const createdUser = await addUser(newUserData);
    setUsers([...users, createdUser]);
    setNewUser({ firstName: '', lastName: '', email: '', password: '', role: 'student', autoPassword: true });
    setSendWelcome(true);
    setShowAddForm(false);
    if (newUser.autoPassword) {
      setShowGeneratedPassword(finalPassword);
      setTimeout(() => setShowGeneratedPassword(null), 10000);
    }
  };

  const generatePassword = () => {
    return Math.random().toString(36).slice(-10) + "A1!";
  };

  const filteredUsers = users.filter(u => {
    const nameMatch =
      `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase());

    const roleMatch = roleFilter === 'all' || u.role === roleFilter;

    return nameMatch && roleMatch;
  });

  return (
    <div className="user-manager">
      {showGeneratedPassword && (
        <div className="message success">
          Generated password: <strong>{showGeneratedPassword}</strong>
        </div>
      )}
      <h1 className="user-manager__title">User Management</h1>

      <div className="user-manager__header" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="user-manager__search"
          style={{ height: '2.75rem', padding: '0 1rem', fontSize: '1rem', borderRadius: '8px', flex: '1 1 250px' }}
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{ height: '2.75rem', padding: '0 1rem', fontSize: '1rem', borderRadius: '8px', flex: '0 0 180px' }}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="student">Student</option>
          <option value="candidate">Candidate</option>
        </select>

        <button
          className="user-manager__button user-manager__button--add"
          onClick={() => {
            setNewUser({
              firstName: '', lastName: '', email: '', password: '', role: 'student', autoPassword: true
            });
            setSendWelcome(true);
            setShowAddForm(true);
          }}
        >
          + Add User
        </button>

        {Object.keys(pendingRoles).length > 0 && (
          <button
            onClick={handleSaveAllRoles}
            className="user-manager__button user-manager__button--save"
          >
            Save All Role Changes
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="user-manager__modal">
          <div className="user-manager__modal-content">
            <h2>Add New User</h2>
            <input type="text" name="firstName" placeholder="First Name" value={newUser.firstName} onChange={handleInputChange} className="user-manager__input" />
            <input type="text" name="lastName" placeholder="Last Name" value={newUser.lastName} onChange={handleInputChange} className="user-manager__input" />
            <input type="email" name="email" placeholder="Email" value={newUser.email} onChange={handleInputChange} className="user-manager__input" />
            <select name="role" value={newUser.role} onChange={handleInputChange} className="user-manager__select">
              <option value="admin">Admin</option>
              <option value="student">Student</option>
              <option value="candidate">Candidate</option>
            </select>

            {newUser.role === 'student' && (
              <label className="user-manager__checkbox">
                <input
                  type="checkbox"
                  name="sendWelcome"
                  checked={sendWelcome}
                  onChange={handleInputChange}
                /> Send Welcome Email
              </label>
            )}

            <label className="user-manager__checkbox">
              <input
                type="checkbox"
                name="autoPassword"
                checked={newUser.autoPassword}
                onChange={handleInputChange}
              /> Auto-generate password
            </label>

            {!newUser.autoPassword && (
              <input type="text" name="password" placeholder="Password" value={newUser.password} onChange={handleInputChange} className="user-manager__input" />
            )}

            <div className="user-manager__form-buttons">
              <button onClick={handleAddUser} className="user-manager__button user-manager__button--save">Save User</button>
              <button onClick={() => setShowAddForm(false)} className="user-manager__button user-manager__button--cancel">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="message">Loading users...</div>
      ) : (
        <div className="user-manager__table-wrapper">
          <table className="user-manager__table">
            <thead>
              <tr>
                <th>Email</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.uid}>
                  <td>{user.email}</td>
                  <td>{user.firstName || ''}</td>
                  <td>{user.lastName || ''}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <select
                        value={pendingRoles[user.uid] || user.role}
                        onChange={(e) => handleRoleChange(user.uid, e.target.value)}
                        className="user-manager__select"
                      >
                        <option value="admin">Admin</option>
                        <option value="student">Student</option>
                        <option value="candidate">Candidate</option>
                      </select>
                      {pendingRoles[user.uid] === 'student' && (
                        <label style={{ fontSize: '0.9rem' }}>
                          <input
                            type="checkbox"
                            checked={welcomeCheckboxes[user.uid] || false}
                            onChange={(e) => setWelcomeCheckboxes(prev => ({ ...prev, [user.uid]: e.target.checked }))}
                          /> Send Welcome Email
                        </label>
                      )}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handlePasswordReset(user.email)} className="user-manager__button">Reset Password</button>
                      <button onClick={() => handleDeleteUser(user.uid)} className="user-manager__button user-manager__button--cancel">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UserManager;