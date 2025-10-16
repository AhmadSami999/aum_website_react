import React, { useState, useEffect } from 'react';
import './StudentVisa.css';

// Import the hero image
const visaHeroImage = '/img/bg-3.jpg';
const bgTwoImage = '/img/bg-2.jpg';

function StudentVisa() {
  const [activeSection, setActiveSection] = useState('overview');
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const tableOfContents = [
    { id: 'overview', title: 'Visa Requirements' },
    { id: 'funds', title: 'Proof of Funds' },
    { id: 'trp', title: 'Temporary Residence Permit' },
    { id: 'contact', title: 'Contact Information' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = tableOfContents.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(tableOfContents[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Icon Components
  const MoneyIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/>
    </svg>
  );

  const HealthIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11,2V22C5.9,21.5 2,17.2 2,12C2,6.8 5.9,2.5 11,2M13,2C18.1,2.5 22,6.8 22,12C22,17.2 18.1,21.5 13,22V2M16.5,17L13,13.5L14.5,12L16.5,14L20,10.5L21.5,12L16.5,17Z"/>
    </svg>
  );

  const HomeIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
    </svg>
  );

  const DocumentIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
    </svg>
  );

  const proofOfFundsItems = [
    "Cash in convertible currency",
    "Traveler's checks", 
    "Check books for a foreign currency account",
    "Credit cards",
    "Any other means that guarantees funds in hard currency"
  ];

  const accommodationOptions = [
    "Hotel reservation or reservation for a similar establishment",
    "Documents proving the existence of a lease or a title deed, in the applicant's name, to a property situated in the country to be visited",
    "Where a third-country national states that he/she shall stay at a person's home or in an institution, the applicant must present a written declaration (Declaration of Proof) by the host which vouches for the host's commitment to accommodate",
    "Certificate which vouches for the commitment to accommodate, in the form of a harmonized form filled in by the host/institution and stamped by the competent authority in Malta"
  ];

  return (
    <div className="visa-page">
      {/* Hero Banner with Background Image */}
      <section className="hero-banner" style={{ backgroundImage: `url(${visaHeroImage})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-text">
            <div className="program-title-box">Student Visa to Study in Malta</div>
          </div>
        </div>
      </section>

      {/* Visa Overview Section */}
      <section id="overview" className="box-section section-white">
        <div className="section-inner">
          <div className="two-column-box">
            <div className="box-heading">
              <h2>Visa to Enter Malta for Studying Purposes</h2>
            </div>
            <div className="box-content">
              <p>
                Students who are not under the Visa waiver program to visit Malta will need to apply for a Visa to enter Malta.
              </p>
              
              <div className="visa-check-banner">
                <a href="#" className="visa-check-btn">Click Here to find out if you need a VISA</a>
              </div>

              <h3>Visa Requirements</h3>
              <p>
                In addition to the visa application form, a valid travel document and two (2) passport-size photographs, applicants need to produce the following documentation:
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section with Background Image */}
      <section className="requirements-section" style={{ backgroundImage: `url(${bgTwoImage})` }}>
        <div className="requirements-overlay"></div>
        <div className="requirements-content">
          <div className="requirements-inner">
            <h2 id="funds">VISA REQUIREMENTS</h2>
            
            <div className="requirements-grid">
              <div className="requirement-card">
                <div className="requirement-icon">
                  <MoneyIcon />
                </div>
                <h3>Proof of Funds</h3>
                <p>The level of means of subsistence shall be proportionate to the length and purpose of the stay, and to the amount of <strong>€ 48 per day</strong>.</p>
                <ul>
                  {proofOfFundsItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="requirement-card">
                <div className="requirement-icon">
                  <HealthIcon />
                </div>
                <h3>Health Insurance</h3>
                <p>A valid individual or group Travel Medical Insurance to cover any expenses which might arise in connection with repatriation for medical reasons, urgent medical attention and/or emergency hospital treatment.</p>
                <div className="insurance-details">
                  <p><strong>Coverage:</strong> Valid throughout Schengen Member States</p>
                  <p><strong>Minimum Coverage:</strong> € 30,000</p>
                  <p><strong>Duration:</strong> Entire period of stay</p>
                </div>
              </div>

              <div className="requirement-card">
                <div className="requirement-icon">
                  <HomeIcon />
                </div>
                <h3>Accommodation</h3>
                <p>Documentation proving your accommodation arrangements in Malta:</p>
                <ul>
                  {accommodationOptions.map((option, index) => (
                    <li key={index}>{option}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRP Section */}
      <section id="trp" className="box-section section-grey">
        <div className="section-inner">
          <div className="two-column-box">
            <div className="box-heading">
              <h2>Temporary Residence Permit (TRP)</h2>
            </div>
            <div className="box-content">
              <p>
                The Student Residency Advisory Service is a division of the Office of the Student Affairs (OSA). Our expertise lies in guiding students through the application and renewal process for a Maltese Temporary Residence Permit (TRP) which may be tied to their studies, ensuring their lawful and comfortable residence in Malta.
              </p>
              
              <div className="note-box">
                <p><strong>Note:</strong> EU students do not have to apply for or hold a Maltese residency card.</p>
              </div>

              <p>
                At AUM, we're here to make your stay in Malta seamless and legally sound. Choose our Student Residency Service for a smooth transition to your new academic adventure.
              </p>

              <div className="trp-links">
                <a href="https://aum.edu.mt/student/temporary-residence-card/" className="trp-link" target="_blank" rel="noopener noreferrer">
                  <DocumentIcon />
                  <span>More Information about TRP</span>
                </a>
                <a href="#" className="trp-link">
                  <DocumentIcon />
                  <span>TRP Explained</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="box-section section-white">
        <div className="section-inner">
          <div className="two-column-box">
            <div className="box-heading">
              <h2>Contact the Admissions & Recruitment Office</h2>
            </div>
            <div className="box-content">
              <p>If you have any questions about the admissions process, make sure to contact our admissions team.</p>

              <div className="contact-info">
                <div className="contact-method">
                  <strong>Email:</strong> 
                  <a href="mailto:admissions@aum.edu.mt">admissions@aum.edu.mt</a>
                </div>
                <div className="contact-method">
                  <strong>Phone:</strong> 
                  <a href="tel:+35621696970">+356 2169 6970</a>
                </div>
              </div>

              <div className="contact-banner">
                <a href="/apply" className="contact-btn primary">Apply Now</a>
                <a href="mailto:admissions@aum.edu.mt" className="contact-btn">Email Admissions</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default StudentVisa;