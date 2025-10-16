import React from 'react';
import './Footer.css';
import footerLogo from '../assets/footer-logo.webp';
import mqf from '../assets/mqf.webp';
import getQualified from '../assets/getqualified.webp';
import aum from '../assets/aum.webp';
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <a href="/">
            <img src={footerLogo} alt="Footer Logo" className="footer-logo" />
          </a>
          <div className="footer-text">
            <p>American University of Malta</p>
            <p>Triq Dom Mintoff, Bormla,</p>
            <p>BML 1013, Malta</p>
            <p>Licence Number: 2016 - 002</p>
            <p>Category: University</p>
          </div>
          <div className="footer-bottom">
            <a href="https://qualifications.mfhea.gov.mt/#/institutions?institution=MFHEA-ORG-001&search=true">
              <img src={mqf} alt="MQF" className="footer-bottom-img" />
            </a>
            <a href="https://maltaenterprise.com/support/get-qualified-2017-2025">
              <img src={getQualified} alt="Get Qualified" className="footer-bottom-img" />
            </a>
          </div>
        </div>
        <div className="footer-center">
          <a href="#">
            <img src={aum} alt="AUM" className="footer-aum" />
          </a>
          <div className="social-media">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="social-icon" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="social-icon" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="social-icon" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <FaYoutube className="social-icon" />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom-text">
        <p>© {currentYear} by the American University of Malta</p>
      </div>
    </footer>
  );
}

export default Footer;