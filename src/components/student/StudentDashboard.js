// /src/components/student/StudentDashboard.js - Enhanced with better Odoo integration
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useOdooUser } from '../../hooks/useOdooUser';
import './StudentDashboard.css';
import logo from '../../assets/logo.webp';
import {
  FaMinus,
  FaPlus,
  FaHome,
  FaChevronDown,
  FaBars,
  FaLightbulb,
  FaQuestionCircle,
  FaComment,
  FaUser,
  FaSpinner,
  FaExclamationTriangle,
  FaSync
} from 'react-icons/fa';
import { Link, NavLink, Outlet } from 'react-router-dom';

/* ───────────────────────────────────────────
   Collapsible Box Component
   ───────────────────────────────────────── */
function CollapsibleBox({ title, children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="box">
      <div className="box-titlebar">
        <span>{title}</span>
        <button
          className="collapse-button"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <FaPlus /> : <FaMinus />}
        </button>
      </div>
      <div className={`box-content ${collapsed ? 'collapsed' : 'expanded'}`}>
        {children}
      </div>
    </div>
  );
}

function StudentDashboard() {
  const { currentUser, logout, userProfile } = useAuth();
  const { odooUserInfo, loading: odooLoading, error: odooError, refetch: refetchOdoo } = useOdooUser();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Quick-link buttons
  const quickLinks = [
    { name: 'Outlook', url: '#' },
    { name: 'Microsoft OneDrive', url: '#' },
    { name: 'AUM Library', url: '#' },
    { name: 'My Apps', url: '#' },
    { name: 'Calendar', url: '#' },
    { name: 'Clubs and Orgs', url: '#' },
    { name: 'Zoom', url: '#' }
  ];

  // Display name helper
  const getDisplayName = () => {
    // First try Odoo user info (most authoritative)
    if (odooUserInfo?.name) {
      return odooUserInfo.name;
    }
    
    // Fallback to Firebase user profile
    if (userProfile?.firstName && userProfile?.lastName) {
      return `${userProfile.firstName} ${userProfile.lastName}`;
    } else if (userProfile?.displayName) {
      return userProfile.displayName;
    } else if (currentUser?.displayName) {
      return currentUser.displayName;
    }
    return currentUser?.email || 'User';
  };

 // Get registration number from Odoo with better error handling
  const getRegistrationNumber = () => {
    if (odooLoading) {
      return (
        <span className="loading-indicator">
          <FaSpinner className="spinner" /> Loading...
        </span>
      );
    }
    
    if (odooError) {
      return (
        <span className="error-indicator" title={`Error: ${odooError}`}>
          <FaExclamationTriangle /> Error loading ID
        </span>
      );
    }
    
    // First try the actual registration number (gr_no) from op.student
    if (odooUserInfo?.registrationNumber) {
      return odooUserInfo.registrationNumber; // This should be the gr_no field
    }
    
    // Fallback: format with Odoo ID if no registration number
    if (odooUserInfo?.odooId) {
      return `AUM-${odooUserInfo.odooId}`;
    }
    
    return (
      <span className="not-available" title="Student ID not found in Odoo">
        ID not available
      </span>
    );
  };

  // Get email with priority to Odoo
  const getEmail = () => {
    return odooUserInfo?.email || currentUser?.email || 'Not available';
  };

  // Get phone from Odoo
  const getPhone = () => {
    return odooUserInfo?.phone || 'Not available';
  };

  // Handle retry for Odoo data
  const handleRetryOdoo = () => {
    if (refetchOdoo) {
      refetchOdoo();
    }
  };

  /* Placeholder avatar (tall rectangle) */
  const avatarUrl =
    'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120&h=160&dpr=2';

  return (
    <div className="student-dashboard-container">
      {/* ─── Top Thin Grey Bar ─── */}
      <div className="thin-top-bar">
        <div className="thin-bar-content">
          <div className="right-links">
            <Link to="/">AUM Home</Link>
            <Link to="/my-aum">My AUM</Link>
            <Link to="/colleges-and-schools">Colleges and Schools</Link>
            <span className="user-name">{getDisplayName()}</span>
            <button className="sign-out" onClick={logout}>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* ─── Logo + My AUM Header ─── */}
      <div className="header-logo-bar">
        <img src={logo} alt="Logo" className="logo" />
        <span className="my-aum-text">My AUM</span>
      </div>

      {/* ─── Horizontal Navigation Bar ─── */}
      <nav
        className={`horizontal-nav ${mobileNavOpen ? 'mobile-open' : ''}`}
        aria-label="Primary"
      >
        {/* Hamburger (mobile only) */}
        <button
          className="hamburger-btn"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-label="Toggle navigation"
        >
          <FaBars />
        </button>

        <div className="nav-left">
          <NavLink
            end
            to="/student-dashboard"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
            onClick={() => setMobileNavOpen(false)}
          >
            <FaHome className="nav-icon" />
          </NavLink>

          <NavLink
            to="/student-dashboard/finances"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
            onClick={() => setMobileNavOpen(false)}
          >
            Finances
          </NavLink>

          <NavLink
            to="/student-dashboard/service-center"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
            onClick={() => setMobileNavOpen(false)}
          >
            Campus Services
          </NavLink>

          <NavLink
            to="/student-dashboard/profile"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
            onClick={() => setMobileNavOpen(false)}
          >
            Profile
          </NavLink>
        </div>

        {/* User dropdown (desktop) */}
        <div className="nav-right">
          <button
            className="user-dropdown-btn"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            {getDisplayName()} <FaChevronDown />
          </button>
          {userMenuOpen && (
            <div className="user-dropdown">
              <div className="user-dropdown-header">
                <img src={avatarUrl} alt="User avatar" className="user-avatar" />

                <div className="user-dropdown-details">
                  <div className="user-dropdown-name">{getDisplayName()}</div>
                  
                  {/* Enhanced user info section */}
                  <div className="user-dropdown-info">
                    <div className="info-row">
                      <span className="info-label">Primary Name:</span>
                      <span className="info-value">{getDisplayName()}</span>
                    </div>
                    
                    <div className="info-row">
                      <span className="info-label">AUM ID:</span>
                      <span className="info-value student-id">
                        {getRegistrationNumber()}
                        {odooError && (
                          <button 
                            className="retry-btn" 
                            onClick={handleRetryOdoo}
                            title="Retry loading from Odoo"
                          >
                            <FaSync />
                          </button>
                        )}
                      </span>
                    </div>
                    
                    <div className="info-row">
                      <span className="info-label">Email:</span>
                      <span className="info-value">{getEmail()}</span>
                    </div>
                    
                    {odooUserInfo?.phone && (
                      <div className="info-row">
                        <span className="info-label">Phone:</span>
                        <span className="info-value">{getPhone()}</span>
                      </div>
                    )}
                    
                    {/* Show Odoo connection status and debug info */}
                    <div className="info-row odoo-status">
                      <span className="info-label">Data Source:</span>
                      <span className={`info-value ${odooLoading ? 'loading' : odooError ? 'error' : 'success'}`}>
                        {odooLoading ? (
                          <>Odoo <FaSpinner className="spinner" /></>
                        ) : odooError ? (
                          <>Odoo <FaExclamationTriangle /></>
                        ) : odooUserInfo ? (
                          <>Odoo ✓ (ID: {odooUserInfo.odooId})</>
                        ) : (
                          'Local only'
                        )}
                      </span>
                    </div>
                    
                    {/* Debug info for development */}
                    {process.env.NODE_ENV === 'development' && odooUserInfo && (
                      <div className="info-row debug-info">
                        <span className="info-label">Debug:</span>
                        <details style={{ fontSize: '10px' }}>
                          <summary>Odoo Data</summary>
                          <pre style={{ 
                            background: '#f0f0f0', 
                            padding: '5px', 
                            borderRadius: '3px',
                            maxHeight: '200px',
                            overflow: 'auto'
                          }}>
                            {JSON.stringify({
                              odooId: odooUserInfo.odooId,
                              registrationNumber: odooUserInfo.registrationNumber,
                              name: odooUserInfo.name,
                              email: odooUserInfo.email,
                              uid: odooUserInfo.uid
                            }, null, 2)}
                          </pre>
                        </details>
                      </div>
                    )}
                    
                    <Link
                      to="/student-dashboard/profile"
                      className="view-profile-btn"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <FaUser /> View Profile
                    </Link>
                  </div>
                </div>
              </div>

              <div className="user-dropdown-separator"></div>

              <div className="user-dropdown-links">
                <Link
                  to="/new-features"
                  className="dropdown-link"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <FaLightbulb className="dropdown-link-icon" />
                  New Features
                </Link>
                <Link
                  to="/help"
                  className="dropdown-link"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <FaQuestionCircle className="dropdown-link-icon" />
                  Help
                </Link>
                <Link
                  to="/feedback"
                  className="dropdown-link"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <FaComment className="dropdown-link-icon" />
                  Feedback
                </Link>
              </div>

              <div className="user-dropdown-separator"></div>

              <button onClick={logout} className="sign-out-btn">
                Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* ─── Quick Links (grey pill boxes) ─── */}
      <div className="quick-links">
        {quickLinks.map(({ name, url }) => (
          <a
            key={name}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="quick-link-btn"
          >
            {name}
          </a>
        ))}
      </div>

      {/* ─── Main Content Outlet ─── */}
      <div className="student-main">
        <Outlet />
      </div>
    </div>
  );
}

export default StudentDashboard;