// /src/components/student/StudentServiceCenter.js
import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

/* ─── Helper: 2-column link grid ─── */
function LinkGrid({ links }) {
  return (
    <div className="link-grid">
      {links.map(({ label, url }) => (
        <a key={label} href={url} className="service-link">
          {label}
        </a>
      ))}
    </div>
  );
}

function StudentServiceCenter() {
  /* ---------- Left-column link data ---------- */
  const wellnessLinks = [
    { label: 'Counselling Services',      url: '#' },
    { label: 'Campus Health Clinic',      url: '#' },
    { label: 'Mental-Health Support',     url: '#' },
    { label: 'Fitness & Recreation',      url: '#' },
    { label: 'Nutrition Advice',          url: '#' },
    { label: 'Disability Services',       url: '#' },
    { label: 'Peer-Support Network',      url: '#' },
    { label: '24 / 7 Crisis Hotline',     url: '#' }
  ];

  const transportLinks = [
    { label: 'Bus Schedule',              url: '#' },
    { label: 'Campus Shuttle',            url: '#' },
    { label: 'Parking Permits',           url: '#' },
    { label: 'Bike-Share Program',        url: '#' },
    { label: 'Carpool Registry',          url: '#' },
    { label: 'Ride-Share Board',          url: '#' },
    { label: 'Transit Passes',            url: '#' },
    { label: 'Road-Closure Alerts',       url: '#' }
  ];

  const successLinks = [
    { label: 'Academic Advising',         url: '#' },
    { label: 'Tutoring Center',           url: '#' },
    { label: 'Writing Lab',               url: '#' },
    { label: 'Study-Skills Workshops',    url: '#' },
    { label: 'Career Coaching',           url: '#' },
    { label: 'Scholarship Office',        url: '#' },
    { label: 'International Support',     url: '#' },
    { label: 'First-Year Experience',     url: '#' }
  ];

  /* ─── State for expandables ─── */
  const [openReady, setOpenReady] = useState(false);
  const [openTeam, setOpenTeam]   = useState(false);

  /* ─── Divider style ─── */
  const dividerStyle = {
    border: 'none',
    borderBottom: '1px solid #ccc',
    margin: '0.75rem 0'
  };

  return (
    <div className="two-columns">
      {/* ─── Left column ─── */}
      <div className="column column-left">
        {/* Health & Wellness */}
        <div className="box">
          <div className="box-titlebar">
            <span className="box-heading">Health &amp; Wellness Resources</span>
          </div>
          <div className="box-content">
            <LinkGrid links={wellnessLinks} />
          </div>
        </div>

        {/* Transportation */}
        <div className="box">
          <div className="box-titlebar">
            <span className="box-heading">Transportation</span>
          </div>
          <div className="box-content">
            <LinkGrid links={transportLinks} />
          </div>
        </div>

        {/* Student Success & Support */}
        <div className="box">
          <div className="box-titlebar">
            <span className="box-heading">Student Success &amp; Support</span>
          </div>
          <div className="box-content">
            <LinkGrid links={successLinks} />
          </div>
        </div>
      </div>

      {/* ─── Right column ─── */}
      <div className="column column-right">
        {/* Social Activities */}
        <div className="box">
          <div className="box-titlebar">
            <span className="box-heading">Social Activities</span>
          </div>
          <div className="box-content">
            <div>
              <strong>Sun Devil Athletics</strong><br />
              Read articles, watch videos, and buy gear.
            </div>
            <hr style={dividerStyle} />
            <div>
              <strong>Student clubs and organizations</strong><br />
              Get involved with what interests you.
            </div>
            <hr style={dividerStyle} />
            <div>
              <strong>Associated Students of AUM</strong><br />
              Learn how Student Government advocates for you. Or join us!
            </div>
          </div>
        </div>

        {/* Jobs & Careers */}
        <div className="box">
          <div className="box-titlebar">
            <span className="box-heading">Jobs and Careers</span>
          </div>
          <div className="box-content">
            <div>
              <button
                onClick={() => setOpenReady(!openReady)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {openReady ? <FaChevronUp /> : <FaChevronDown />}
                <strong>Get Career Ready</strong>
              </button>
              {openReady && (
                <p style={{ margin: '0.5rem 0 0 1.75rem' }}>
                  Actrivate your personal career plan
                </p>
              )}
            </div>
            <hr style={dividerStyle} />
            <div>
              <button
                onClick={() => setOpenTeam(!openTeam)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {openTeam ? <FaChevronUp /> : <FaChevronDown />}
                <strong>Your career support team</strong>
              </button>
              {openTeam && (
                <p style={{ margin: '0.5rem 0 0 1.75rem' }}>
                  Connect with career support resources.
                </p>
              )}
            </div>
            <hr style={dividerStyle} />
            <div>
              <strong>Student employment - Job search</strong><br />
              apply for on/off campus part-time employment.
            </div>
          </div>
        </div>

        {/* On-campus Living */}
        <div className="box">
          <div className="box-titlebar">
            <span className="box-heading">On-campus Living</span>
          </div>
          <div className="box-content">
            <p>On-campus housing information wasn't found.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentServiceCenter;
