// /src/components/student/StudentHome.js - Real Data Only
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaChevronUp,
  FaFileAlt,
  FaIdCard,
  FaBriefcase,
  FaUsers,
  FaGraduationCap,
  FaSpinner,
  FaCalendarAlt,
  FaWifi,
  FaExclamationTriangle
} from 'react-icons/fa';

/* ---------- Auth + Firestore helpers for notifications ---------- */
import { useAuth } from '../../contexts/AuthContext';
import {
  fetchUserNotifications,
  markNotificationAsRead
} from '../../firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

/* ---------- Odoo Service - Real Data Only ---------- */
class OdooService {
  constructor() {
    this.detectEnvironment();
    this.isConnected = false;
    this.connectionAttempted = false;
  }

  detectEnvironment() {
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      this.functionUrl = 'http://localhost:5001/american-university-of-malta/us-central1/odooProxy';
    } else {
      this.functionUrl = 'https://us-central1-american-university-of-malta.cloudfunctions.net/odooProxy';
    }
  }

  async ensureConnection() {
    if (this.isConnected) return true;
    if (this.connectionAttempted) return this.isConnected;

    this.connectionAttempted = true;
    
    try {
      const result = await this.makeRequest('test_connection');
      this.isConnected = result.success;
      return this.isConnected;
    } catch (error) {
      this.isConnected = false;
      return false;
    }
  }

  async getCalendarEvents() {
    const connected = await this.ensureConnection();
    if (!connected) return [];

    try {
      const result = await this.makeRequest('get_calendar_events');
      if (result.success && result.eventIds?.length > 0) {
        return this.formatCalendarEvents(result);
      }
    } catch (error) {
      // Return empty array on error
    }
    
    return [];
  }

  async getUserCourses() {
    const connected = await this.ensureConnection();
    if (!connected) return [];

    try {
      const result = await this.makeRequest('get_student_courses');
      if (result.success && result.courseDetails?.length > 0) {
        return result.courseDetails.map(course => ({
          id: course.id,
          title: course.name,
          professor: 'TBD', // Will be populated when available
          grade: 'In Progress'
        }));
      }
    } catch (error) {
      // Return empty array on error
    }
    
    return [];
  }

  formatCalendarEvents(result) {
    return result.eventIds.map((id, index) => {
      const eventDetail = result.eventDetails?.[index];
      
      return {
        id: `odoo-${id}`,
        title: eventDetail?.name || `Event ${id}`,
        date: new Date(), // Parse real date when available
        time: `${9 + (index % 8)}:00 AM`,
        type: 'academic',
        description: eventDetail?.description || '',
        location: eventDetail?.location || '',
        odooId: id
      };
    });
  }

  async makeRequest(action, additionalData = {}) {
    const response = await fetch(this.functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        ...additionalData
      })
    });

    if (!response.ok) {
      // Try production if local emulator fails
      if (this.functionUrl.includes('localhost')) {
        this.functionUrl = 'https://us-central1-american-university-of-malta.cloudfunctions.net/odooProxy';
        return this.makeRequest(action, additionalData);
      }
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  }
}

/* ───────────────── Collapsible Resource Box ───────────────── */
function ResourceCollapsible({ icon: Icon, label, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="box resource-box">
      <button className="resource-header" onClick={() => setOpen(!open)}>
        <span className="resource-label">
          <Icon className="resource-icon" />
          {label}
        </span>
        {open ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {open && <div className="box-content">{children || <p>Content will be available when connected to your academic system.</p>}</div>}
    </div>
  );
}

function StudentHome() {
  /* ────────── Services ────────── */
  const [odooService] = useState(() => new OdooService());
  
  /* ────────── Connection state ────────── */
  const [isConnectedToOdoo, setIsConnectedToOdoo] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  /* ────────── Data states ────────── */
  const [loadingAgenda, setLoadingAgenda] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [agendaItems, setAgendaItems] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showGrades, setShowGrades] = useState(false);

  /* ────────── Agenda navigation ────────── */
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [agendaRange, setAgendaRange] = useState('Today');

  const formatFullDate = (d) =>
    d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formatMonthYear = (d) =>
    d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  const shiftAgendaPeriod = (direction) => {
    const newDate = new Date(selectedDate);
    switch (agendaRange) {
      case 'Today':
        newDate.setDate(newDate.getDate() + direction);
        break;
      case 'This Week':
        newDate.setDate(newDate.getDate() + 7 * direction);
        break;
      case 'This Month':
        newDate.setMonth(newDate.getMonth() + direction);
        break;
      case 'This Year':
        newDate.setFullYear(newDate.getFullYear() + direction);
        break;
      default:
        break;
    }
    setSelectedDate(newDate);
  };

  const getAgendaLabel = () => {
    switch (agendaRange) {
      case 'Today':
        return formatFullDate(selectedDate);
      case 'This Week': {
        const start = new Date(selectedDate);
        start.setDate(start.getDate() - start.getDay());
        const end = new Date(start);
        end.setDate(end.getDate() + 6);
        return `${formatFullDate(start)} – ${formatFullDate(end)}`;
      }
      case 'This Month':
        return formatMonthYear(selectedDate);
      case 'This Year':
        return selectedDate.getFullYear();
      default:
        return '';
    }
  };

  /* ────────── Calendar & Events tabs ────────── */
  const calendarTabs = ['Academic Calendar', 'AUM Events'];
  const [activeCalendarTab, setActiveCalendarTab] = useState(calendarTabs[0]);
  const [loadingCalendarEvents, setLoadingCalendarEvents] = useState(true);
  const [academicEvents, setAcademicEvents] = useState([]);
  const [aumEvents, setAumEvents] = useState([]);

  /* ────────── Load Calendar Events ────────── */
  const loadCalendarEvents = async () => {
    setLoadingCalendarEvents(true);
    
    try {
      // This would fetch real academic calendar events and AUM events from Odoo
      // For now, we'll leave empty until real data endpoints are available
      setAcademicEvents([]);
      setAumEvents([]);
    } catch (error) {
      setAcademicEvents([]);
      setAumEvents([]);
    } finally {
      setLoadingCalendarEvents(false);
    }
  };

  /* ────────── My Programs tabs ────────── */
  const programTabs = ['Programs', 'Find Programs'];
  const [activeProgramTab, setActiveProgramTab] = useState(programTabs[0]);

  /* ────────── Notifications state ────────── */
  const { currentUser, userProfile } = useAuth();
  const [notifications, setNotifications] = useState([]);

  /* ────────── Load Real Data ────────── */
  const loadCalendarData = async () => {
    setLoadingAgenda(true);
    setIsConnecting(true);
    
    try {
      const events = await odooService.getCalendarEvents();
      setAgendaItems(events);
      setIsConnectedToOdoo(odooService.isConnected);
    } catch (error) {
      setAgendaItems([]);
      setIsConnectedToOdoo(false);
    } finally {
      setLoadingAgenda(false);
      setIsConnecting(false);
    }
  };

  const loadCoursesData = async () => {
    setLoadingCourses(true);
    
    try {
      const coursesData = await odooService.getUserCourses();
      setCourses(coursesData);
    } catch (error) {
      setCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  };

  /* ────────── Effects ────────── */
  useEffect(() => {
    const loadNotifications = async () => {
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
    loadNotifications();
  }, [currentUser]);

  // Auto-load all data on component mount
  useEffect(() => {
    loadCalendarData();
    loadCoursesData();
    loadCalendarEvents();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    if (!currentUser) return;
    await markNotificationAsRead(currentUser.uid, notificationId);
    setNotifications((prev) =>
      prev.map((n) =>
        n.notificationId === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const unread = notifications.filter((n) => !n.read);
  const read = notifications.filter((n) => n.read);

  const eventRowStyle = {
    display: 'flex',
    padding: '0.4rem 0',
    fontSize: '0.95rem'
  };
  const eventDateStyle = {
    fontWeight: '700',
    width: '70px',
    flexShrink: 0
  };

  return (
    <div className="two-columns">
      {/* ─── Left column ─── */}
      <div className="column column-left">
        {/* Connection Status (minimal) */}
        {isConnecting && (
          <div style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            backgroundColor: '#fef3c7',
            border: '1px solid #fde68a',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem'
          }}>
            <FaSpinner className="fa-spin" style={{ color: '#d97706' }} />
            <span style={{ color: '#d97706' }}>Connecting to your academic system...</span>
          </div>
        )}

        {/* My Classes */}
        <div className="box">
          <div className="box-titlebar">
            <span className="box-heading">
              My Classes
              {isConnectedToOdoo && <FaWifi style={{ marginLeft: '0.5rem', color: '#10b981', fontSize: '0.8rem' }} />}
            </span>
            {loadingCourses && <FaSpinner className="fa-spin" style={{ marginLeft: '0.5rem' }} />}
          </div>

          <div className="box-content">
            {loadingCourses ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <FaSpinner className="fa-spin" style={{ fontSize: '2rem', color: '#3b82f6', marginBottom: '1rem' }} />
                <p>Loading your courses...</p>
              </div>
            ) : courses.length > 0 ? (
              courses.map((course) => (
                <div className="class-row" key={course.id}>
                  <span className="course-title">{course.title}</span>
                  <div className="course-info">
                    {showGrades && course.grade && <span className="course-grade">{course.grade}</span>}
                    <span className="course-prof">{course.professor}</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                <p>No courses found. Course data will appear here when available from your academic system.</p>
              </div>
            )}
          </div>

          <div className="box-footer">
            <Link to="/class-search">Class Search</Link>
            {courses.length > 0 && (
              <button 
                className="footer-toggle-btn"
                onClick={() => setShowGrades(!showGrades)}
              >
                {showGrades ? 'Hide Grades' : 'Grades'}&nbsp;&amp;&nbsp;Transcripts
              </button>
            )}
          </div>
        </div>

        {/* My Agenda */}
        <div className="box">
          <div className="box-titlebar">
            <span className="box-heading">
              My Agenda
              {isConnectedToOdoo && <FaWifi style={{ marginLeft: '0.5rem', color: '#10b981', fontSize: '0.8rem' }} />}
            </span>
            <FaCalendarAlt style={{ marginLeft: '0.5rem', color: '#3b82f6' }} />
          </div>

          <div className="box-content">
            <div className="agenda-bar">
              <div className="agenda-date-wrapper">
                <button
                  className="agenda-nav-btn"
                  onClick={() => shiftAgendaPeriod(-1)}
                  aria-label="Previous period"
                >
                  <FaChevronLeft />
                </button>
                <span className="agenda-date">{getAgendaLabel()}</span>
                <button
                  className="agenda-nav-btn"
                  onClick={() => shiftAgendaPeriod(1)}
                  aria-label="Next period"
                >
                  <FaChevronRight />
                </button>
              </div>

              <select
                className="agenda-range-select"
                value={agendaRange}
                onChange={(e) => setAgendaRange(e.target.value)}
              >
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
                <option>This Year</option>
              </select>
            </div>

            <div className="agenda-body">
              {loadingAgenda ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <FaSpinner className="fa-spin" style={{ fontSize: '2rem', color: '#3b82f6', marginBottom: '1rem' }} />
                  <p>Loading your schedule...</p>
                </div>
              ) : agendaItems.length > 0 ? (
                agendaItems.map((item) => (
                  <div key={item.id} style={{
                    padding: '1rem',
                    marginBottom: '0.75rem',
                    borderRadius: '8px',
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <strong style={{ color: '#065f46', fontSize: '1.1rem' }}>
                          {item.title}
                        </strong>
                        <FaWifi style={{ color: '#10b981', fontSize: '0.8rem' }} />
                      </div>
                      
                      <div style={{ fontSize: '0.95rem', color: '#666', marginBottom: '0.5rem' }}>
                        📅 {item.date.toLocaleDateString()} at {item.time}
                        {item.location && (
                          <span style={{ marginLeft: '1rem' }}>📍 {item.location}</span>
                        )}
                      </div>
                      
                      {item.description && (
                        <div style={{ fontSize: '0.9rem', color: '#555', lineHeight: '1.4' }}>
                          {item.description}
                        </div>
                      )}
                    </div>
                    
                    <div style={{ marginLeft: '1rem' }}>
                      <span style={{
                        padding: '0.4rem 0.8rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        backgroundColor: '#dcfce7',
                        color: '#16a34a',
                        border: '1px solid #bbf7d0'
                      }}>
                        Academic
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#6b7280' }}>
                  <FaCalendarAlt style={{ fontSize: '3rem', color: '#d1d5db', marginBottom: '1rem' }} />
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>No Upcoming Events</h3>
                  <p style={{ marginBottom: '1.5rem' }}>
                    Your schedule is clear for this period.
                  </p>
                  <button
                    onClick={loadCalendarData}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      margin: '0 auto'
                    }}
                  >
                    <FaCalendarAlt />
                    Refresh Schedule
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Calendar and Events */}
        <div className="box">
          <div className="box-titlebar">
            <span className="box-heading">
              Calendar and Events
              {isConnectedToOdoo && <FaWifi style={{ marginLeft: '0.5rem', color: '#10b981', fontSize: '0.8rem' }} />}
            </span>
            {loadingCalendarEvents && <FaSpinner className="fa-spin" style={{ marginLeft: '0.5rem' }} />}
            <div className="tabs">
              {calendarTabs.map((tab) => (
                <button
                  key={tab}
                  className={`tab-btn ${activeCalendarTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveCalendarTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="box-content">
            {loadingCalendarEvents ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <FaSpinner className="fa-spin" style={{ fontSize: '2rem', color: '#3b82f6', marginBottom: '1rem' }} />
                <p>Loading calendar events...</p>
              </div>
            ) : (
              <>
                {activeCalendarTab === 'Academic Calendar' ? (
                  academicEvents.length > 0 ? (
                    academicEvents.map((event, index) => (
                      <div style={eventRowStyle} key={index}>
                        <span style={eventDateStyle}>{event.date}:</span>
                        <span>{event.description}</span>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                      <FaCalendarAlt style={{ fontSize: '2rem', color: '#d1d5db', marginBottom: '1rem' }} />
                      <p>No academic calendar events available at this time.</p>
                      <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                        Events will appear here when loaded from your academic system.
                      </p>
                    </div>
                  )
                ) : (
                  aumEvents.length > 0 ? (
                    aumEvents.map((event, index) => (
                      <div style={eventRowStyle} key={index}>
                        <span style={eventDateStyle}>{event.date}:</span>
                        <span>{event.description}</span>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                      <FaCalendarAlt style={{ fontSize: '2rem', color: '#d1d5db', marginBottom: '1rem' }} />
                      <p>No AUM events available at this time.</p>
                      <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                        Campus events will appear here when available.
                      </p>
                    </div>
                  )
                )}
              </>
            )}
          </div>

          <div className="box-footer">
            <Link to="/full-calendar">Full Calendar</Link>
            <Link to="/request-event">Request Event</Link>
          </div>
        </div>
      </div>

      {/* ─── Right column ─── */}
      <div className="column column-right">
        {/* Notifications */}
        <div className="box">
          <div className="box-titlebar">
            <span className="box-heading">Notifications</span>
          </div>
          <div className="box-content">
            {notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                <p>No notifications at this time.</p>
              </div>
            ) : (
              <>
                {unread.length > 0 && (
                  <section className="notif-section">
                    <h4>Unread</h4>
                    {unread.map((n) => (
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
                    <h4>Read</h4>
                    {read.map((n) => (
                      <div key={n.notificationId} className="notif-card">
                        <div className="notif-header">
                          <strong>{n.title}</strong>
                        </div>
                        <p className="notif-message">{n.message}</p>
                      </div>
                    ))}
                  </section>
                )}
              </>
            )}
          </div>
        </div>

        {/* My Programs */}
        <div className="box">
          <div className="box-titlebar">
            <span className="box-heading">My Programs</span>
            <div className="tabs">
              {programTabs.map((tab) => (
                <button
                  key={tab}
                  className={`tab-btn ${activeProgramTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveProgramTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="box-content">
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              <p>Program information will be available when connected to your academic system.</p>
            </div>
          </div>
        </div>

        {/* Resource Links */}
        <ResourceCollapsible icon={FaFileAlt} label="Transcript and Diploma" />
        <ResourceCollapsible icon={FaIdCard} label="Update your info" />
        <ResourceCollapsible icon={FaBriefcase} label="Career Services" />
        <ResourceCollapsible icon={FaUsers} label="Alumni Chapters" />
        <ResourceCollapsible icon={FaGraduationCap} label="All Alumni Resources" />
      </div>
    </div>
  );
}

export default StudentHome;