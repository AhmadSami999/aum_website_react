// /src/components/GDPRPopup.js

import React, { useState, useEffect } from 'react';
import './GDPRPopup.css';

const GDPRPopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('gdprConsent');
    if (!consent) {
      setShowPopup(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('gdprConsent', 'accepted');
    setShowPopup(false);
    // Additional logic for accepting cookies can be added here.
  };

  const handleReject = () => {
    localStorage.setItem('gdprConsent', 'rejected');
    setShowPopup(false);
    // Additional logic for rejecting cookies can be added here.
  };

  if (!showPopup) return null;

  return (
    <div className="gdpr-popup-container">
      <div className="gdpr-popup">
        <h3>We Value Your Privacy</h3>
        <p>
          We use cookies and similar technologies to improve your experience, personalize content and ads, and analyze our traffic. By clicking "Accept All," you consent to our cookies. If you choose "Reject All," only essential cookies will be used.
        </p>
        <div className="gdpr-buttons">
          <button className="btn-accept" onClick={handleAccept}>Accept All</button>
          <button className="btn-reject" onClick={handleReject}>Reject All</button>
        </div>
      </div>
    </div>
  );
};

export default GDPRPopup;
