import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './UserStatus.css';

function UserStatus() {
  const { currentUser, userProfile, role, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest('.user-dropdown')) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get first initial prioritizing userProfile which has more complete information
  const getInitial = () => {
    // Try to get initial from firstName if available in userProfile
    if (userProfile?.firstName) {
      return userProfile.firstName.charAt(0).toUpperCase();
    }
    // Fall back to displayName from userProfile or Auth
    else if (userProfile?.displayName) {
      return userProfile.displayName.charAt(0).toUpperCase();
    }
    // Fall back to Auth currentUser displayName
    else if (currentUser?.displayName) {
      return currentUser.displayName.charAt(0).toUpperCase();
    }
    // Last resort: use email initial
    else if (currentUser?.email) {
      return currentUser.email.charAt(0).toUpperCase();
    }
    return 'U'; // Ultimate fallback
  };

  // Get full name for display
  const getDisplayName = () => {
    if (userProfile?.firstName && userProfile?.lastName) {
      return `${userProfile.firstName} ${userProfile.lastName}`;
    } else if (userProfile?.displayName) {
      return userProfile.displayName;
    } else if (currentUser?.displayName) {
      return currentUser.displayName;
    } else {
      return currentUser?.email || 'User';
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      // No need to navigate - AuthContext will handle that
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  if (!currentUser) {
    return (
      <div className="user-status">
        <Link to="/login" className="login-link">Student Login</Link>
        <Link to="/signin" className="login-link admin-signin">Admin Login</Link>
      </div>
    );
  }

  return (
    <div className="user-status">
      <div className="user-dropdown">
        <div className="user-avatar" onClick={toggleDropdown}>
          {getInitial()}
        </div>
        <div className={`user-dropdown-content ${isOpen ? 'show' : ''}`}>
          <div className="user-info">
            <p className="user-name">{getDisplayName()}</p>
            <p className="user-role">{role}</p>
            {userProfile?.studentInfo?.studentId && (
              <p className="user-id">ID: {userProfile.studentInfo.studentId}</p>
            )}
          </div>
          <hr />
          {role === 'admin' && (
            <Link to="/admin" className="dropdown-item" onClick={() => setIsOpen(false)}>Admin Dashboard</Link>
          )}
          {role === 'student' && (
            <Link to="/student-dashboard" className="dropdown-item" onClick={() => setIsOpen(false)}>Student Dashboard</Link>
          )}
          {role === 'faculty' && (
            <Link to="/faculty-dashboard" className="dropdown-item" onClick={() => setIsOpen(false)}>Faculty Dashboard</Link>
          )}
          <Link to="/profile" className="dropdown-item" onClick={() => setIsOpen(false)}>My Profile</Link>
          <hr />
          <button onClick={handleLogout} className="dropdown-item logout-btn">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserStatus;