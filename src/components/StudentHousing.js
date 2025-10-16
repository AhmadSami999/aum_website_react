import React, { useState, useEffect } from 'react';
import './StudentHousing.css';
import sampleImage from '../assets/university.jpg';
import { Helmet, HelmetProvider } from 'react-helmet-async';

function StudentHousing() {
  const [isMobile, setIsMobile] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Contact form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

  // Document tabs state
  const [activeTab, setActiveTab] = useState('request');

  // Check if screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    alert('Thank you! We will get back to you shortly.');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  // Housing images from public/img/housing-gallery/
  const housingImages = [];
  for (let i = 1; i <= 25; i++) {
    housingImages.push(`/img/housing-gallery/${i}.jpg`);
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % housingImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + housingImages.length) % housingImages.length);
  };

  return (
    <HelmetProvider>
      <div className="aum-student-housing-page">
        <Helmet prioritizeSeoTags>
          <title>Student Housing - American University of Malta</title>
          <meta
            name="description"
            content="Discover comfortable and convenient student housing at AUM. Modern accommodations with Wi-Fi, various options for male, female, and couple-friendly housing."
          />
        </Helmet>

        <header className="aum-page-header">
          <h1>Student Housing</h1>
        </header>

        <section className="aum-welcome-box">
          <div className="aum-welcome-text">
            <p><strong>Immerse Yourself in the Full University Experience</strong></p>
            <p>Unlock the ultimate student experience with AUM Housing! Dive into the vibrant world of college life while ensuring your safety and security. We're not just proud, we're thrilled to offer top-notch accommodation that doesn't just meet your needs but enhances your entire learning journey at AUM.</p>
          </div>
        </section>

        <section className="aum-two-column-section">
          <div className="aum-text-column">
            <p>Welcome to the heart of student living at AUM! Our Student Affairs Housing Division is your gateway to comfortable and convenient accommodations. At AUM Housing, we've got your needs and desires covered.</p>
            <p>Picture yourself strolling, biking, or even coming to campus on a bus or ferry from your AUM housing – Plus, we offer diverse housing options tailored to your preferences. Whether you're seeking <strong>Male-Only</strong>, <strong>Female-Only</strong>, or <strong>couple-friendly</strong> accommodations, we've got you sorted.</p>
            <p>Our University accommodations come complete with modern comforts like free Wi-Fi and more. But here's the scoop – if you're looking for something specific beyond our standard offerings, just reach out to the Student Affairs Office <strong>at least 30 days before the semester begins</strong> if you are looking for something different.</p>
          </div>
          <div className="aum-image-column">
            <img src="/img/4.jpg" alt="Student Housing" />
          </div>
        </section>

        <section className="aum-section-heading">
          <h1>Housing Options</h1>
        </section>

        <section className="aum-info-box">
          <div className="aum-info-text">
            <p>Remember, rooms are in hot demand and <strong>allocated on a first-come, first-served basis</strong>. So, securing your spot is a breeze with early booking and full payment before the semester kicks off is mandatory. For any questions about AUM Housing, shoot us an email at <a href="mailto:studentaffairs@aum.edu.mt">studentaffairs@aum.edu.mt</a>.</p>
          </div>
        </section>

        <section className="aum-section-heading">
          <h1>Housing Pricing</h1>
        </section>

        <section className="aum-two-column-section aum-pricing-section">
          <div className="aum-text-column">
            <div className="aum-pricing-card">
              <h3>Double Bedroom</h3>
              <p><strong>Student(s) will share a room in a shared apartment and will share their room with one other Student only.</strong></p>
              <p><strong>(2 Students in a room in a shared apartment)</strong></p>
              <div className="aum-price-highlight">
                <strong>Price: € 378.00 per Student per month*, excluding utility bills</strong>
              </div>
              <p><em>*(Payable in advance 30 days prior to semester starting)</em></p>
            </div>
            
            <div className="aum-pricing-card">
              <h3>Triple Bedroom</h3>
              <p><strong>Student(s) will share a room in the Hostel and will share their room with two other Students only.</strong></p>
              <p className="aum-note"><strong>Kindly note that the University does NOT offer triple rooms to female students.</strong></p>
              <p><strong>(3 Students in a room in a shared apartment)</strong></p>
              <div className="aum-price-highlight">
                <strong>Price: € 278.00 per Student per month*, excluding utility bills</strong>
              </div>
              <p><em>*(Payable in advance 30 days prior to semester starting)</em></p>
              <p className="aum-minimum-stay"><strong>*Minimum stay 6 months</strong></p>
            </div>
          </div>
          <div className="aum-image-column">
            <div className="aum-image-gallery">
              <div className="aum-gallery-container">
                <button className="aum-gallery-btn aum-prev-btn" onClick={prevImage}>‹</button>
                <div className="aum-image-display">
                  <img src={housingImages[currentImageIndex]} alt={`Housing ${currentImageIndex + 1}`} />
                </div>
                <button className="aum-gallery-btn aum-next-btn" onClick={nextImage}>›</button>
              </div>
              <div className="aum-image-indicators">
                {!isMobile && housingImages.map((_, index) => (
                  <button 
                    key={index}
                    className={`aum-indicator ${index === currentImageIndex ? 'aum-active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="aum-info-box">
          <div className="aum-info-text">
            <p className="aum-calendar-note">Kindly refer to the Academic Calendar for exact dates of each semester prior to booking and paying for your accommodation.</p>
          </div>
        </section>

        <section className="aum-section-heading">
          <h1>Type of Accommodation Available</h1>
        </section>

        <section className="aum-two-column-section aum-swapped">
          <div className="aum-image-column">
            <img src={sampleImage} alt="Housing Accommodation" />
          </div>
          <div className="aum-text-column">
            <p>Get ready for hassle-free living at AUM Housing! We've got your back with fully equipped and furnished accommodations featuring all the modern conveniences you need.</p>
            <p>While we offer <strong>Male and Female-only</strong> options, we're here to cater to your specific needs. If you're seeking something different, no worries! Just give a heads up to our Housing Team and the Office of Student Affairs (OSA) <strong>at least 30 days before you book and pay for your accommodation.</strong></p>
            <p>Your comfort, your choice – AUM Housing makes student living easy and adaptable. Join us today!</p>
          </div>
        </section>

        <section className="aum-section-heading">
          <h1>Housing Terms & Conditions</h1>
        </section>

        <section className="aum-info-box">
          <div className="aum-info-text">
            <p>Ready to dive into the world of AUM Housing? Let's make it crystal clear!</p>
            <p>When you secure your accommodation, you'll ink a Housing Contract with the University for the duration of your stay. Here's the exciting part: we charge a fully refundable €500 Housing Deposit. You'll get every euro back as long as your room/apartment is in top shape, with no tenant-induced damage – we're cool with fair wear and tear.</p>
          </div>
        </section>

        <section className="aum-two-column-section">
          <div className="aum-text-column">
            <p>Start by completing the Housing Request Form, a must-do at least <strong>30 days before the semester kicks off.</strong> Email it to <a href="mailto:studentaffairs@aum.edu.mt">studentaffairs@aum.edu.mt</a>, and our Office of Student Affairs (OSA) will take it from there. They'll be your guide through the paperwork process.</p>
            <p>Want to know more about AUM's Housing Policy and access the Housing Request Form? Dive into the information tabs below – your student housing journey begins here!</p>
          </div>
          <div className="aum-image-column">
            <div className="aum-document-tabs">
              <div className="aum-tab-buttons">
                <button 
                  className={`aum-tab-btn ${activeTab === 'request' ? 'aum-active' : ''}`}
                  onClick={() => setActiveTab('request')}
                >
                  HOUSING REQUEST
                </button>
                <button 
                  className={`aum-tab-btn ${activeTab === 'policy' ? 'aum-active' : ''}`}
                  onClick={() => setActiveTab('policy')}
                >
                  HOUSING POLICY
                </button>
                <button 
                  className={`aum-tab-btn ${activeTab === 'rules' ? 'aum-active' : ''}`}
                  onClick={() => setActiveTab('rules')}
                >
                  HOUSING RULES
                </button>
                <button 
                  className={`aum-tab-btn ${activeTab === 'procedures' ? 'aum-active' : ''}`}
                  onClick={() => setActiveTab('procedures')}
                >
                  STUDENT POLICIES & PROCEDURES
                </button>
              </div>
              <div className="aum-tab-content">
                {activeTab === 'request' && (
                  <div>
                    <h3>Housing Request Form</h3>
                    <p>Complete the Housing Request Form at least 30 days before the semester begins. This form is mandatory for all students seeking accommodation.</p>
                    <p>Email your completed form to: <a href="mailto:studentaffairs@aum.edu.mt">studentaffairs@aum.edu.mt</a></p>
                    <p>The Office of Student Affairs (OSA) will guide you through the entire paperwork process once your form is received.</p>
                  </div>
                )}
                {activeTab === 'policy' && (
                  <div>
                    <h3>Housing Policy</h3>
                    <p>All students must sign a Housing Contract with the University for the duration of their stay. Key policy points include:</p>
                    <ul>
                      <li>€500 fully refundable Housing Deposit required</li>
                      <li>Rooms allocated on first-come, first-served basis</li>
                      <li>Full payment required 30 days before semester starts</li>
                      <li>Minimum stay requirement of 6 months for certain accommodations</li>
                      <li>Fair wear and tear is acceptable; tenant-induced damage will be charged</li>
                    </ul>
                  </div>
                )}
                {activeTab === 'rules' && (
                  <div>
                    <h3>Housing Rules</h3>
                    <p>To ensure a comfortable living environment for all residents, the following rules must be followed:</p>
                    <ul>
                      <li>Respect quiet hours between 10 PM and 8 AM</li>
                      <li>No smoking in rooms or common areas</li>
                      <li>Guests must be registered with housing office</li>
                      <li>Keep common areas clean and tidy</li>
                      <li>Report maintenance issues promptly</li>
                      <li>Follow all University codes of conduct</li>
                    </ul>
                  </div>
                )}
                {activeTab === 'procedures' && (
                  <div>
                    <h3>Student Policies & Procedures</h3>
                    <p>General student policies and procedures that apply to all AUM students, including those in University housing:</p>
                    <ul>
                      <li>Academic integrity and conduct standards</li>
                      <li>Disciplinary procedures and appeals process</li>
                      <li>Emergency procedures and safety protocols</li>
                      <li>Student services and support resources</li>
                      <li>Grievance and complaint procedures</li>
                    </ul>
                    <p>For complete details, refer to the Student Handbook available through the Student Affairs Office.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="aum-contact-section">
          <h1>Contact Information</h1>
          <div className="aum-red-separator"></div>
          <p>Ready to secure your spot in AUM Housing?</p>

          <button className="aum-official-button">
            <a href="mailto:studentaffairs@aum.edu.mt" style={{color: 'white', textDecoration: 'none'}}>
              CONTACT STUDENT AFFAIRS
            </a>
          </button>

          <p>If you have any queries about Student Housing, kindly fill in the form below and we will get back to you as soon as possible.</p>

          <div className="aum-contact-form">
            <div className="aum-contact-left">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="aum-contact-right">
              <textarea
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                required
              />
              
              <button 
                type="submit" 
                onClick={handleSubmit}
                className="aum-send-btn"
              >
                Send
              </button>
            </div>
          </div>
        </section>
      </div>
    </HelmetProvider>
  );
}

export default StudentHousing;