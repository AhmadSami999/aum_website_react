// /src/components/student/StudentFinances.js
import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './StudentDashboard.css';

function StudentFinances() {
  // expand/collapse state
  const [openCurrent, setOpenCurrent] = useState(false);
  const [openFuture, setOpenFuture] = useState(false);
  // tabs for Financial Aid
  const aidTabs = ['2025-2026', '2026-2027', '2027-2028'];
  const [activeAidTab, setActiveAidTab] = useState(aidTabs[0]);

  const dividerStyle = {
    border: 'none',
    borderBottom: '1px solid #ccc',
    margin: '0.75rem 0'
  };

  return (
    <div className="two-columns">
      {/* ─── Left column ─── */}
      <div className="column column-left">
        {/* Charge Summary */}
        <div className="box">
          <div className="box-titlebar">
            <span className="box-heading">Charge Summary</span>
          </div>
          <div className="box-content">
            {/* Current Amount Due */}
            <div>
              <button
                onClick={() => setOpenCurrent(!openCurrent)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {openCurrent ? <FaChevronUp /> : <FaChevronDown />}
                <strong>Current Amount Due:</strong> $0.00
              </button>
              {openCurrent && (
                <p style={{ margin: '0.5rem 0 0 1.75rem' }}>
                  Breakdown of current charges...
                </p>
              )}
            </div>

            <hr style={dividerStyle} />

            {/* Future Charges */}
            <div>
              <button
                onClick={() => setOpenFuture(!openFuture)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {openFuture ? <FaChevronUp /> : <FaChevronDown />}
                <strong>Future Charges:</strong> $0.00
              </button>
              {openFuture && (
                <p style={{ margin: '0.5rem 0 0 1.75rem' }}>
                  Breakdown of upcoming charges...
                </p>
              )}
            </div>

            {/* Pay Bill button */}
            <button
              style={{
                marginTop: '1rem',
                alignSelf: 'flex-start',
                backgroundColor: '#800000',
                color: '#fff',
                borderRadius: '999px',
                padding: '0.5rem 1rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Pay Bill
            </button>
          </div>

          {/* grey footer links */}
          <div className="box-footer">
            <a href="#">Billing History</a>
            <a href="#">Payment Plans</a>
            <a href="#">Refund Policy</a>
            <a href="#">Tax Documents</a>
            <a href="#">Download Statements</a>
          </div>
        </div>

        {/* Financial Aid and Scholarships */}
        <div className="box">
          <div className="box-titlebar">
            <span className="box-heading">Financial Aid &amp; Scholarships</span>
            <div className="tabs">
              {aidTabs.map((tab) => (
                <button
                  key={tab}
                  className={`tab-btn ${activeAidTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveAidTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="box-content">
            {activeAidTab === '2025-2026' && (
              <p>Content for the 2025–2026 aid year goes here.</p>
            )}
            {activeAidTab === '2026-2027' && (
              <p>Content for the 2026–2027 aid year goes here.</p>
            )}
            {activeAidTab === '2027-2028' && (
              <p>Content for the 2027–2028 aid year goes here.</p>
            )}
          </div>
        </div>
      </div>

      {/* ─── Right column ─── */}
      <div className="column column-right">
        {/* Financing Tasks */}
        <div className="box">
          <div className="box-titlebar">
            <span className="box-heading">Financing Tasks</span>
          </div>
          <div className="box-content">
            <p>No tasks at this time.</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="box">
          <div className="box-titlebar">
            <span className="box-heading">Frequently Asked Questions</span>
          </div>
          <div className="box-content">
            <p><strong>Q:</strong> Lorem ipsum dolor sit amet?</p>
            <p><strong>Q:</strong> Consectetur adipiscing elit?</p>
            <p><strong>Q:</strong> Vivamus quis elit vel magna?</p>
          </div>
        </div>

        {/* Contact Us */}
        <div className="box">
          <div className="box-titlebar">
            <span className="box-heading">Contact Us</span>
          </div>
          <div className="box-content">
            <p>We are available 24/7, 365 days a year to help you.</p>
            <hr style={dividerStyle} />
            <p>Chat</p>
            <hr style={dividerStyle} />
            <p>Call at +356 2169 6970</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentFinances;
