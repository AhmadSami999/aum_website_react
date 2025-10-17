// src/components/Navbar.js - Updated to remove tablet navigation

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import './Navbar.css';
import logo from '../assets/logo.webp';
import UserStatus from './UserStatus';
import { FaBell } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [navbarItems, setNavbarItems] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth > 768 && window.innerWidth <= 1024);
  const [tickerText, setTickerText] = useState('');
  const [tickerEnabled, setTickerEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const { currentUser, role } = useAuth();

  useEffect(() => {
    async function loadNavbarConfig() {
      try {
        console.log('Loading navbar config from Firestore...');

        // UPDATED: Load from the same Firestore location as NavbarEditor saves to
        const docRef = doc(db, 'navbar', 'config');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log('Navbar config loaded from Firestore:', docSnap.data());
          const config = docSnap.data();
          const visibleItems = (config.items || getDefaultNavItems())
            .filter(item => item.visible)
            .sort((a, b) => {
              const orderA = a.order ?? 999;
              const orderB = b.order ?? 999;
              if (a.id === 'undergraduate') return -1;
              if (b.id === 'undergraduate') return 1;
              return orderA - orderB;
            });
          console.log('Processed navbar items:', visibleItems);
          setNavbarItems(visibleItems);
        } else {
          console.log('No navbar config found in Firestore, using defaults');
          setNavbarItems(getDefaultNavItems());
        }
      } catch (error) {
        console.error("Error loading navbar configuration:", error);
        // Fallback to default items if there's an error
        setNavbarItems(getDefaultNavItems());
      } finally {
        setLoading(false);
      }
    }

    async function loadTicker() {
      try {
        const snap = await getDoc(doc(db, 'settings', 'ticker'));
        if (snap.exists()) {
          const data = snap.data();
          setTickerText(data.text || '');
          setTickerEnabled(data.enabled ?? false);
        }
      } catch (error) {
        console.error("Error loading ticker text:", error);
      }
    }

    function handleResize() {
      const newIsMobile = window.innerWidth <= 768;
      const newIsTablet = window.innerWidth > 768 && window.innerWidth <= 1024;

      // FIXED: Clear all active states when switching between desktop/tablet/mobile
      setIsMobile(newIsMobile);
      setIsTablet(newIsTablet);

      // Force close mobile menu and clear dropdowns on resize
      setMobileMenuOpen(false);
      setActiveDropdown(null);
    }

    loadNavbarConfig();
    loadTicker();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // UPDATED: Default navbar items (same as in NavbarEditor for consistency)
  const getDefaultNavItems = () => [
    {
      id: 'undergraduate',
      title: 'Undergraduate',
      type: 'megamenu',
      visible: true,
      order: 1,
      megaMenuColumns: [
        {
          id: 'col-1',
          title: 'Business Programs',
          order: 1,
          items: [
            { title: 'Business Administration', url: '/program/business-admin', isExternal: false },
            { title: 'Marketing', url: '/program/marketing', isExternal: false }
          ]
        },
        {
          id: 'col-2',
          title: 'Technology Programs',
          order: 2,
          items: [
            { title: 'Computer Science', url: '/program/computer-science', isExternal: false },
            { title: 'Information Technology', url: '/program/it', isExternal: false }
          ]
        },
        {
          id: 'col-3',
          title: 'Resources',
          order: 3,
          items: [
            { title: 'Academic Calendar', url: '/academic-calendar', isExternal: false },
            { title: 'Course Catalog', url: '/catalog', isExternal: false },
            { title: 'Admissions Info', url: '/admissions', isExternal: false }
          ]
        }
      ]
    },
    {
      id: 'graduate',
      title: 'Graduate',
      type: 'megamenu',
      visible: true,
      order: 2,
      megaMenuColumns: [
        {
          id: 'grad-col-1',
          title: "Master's Programs",
          order: 1,
          items: [
            { title: 'MBA', url: '/program/mba', isExternal: false }
          ]
        },
        {
          id: 'grad-col-2',
          title: 'Resources',
          order: 2,
          items: [
            { title: 'Graduate Admissions', url: '/graduate-admissions', isExternal: false },
            { title: 'Research Opportunities', url: '/research', isExternal: false }
          ]
        }
      ]
    },
    {
      id: 'about',
      title: 'About',
      type: 'megamenu',
      visible: true,
      order: 3,
      megaMenuColumns: [
        {
          id: 'about-col-1',
          title: 'University',
          order: 1,
          items: [
            { title: 'Our University', url: '/our-university', isExternal: false },
            { title: 'Mission & Vision', url: '/mission', isExternal: false },
            { title: 'History', url: '/history', isExternal: false }
          ]
        },
        {
          id: 'about-col-2',
          title: 'People',
          order: 2,
          items: [
            { title: 'Faculty and Staff Directory', url: '/faculty-and-staff', isExternal: false },
            { title: 'Board of Trustees', url: '/board-of-trustees', isExternal: false },
            { title: 'Leadership', url: '/leadership', isExternal: false }
          ]
        },
        {
          id: 'about-col-3',
          title: 'Information',
          order: 3,
          items: [
            { title: 'Tuition Fees', url: '/tuition-fees', isExternal: false },
            { title: 'Contact Us', url: '/contact', isExternal: false }
          ]
        }
      ]
    },
    {
      id: 'student-life',
      title: 'Student Life',
      type: 'link',
      url: '/student-life',
      isExternal: false,
      visible: true,
      order: 4
    },
    {
      id: 'apply-now',
      title: 'APPLY NOW',
      type: 'button',
      url: 'https://apply.aum.edu.mt',
      isExternal: true,
      visible: true,
      order: 5
    }
  ];

  useEffect(() => {
    function handleClickOutside(e) {
      // Close mobile menu if clicking outside
      if (mobileMenuOpen && !e.target.closest('.nav-container') && !e.target.closest('.mobile-hamburger')) {
        setMobileMenuOpen(false);
        setActiveDropdown(null);
      }

      // Close dropdown if clicking outside nav items
      if (!e.target.closest('.nav-item') && !e.target.closest('.mobile-dropdown-container')) {
        setActiveDropdown(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  const toggleMobileMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMobileMenuOpen(prev => !prev);
    setActiveDropdown(null); // Clear any open dropdowns
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const toggleDropdown = (itemId, e) => {
    e.preventDefault();
    e.stopPropagation();

    // On mobile/tablet, allow dropdown toggle only if mobile menu is open
    if ((isMobile || isTablet) && !mobileMenuOpen) {
      return;
    }

    setActiveDropdown(activeDropdown === itemId ? null : itemId);
  };

  const renderNavItem = (item, context = 'desktop') => {
    const key = `${context}-${item.id}`;

    // Handle mega menus
    if (item.type === 'megamenu') {
      return (
        <div key={key} className="nav-item mega-menu-item">
          <a
            href="#"
            className={`nav-link ${activeDropdown === key ? 'active' : ''}`}
            onClick={(e) => toggleDropdown(key, e)}
            onMouseEnter={() => !isMobile && !isTablet && setActiveDropdown(key)}
            onMouseLeave={() => !isMobile && !isTablet && setActiveDropdown(null)}
          >
            {item.title}
            <span className={`dropdown-icon ${activeDropdown === key ? 'open' : ''}`}></span>
          </a>

          <div
            className={`mega-menu-content ${activeDropdown === key ? 'show' : ''}`}
            onMouseEnter={() => !isMobile && !isTablet && setActiveDropdown(key)}
            onMouseLeave={() => !isMobile && !isTablet && setActiveDropdown(null)}
          >
            <div className="mega-menu-container">
              {item.megaMenuColumns && item.megaMenuColumns
                .sort((a, b) => a.order - b.order)
                .map((column) => (
                  <div key={column.id} className="mega-menu-column">
                    {column.title && (
                      <h4 className="mega-menu-column-title">{column.title}</h4>
                    )}
                    <ul className="mega-menu-links">
                      {column.items && column.items.map((columnItem, itemIndex) => (
                        <li key={itemIndex}>
                          {columnItem.isExternal ? (
                            <a
                              href={columnItem.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => {
                                setActiveDropdown(null);
                                closeMobileMenu();
                              }}
                            >
                              {columnItem.title}
                            </a>
                          ) : (
                            <Link
                              to={columnItem.url}
                              onClick={() => {
                                setActiveDropdown(null);
                                closeMobileMenu();
                              }}
                            >
                              {columnItem.title}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </div>
        </div>
      );
    }

    // Handle regular dropdowns (for backward compatibility)
    if (item.type === 'dropdown') {
      return (
        <div key={key} className="nav-item">
          <a
            href="#"
            className={`nav-link ${activeDropdown === key ? 'active' : ''}`}
            onClick={(e) => toggleDropdown(key, e)}
            onMouseEnter={() => !isMobile && !isTablet && setActiveDropdown(key)}
            onMouseLeave={() => !isMobile && !isTablet && setActiveDropdown(null)}
          >
            {item.title}
            <span className={`dropdown-icon ${activeDropdown === key ? 'open' : ''}`}></span>
          </a>

          <div
            className={`dropdown-content ${activeDropdown === key ? 'show' : ''}`}
            onMouseEnter={() => !isMobile && !isTablet && setActiveDropdown(key)}
            onMouseLeave={() => !isMobile && !isTablet && setActiveDropdown(null)}
          >
            <ul>
              {item.dropdownItems && item.dropdownItems.map((dropdownItem, index) => (
                <li key={index}>
                  {dropdownItem.isExternal ? (
                    <a
                      href={dropdownItem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        setActiveDropdown(null);
                        closeMobileMenu();
                      }}
                    >
                      {dropdownItem.title}
                    </a>
                  ) : (
                    <Link
                      to={dropdownItem.url}
                      onClick={() => {
                        setActiveDropdown(null);
                        closeMobileMenu();
                      }}
                    >
                      {dropdownItem.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    // Handle buttons
    if (item.type === 'button') {
      return (
        <div key={key} className="nav-item apply-button">
          {item.isExternal ? (
            <a
              href={item.url}
              className="apply-btn"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => closeMobileMenu()}
            >
              {item.title}
            </a>
          ) : (
            <Link
              to={item.url}
              className="apply-btn"
              onClick={() => closeMobileMenu()}
            >
              {item.title}
            </Link>
          )}
        </div>
      );
    }

    // Default: regular link
    return (
      <div key={key} className="nav-item">
        {item.isExternal ? (
          <a
            href={item.url}
            className="nav-link"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => closeMobileMenu()}
          >
            {item.title}
          </a>
        ) : (
          <Link
            to={item.url}
            className="nav-link"
            onClick={() => closeMobileMenu()}
          >
            {item.title}
          </Link>
        )}
      </div>
    );
  };

  // REMOVED: getTabletItems function - no longer needed

  const getMainMenuItems = () => {
    // UPDATED: Return all navbar items for all screen sizes
    return navbarItems;
  };

  if (loading) {
    return (
      <>
        {tickerEnabled && tickerText && (
          <div className="ticker-bar">
            <marquee>{tickerText}</marquee>
          </div>
        )}
        <nav className="navbar">
          <div className="navbar-container">
            <div className="navbar-left">
              <Link to="/" className="logo">
                <img src={logo} alt="Logo" />
              </Link>
            </div>
            <div className="navbar-loading">Loading...</div>
          </div>
        </nav>
      </>
    );
  }

  return (
    <>
      {tickerEnabled && tickerText && (
        <div className="ticker-bar">
          <marquee>{tickerText}</marquee>
        </div>
      )}

      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <Link to="/" className="logo">
              <img src={logo} alt="Logo" />
            </Link>
          </div>

          {/* REMOVED: Tablet Navigation section - no longer needed */}

          {/* Mobile Navigation Components */}
          <div className="mobile-navbar-right">
            {(isMobile || isTablet) && currentUser && (
              <div className="mobile-notification-bell">
                <Link to={role === 'admin' ? "/admin/inbox" : "/student-dashboard/inbox"}>
                  <FaBell className="notification-bell-icon" />
                </Link>
              </div>
            )}

            {(isMobile || isTablet) && <UserStatus />}

            <div className="mobile-hamburger">
              <button
                className={`menu-icon ${mobileMenuOpen ? 'close-icon' : ''}`}
                onClick={toggleMobileMenu}
                type="button"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? '×' : '☰'}
              </button>
            </div>
          </div>

          {/* UPDATED: Main Navigation Menu - hidden on mobile and tablet */}
          <div className={`nav-container ${mobileMenuOpen ? 'menu-open' : ''}`}>
            <ul className="nav-menu">
              {getMainMenuItems().map(item => (
                <li key={item.id} className="nav-item">
                  {renderNavItem(item, 'main')}
                </li>
              ))}
            </ul>
          </div>

          {/* User Status and Bell - Desktop only */}
          <div className="navbar-right">
            {!isMobile && !isTablet && currentUser && (
              <div className="notification-bell">
                <Link to={role === 'admin' ? "/admin/inbox" : "/student-dashboard/inbox"}>
                  <FaBell className="notification-bell-icon" />
                </Link>
              </div>
            )}
            {!isMobile && !isTablet && <UserStatus />}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
