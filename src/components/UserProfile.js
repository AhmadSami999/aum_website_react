// src/components/UserProfile.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import './UserProfile.css';

function UserProfile() {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const location = useLocation();
  
  // Check if this component is being rendered inside a dashboard
  const isInDashboard = location.pathname.includes('/student-dashboard') || 
                        location.pathname.includes('/admin');

  // Load user data into form
  useEffect(() => {
    if (userProfile) {
      setFormData({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        displayName: userProfile.displayName || '',
        phoneNumber: userProfile.phoneNumber || '',
      });
    }
  }, [userProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      await updateUserProfile(formData);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ text: `Error updating profile: ${error.message}`, type: 'error' });
    }

    setLoading(false);
  };

  if (!currentUser) {
    return <div className="profile-container">Please sign in to view your profile.</div>;
  }

  // Apply different classes for different contexts
  const containerClass = isInDashboard ? "dashboard-profile-container" : "profile-container";

  return (
    <div className={containerClass}>
      <div className="profile-header">
        <h1>My Profile</h1>
        {!isEditing && (
          <button 
            className="edit-button"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        )}
      </div>

      {message.text && (
        <div className={`alert ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="profile-card">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="displayName">Display Name</label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <div className="form-buttons">
              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  setIsEditing(false);
                  // Reset form to original userProfile
                  if (userProfile) {
                    setFormData({
                      firstName: userProfile.firstName || '',
                      lastName: userProfile.lastName || '',
                      displayName: userProfile.displayName || '',
                      phoneNumber: userProfile.phoneNumber || '',
                    });
                  }
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="save-button"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="info-group">
              <span className="info-label">Email:</span>
              <span className="info-value">{currentUser.email}</span>
            </div>

            <div className="info-group">
              <span className="info-label">Full Name:</span>
              <span className="info-value">
                {userProfile?.firstName && userProfile?.lastName 
                  ? `${userProfile.firstName} ${userProfile.lastName}`
                  : 'Not provided'}
              </span>
            </div>

            <div className="info-group">
              <span className="info-label">Display Name:</span>
              <span className="info-value">
                {userProfile?.displayName || 'Not provided'}
              </span>
            </div>

            <div className="info-group">
              <span className="info-label">Phone Number:</span>
              <span className="info-value">
                {userProfile?.phoneNumber || 'Not provided'}
              </span>
            </div>

            <div className="info-group">
              <span className="info-label">Role:</span>
              <span className="info-value role-badge">
                {userProfile?.role || 'Student'}
              </span>
            </div>

            {userProfile?.studentInfo && (
              <>
                <h3 className="section-title">Student Information</h3>
                <div className="info-group">
                  <span className="info-label">Student ID:</span>
                  <span className="info-value">{userProfile.studentInfo.studentId || 'Not assigned'}</span>
                </div>
                <div className="info-group">
                  <span className="info-label">Program:</span>
                  <span className="info-value">{userProfile.studentInfo.program || 'Not assigned'}</span>
                </div>
                <div className="info-group">
                  <span className="info-label">Status:</span>
                  <span className="info-value">{userProfile.studentInfo.enrollmentStatus || 'Not set'}</span>
                </div>
              </>
            )}

            {userProfile?.facultyInfo && (
              <>
                <h3 className="section-title">Faculty Information</h3>
                <div className="info-group">
                  <span className="info-label">Faculty ID:</span>
                  <span className="info-value">{userProfile.facultyInfo.facultyId || 'Not assigned'}</span>
                </div>
                <div className="info-group">
                  <span className="info-label">Department:</span>
                  <span className="info-value">{userProfile.facultyInfo.department || 'Not assigned'}</span>
                </div>
                <div className="info-group">
                  <span className="info-label">Position:</span>
                  <span className="info-value">{userProfile.facultyInfo.position || 'Not set'}</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;