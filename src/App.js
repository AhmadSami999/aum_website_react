import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { HomeProvider } from './contexts/HomeContext';

import ScrollToTopButton from './components/ScrollToTopButton';
import { ResizedImageHandler } from './components/ResizedImageHandler';

/* ---------- Public components ---------- */
import Navbar from './components/Navbar';
import Home from './components/Home';
import Undergraduate from './components/Undergraduate';
import Graduate from './components/Graduate';
import OurUniversity from './components/OurUniversity';
import BoardOfTrustees from './components/BoardOfTrustees';
import FacultyAndStaff from './components/FacultyAndStaff';
import TuitionFees from './components/TuitionFees';
import Events from './components/Events';
import EventDetail from './components/EventDetail';
import News from './components/News';
import OdooExplorer from './components/OdooExplorer';
import NewsDetail from './components/NewsDetail';
import ProgramDetail from './components/ProgramDetail';
import Footer from './components/Footer';
import UserProfile from './components/UserProfile';
import ApplyNow from './components/ApplyNow';
import EnglishLanguageProgram from './components/EnglishLanguageProgram';
import StudentHousing from './components/StudentHousing';
import AgentPortal from './components/AgentPortal';
import WhyLiveInMalta from './components/WhyLiveInMalta';
import StudentVisa from './components/StudentVisa'; // NEW IMPORT
import QualityAssurance from './components/QualityAssurance';

/* ---------- Auth pages ---------- */
import SignIn from './components/auth/SignIn';
import Login from './components/auth/Login';
import ForgotPassword from './components/auth/ForgotPassword';

/* ---------- Admin components ---------- */
import AdminDashboard from './components/admin/AdminDashboard';
import PageEditor from './components/admin/PageEditor';
import ProgramEditor from './components/admin/ProgramEditor';
import EventsEditor from './components/admin/EventsEditor';
import NewsEditor from './components/admin/NewsEditor';
import FacultyManager from './components/admin/FacultyManager';
import NotificationsSender from './components/admin/NotificationsSender';
import TickerEditor from './components/admin/TickerEditor';
import UserManager from './components/admin/UserManager';
import AdminRoute from './components/admin/AdminRoute';
import NavbarEditor from './components/admin/NavbarEditor';

/* ---------- Student components ---------- */
import StudentDashboard from './components/student/StudentDashboard';
import StudentHome from './components/student/StudentHome';
import StudentFinances from './components/student/StudentFinances';
import StudentServiceCenter from './components/student/StudentServiceCenter';
import NotificationsInbox from './components/NotificationsInbox';
import StudentRoute from './components/student/StudentRoute';
import StudentProfile from './components/student/StudentProfile';

/* ---------- Misc ---------- */
import GDPRPopup from './components/GDPRPopup';

import './App.css';

// Placeholder for Resources until implemented
const ResourcesPlaceholder = () => (
  <div className="placeholder-page">
    <h2>Resources</h2>
    <p>This is the resources section of your student dashboard.</p>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <HomeProvider>
          <>
            <ResizedImageHandler />
            <GDPRPopup />

            <Routes>
              {/* ---------- Public pages ---------- */}
              <Route
                path="/"
                element={
                  <>
                    <Navbar />
                    <Home />
                    <Footer />
                  </>
                }
              />
              <Route path="/odoo-explorer" element={<OdooExplorer />} />
              <Route
                path="/undergraduate"
                element={
                  <>
                    <Navbar />
                    <Undergraduate />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/graduate"
                element={
                  <>
                    <Navbar />
                    <Graduate />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/our-university"
                element={
                  <>
                    <Navbar />
                    <OurUniversity />
                    <Footer />
                  </>
                }
              />

              <Route
                path="/english-language-program"
                element={
                  <>
                    <Navbar />
                    <EnglishLanguageProgram />
                    <Footer />
                  </>
                }
              />

              {/* Student Housing */}
              <Route
                path="/student-housing"
                element={
                  <>
                    <Navbar />
                    <StudentHousing />
                    <Footer />
                  </>
                }
              />

              {/* Agent Portal */}
              <Route
                path="/agent-portal"
                element={
                  <>
                    <Navbar />
                    <AgentPortal />
                    <Footer />
                  </>
                }
              />

              {/* Why Live In Malta */}
              <Route
                path="/why-live-in-malta"
                element={
                  <>
                    <Navbar />
                    <WhyLiveInMalta />
                    <Footer />
                  </>
                }
              />

              {/* Student Visa */}
              <Route
                path="/student-visa"
                element={
                  <>
                    <Navbar />
                    <StudentVisa />
                    <Footer />
                  </>
                }
              />

              {/* Quality Assurance */}
              <Route
                path="/quality-assurance"
                element={
                  <>
                    <Navbar />
                    <QualityAssurance />
                    <Footer />
                  </>
                }
              />

              <Route
                path="/board-of-trustees"
                element={
                  <>
                    <Navbar />
                    <BoardOfTrustees />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/faculty-and-staff"
                element={
                  <>
                    <Navbar />
                    <FacultyAndStaff />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/tuition-fees"
                element={
                  <>
                    <Navbar />
                    <TuitionFees />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/events"
                element={
                  <>
                    <Navbar />
                    <Events />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/events/:slugId"
                element={
                  <>
                    <Navbar />
                    <EventDetail />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/news"
                element={
                  <>
                    <Navbar />
                    <News />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/news/:slugId"
                element={
                  <>
                    <Navbar />
                    <NewsDetail />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/program/:slug"
                element={
                  <>
                    <Navbar />
                    <ProgramDetail />
                    <Footer />
                  </>
                }
              />
              {/* Apply Now */}
              <Route
                path="/apply"
                element={
                  <>
                    <Navbar />
                    <ApplyNow />
                    <Footer />
                  </>
                }
              />

              {/* User Profile */}
              <Route
                path="/profile"
                element={
                  <>
                    <Navbar />
                    <UserProfile />
                    <Footer />
                  </>
                }
              />

              {/* ---------- Auth ---------- */}
              <Route path="/signin" element={<SignIn />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/login" element={<Login />} />

              {/* ---------- Student dashboard ---------- */}
              <Route
                path="/student-dashboard"
                element={
                  <StudentRoute>
                    <StudentDashboard />
                  </StudentRoute>
                }
              >
                <Route index element={<StudentHome />} />
                <Route path="inbox" element={<NotificationsInbox />} />
                <Route path="profile" element={<StudentProfile />} />
                <Route path="finances" element={<StudentFinances />} />
                <Route path="service-center" element={<StudentServiceCenter />} />
                <Route path="resources" element={<ResourcesPlaceholder />} />
              </Route>

              {/* ---------- Admin dashboard ---------- */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              >
                <Route
                  index
                  element={<div className="welcome-admin">Welcome to Admin Dashboard</div>}
                />
                <Route path="navbar" element={<NavbarEditor />} />
                <Route path="page/:pageId" element={<PageEditor />} />
                <Route path="undergraduate-programs" element={<ProgramEditor programType="undergraduate" />} />
                <Route path="graduate-programs" element={<ProgramEditor programType="graduate" />} />
                <Route path="events" element={<EventsEditor />} />
                <Route path="news" element={<NewsEditor />} />
                <Route path="faculty-members" element={<FacultyManager />} />
                <Route path="notifications" element={<NotificationsSender />} />
                <Route path="inbox" element={<NotificationsInbox />} />
                <Route path="users" element={<UserManager />} />
                <Route path="ticker" element={<TickerEditor />} />
                <Route path="profile" element={<UserProfile />} />
              </Route>
            </Routes>

            {/* Scroll-to-top button across the site */}
            <ScrollToTopButton />
          </>
        </HomeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;