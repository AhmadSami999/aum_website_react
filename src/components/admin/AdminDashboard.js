// src/components/admin/AdminDashboard.js - Fixed Programs submenu + Added QA Editor
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { fetchUserNotifications } from '../../firebase/firestore';
import './AdminDashboard.css';
import NavbarEditor from './NavbarEditor';

function AdminDashboard() {
  const { currentUser, logout, role } = useAuth();
  const [activeSection, setActiveSection] = useState('website');
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  /* -------------------------------------------------- */
  useEffect(() => {
    const loadUnread = async () => {
      if (!currentUser) return;
      const notifications = await fetchUserNotifications(currentUser.uid);
      const unread = notifications.filter(n => !n.read);
      setUnreadCount(unread.length);
    };
    loadUnread();
  }, [currentUser, location.pathname]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarOpen && !e.target.closest('.admin-sidebar') && !e.target.closest('.mobile-menu-btn')) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [sidebarOpen]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);
  /* -------------------------------------------------- */

  return (
    <div className={`admin-dashboard ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Mobile menu button */}
      <button 
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle navigation menu"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* ---------- SIDEBAR ---------- */}
      <div className="admin-sidebar">
        <div className="admin-user-info">
          <p>Logged in as: {currentUser.email}</p>
          <p>Role: {role}</p>
          <button onClick={logout} className="logout-btn">Log Out</button>
        </div>

        <nav className="admin-nav">
          <ul>
            {/* ------------ ADMIN‑ONLY MENUS ------------- */}
            {role === 'admin' && (
              <>
                {/* WEBSITE submenu */}
                <li className={activeSection === 'website' ? 'active' : ''}>
                  <button
                    className="sidebar-btn"
                    onClick={() =>
                      setActiveSection(activeSection === 'website' ? '' : 'website')
                    }
                  >
                    Website
                  </button>
                  {activeSection === 'website' && (
                    <ul className="submenu">
                      <li><Link to="/admin/page/home">Home Page</Link></li>
                      <li><Link to="/admin/page/undergraduate">Undergraduate Page</Link></li>
                      <li><Link to="/admin/page/ourUniversity">Our University Page</Link></li>
                      <li><Link to="/admin/page/facultyAndStaff">Faculty And Staff Page</Link></li>
                      <li><Link to="/admin/page/tuitionFees">Tuition Fees Page</Link></li>
                      <li><Link to="/admin/navbar">Navbar Editor</Link></li>
                      <li><Link to="/admin/ticker">Ticker Editor</Link></li>
                    </ul>
                  )}
                </li>

                {/* Faculty members single link */}
                <li>
                  <Link to="/admin/faculty-members" className="sidebar-btn">
                    Faculty Members
                  </Link>
                </li>

                {/* PROGRAMS submenu - FIXED */}
                <li className={activeSection === 'programs' ? 'active' : ''}>
                  <button
                    className="sidebar-btn"
                    onClick={() =>
                      setActiveSection(activeSection === 'programs' ? '' : 'programs')
                    }
                  >
                    Programs
                  </button>
                  {activeSection === 'programs' && (
                    <ul className="submenu">
                      <li><Link to="/admin/undergraduate-programs">Undergraduate Programs</Link></li>
                      <li><Link to="/admin/graduate-programs">Graduate Programs</Link></li>
                    </ul>
                  )}
                </li>

                {/* QUALITY ASSURANCE - NEW ADDITION */}
                <li>
                  <Link to="/admin/page/qualityAssurance" className="sidebar-btn">
                    Quality Assurance
                  </Link>
                </li>

                {/* EVENTS submenu */}
                <li className={activeSection === 'events' ? 'active' : ''}>
                  <button
                    className="sidebar-btn"
                    onClick={() =>
                      setActiveSection(activeSection === 'events' ? '' : 'events')
                    }
                  >
                    Events
                  </button>
                  {activeSection === 'events' && (
                    <ul className="submenu">
                      <li><Link to="/admin/events">Events Editor</Link></li>
                    </ul>
                  )}
                </li>

                {/* NEWS submenu */}
                <li className={activeSection === 'news' ? 'active' : ''}>
                  <button
                    className="sidebar-btn"
                    onClick={() =>
                      setActiveSection(activeSection === 'news' ? '' : 'news')
                    }
                  >
                    News
                  </button>
                  {activeSection === 'news' && (
                    <ul className="submenu">
                      <li><Link to="/admin/news">News Editor</Link></li>
                    </ul>
                  )}
                </li>

                {/* Notifications sender */}
                <li>
                  <Link to="/admin/notifications" className="sidebar-btn">
                    Send Notifications
                  </Link>
                </li>

                {/* Users */}
                <li>
                  <Link to="/admin/users" className="sidebar-btn">
                    Manage Users
                  </Link>
                </li>
              </>
            )}

            {/* ------------ UNIVERSAL (admin + student) ------------- */}
            <li>
              <Link to="/admin/inbox" className="sidebar-btn notifications-link">
                Notifications
                {unreadCount > 0 && (
                  <span className="notif-badge">{unreadCount}</span>
                )}
              </Link>
            </li>

            {role === 'student' && (
              <li>
                <div className="sidebar-btn">Welcome Student!</div>
              </li>
            )}
          </ul>
        </nav>
      </div>

      {/* ---------- MAIN CONTENT ---------- */}
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminDashboard;