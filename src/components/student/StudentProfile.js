// /src/components/student/StudentProfile.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './StudentDashboard.css';

function StudentProfile() {
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

  useEffect(() => {
    if (userProfile) {
      setFormData({
        firstName:   userProfile.firstName   || '',
        lastName:    userProfile.lastName    || '',
        displayName: userProfile.displayName || '',
        phoneNumber: userProfile.phoneNumber || '',
      });
    }
  }, [userProfile]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      await updateUserProfile(formData);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setIsEditing(false);
    } catch (err) {
      setMessage({ text: `Error: ${err.message}`, type: 'error' });
    }
    setLoading(false);
  };

  if (!currentUser) {
    return (
      <div className="box">
        <div className="box-titlebar" style={{ flexDirection: 'row', alignItems: 'center' }}>
          <span className="box-heading">My Profile</span>
        </div>
        <div className="box-content">
          <p>Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="two-columns">
      {/* Left column: Profile box */}
      <div className="column column-left">
        <div className="box">
          <div className="box-titlebar" style={{ flexDirection: 'row', alignItems: 'center' }}>
            <span className="box-heading">My Profile</span>
            {!isEditing && (
              <button
                className="student-profile-edit-button"
                onClick={() => setIsEditing(true)}
                style={{
                  marginLeft: 'auto',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Edit
              </button>
            )}
          </div>
          <div className="box-content">
            {message.text && (
              <div className={`alert ${message.type}`}>{message.text}</div>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit}>
                {['firstName','lastName','displayName','phoneNumber'].map(field => (
                  <div className="form-group" key={field} style={{ marginBottom: '1rem' }}>
                    <label htmlFor={field} style={{ display: 'block', marginBottom: '0.25rem' }}>
                      {field === 'firstName' && 'First Name'}
                      {field === 'lastName' && 'Last Name'}
                      {field === 'displayName' && 'Display Name'}
                      {field === 'phoneNumber' && 'Phone Number'}
                    </label>
                    <input
                      id={field}
                      name={field}
                      type={field === 'phoneNumber' ? 'tel' : 'text'}
                      value={formData[field]}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                ))}

                <div className="form-buttons" style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="button"
                    className="student-profile-cancel-button"
                    onClick={() => {
                      setIsEditing(false);
                      if (userProfile) {
                        setFormData({
                          firstName:   userProfile.firstName   || '',
                          lastName:    userProfile.lastName    || '',
                          displayName: userProfile.displayName || '',
                          phoneNumber: userProfile.phoneNumber || '',
                        });
                      }
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      border: '1px solid #ccc',
                      background: 'none',
                      cursor: 'pointer',
                      borderRadius: '4px'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="save-button"
                    disabled={loading}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#800000',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '999px'
                    }}
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info" style={{ lineHeight: 1.6 }}>
                <div className="info-group">
                  <span className="info-label"><strong>Email:</strong></span>
                  <span className="info-value">{currentUser.email}</span>
                </div>
                <div className="info-group">
                  <span className="info-label"><strong>Full Name:</strong></span>
                  <span className="info-value">
                    {userProfile?.firstName && userProfile?.lastName
                      ? `${userProfile.firstName} ${userProfile.lastName}`
                      : 'Not provided'}
                  </span>
                </div>
                <div className="info-group">
                  <span className="info-label"><strong>Display Name:</strong></span>
                  <span className="info-value">{userProfile?.displayName || 'Not provided'}</span>
                </div>
                <div className="info-group">
                  <span className="info-label"><strong>Phone Number:</strong></span>
                  <span className="info-value">{userProfile?.phoneNumber || 'Not provided'}</span>
                </div>
                <div className="info-group">
                  <span className="info-label"><strong>Role:</strong></span>
                  <span className="info-value student-role-badge">
                    {userProfile?.role || 'Student'}
                  </span>
                </div>

                {userProfile?.studentInfo && (
                  <>
                    <h3 className="section-title" style={{ marginTop: '1rem' }}>
                      Student Information
                    </h3>
                    <div className="info-group">
                      <span className="info-label">Student ID:</span>
                      <span className="info-value">
                        {userProfile.studentInfo.studentId || 'Not set'}
                      </span>
                    </div>
                    <div className="info-group">
                      <span className="info-label">Program:</span>
                      <span className="info-value">
                        {userProfile.studentInfo.program || 'Not set'}
                      </span>
                    </div>
                    <div className="info-group">
                      <span className="info-label">Status:</span>
                      <span className="info-value">
                        {userProfile.studentInfo.enrollmentStatus || 'Not set'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right column: placeholder boxes */}
      <div className="column column-right">
        <div className="box">
          <div className="box-titlebar">
            <span className="box-heading">Academic Records</span>
          </div>
          <div className="box-content">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
              efficitur nisl at sapien tempus, ut ultrices sapien vehicula.
            </p>
          </div>
        </div>

        <div className="box">
          <div className="box-titlebar">
            <span className="box-heading">Emergency Contacts</span>
          </div>
          <div className="box-content">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
              vitae sapien a justo fermentum vehicula.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
