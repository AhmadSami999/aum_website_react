import React, { useState, useEffect } from 'react';

function AgentPortal() {
  const [activeSection, setActiveSection] = useState('overview');
  const [isMobile, setIsMobile] = useState(false);

  // Agency signup form state
  const [formData, setFormData] = useState({
    agencyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    country: '',
    website: '',
    experience: '',
    message: ''
  });

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
    console.log('Agency signup form submitted:', formData);
    alert('Thank you! We will review your application and get back to you shortly.');
    setFormData({
      agencyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      country: '',
      website: '',
      experience: '',
      message: ''
    });
  };

  const tableOfContents = [
    { id: 'overview', title: 'Welcome' },
    { id: 'resources', title: 'Marketing Resources' },
    { id: 'social', title: 'Stay Connected' },
    { id: 'signup', title: 'New Agent Signup' },
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

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  // Paper Icon Component
  const PaperIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
    </svg>
  );

  // Play Icon Component
  const PlayIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8,5.14V19.14L19,12.14L8,5.14Z"/>
    </svg>
  );

  const sections = [
    { 
      id: 'resources', 
      title: 'Available Marketing Resources',
      content: (
        <div>
          <p>Embark on a journey of discovery at the American University of Malta! Dive into our diverse array of courses and degrees, and be sure to grab a copy of our dynamic 2024-25 brochure. For a sneak peek into our vibrant university life, don't miss our captivating promo videos that offer a taste of what awaits you.</p>
          <p>Ready to take the next step? Contact our Admissions and Recruitment team directly at <a href="mailto:admissions@aum.edu.mt">admissions@aum.edu.mt</a> to explore a treasure trove of additional marketing resources designed to supercharge your journey with AUM. Your path to success starts here!</p>
          
          <div className="resource-cards">
            <div className="resource-card">
              <div className="resource-icon">
                <PaperIcon />
              </div>
              <h3>BROCHURE 2024-25</h3>
              <p>Download our comprehensive university brochure featuring all programs, campus life, and admission information.</p>
              <button className="download-btn">
                Download Brochure
              </button>
            </div>
            
            <div className="resource-card">
              <div className="resource-icon">
                <PlayIcon />
              </div>
              <h3>UNIVERSITY PROMO VIDEO</h3>
              <p>Watch our engaging promotional video showcasing campus facilities, student life, and academic excellence.</p>
              <button className="download-btn">
                Watch Video
              </button>
            </div>
            
            <div className="resource-card">
              <div className="resource-icon">
                <PlayIcon />
              </div>
              <h3>GRADUATION PROMO VIDEO</h3>
              <p>Experience the pride and achievement of our graduation ceremonies through this inspiring video.</p>
              <button className="download-btn">
                Watch Video
              </button>
            </div>
          </div>
        </div>
      )
    },
    { 
      id: 'social', 
      title: 'Stay Connected',
      content: (
        <div>
          <p>Join us in the online realm and ignite a vibrant connection between your agency and AUM. Encourage your students to immerse themselves in our dynamic social media universe, where real-time updates, captivating photos, and exciting videos paint a vivid picture of life within and around our Campus. Stay plugged in, stay engaged, and follow us on our social media channels to be a part of our thrilling journey together!</p>
          
          <div className="social-links">
            <a href="https://facebook.com/aum.edu.mt" target="_blank" rel="noopener noreferrer" className="social-link facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Facebook</span>
            </a>
            
            <a href="https://instagram.com/aum.edu.mt" target="_blank" rel="noopener noreferrer" className="social-link instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>Instagram</span>
            </a>
            
            <a href="https://linkedin.com/school/american-university-of-malta" target="_blank" rel="noopener noreferrer" className="social-link linkedin">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span>LinkedIn</span>
            </a>
            
            <a href="https://youtube.com/@americanuniversityofmalta" target="_blank" rel="noopener noreferrer" className="social-link youtube">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>YouTube</span>
            </a>
          </div>
        </div>
      )
    },
    { 
      id: 'signup', 
      title: 'New Agent Signup',
      content: (
        <div>
          <p>AUM's global reach spans across the map, as we eagerly seek out talent from every corner of the world. We place a tremendous value on the pivotal role that agents play in our dynamic marketing strategy. If you're ready to embark on an exciting journey with us for the first time, take the first step by filling out the form below. Discover the endless possibilities of becoming an integral part of our agent network, where your expertise meets our ambition!</p>
          
          <form onSubmit={handleSubmit} className="agent-signup-form">
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="agencyName"
                  placeholder="Agency Name *"
                  value={formData.agencyName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="contactPerson"
                  placeholder="Contact Person *"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number *"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="country"
                  placeholder="Country/Region *"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="url"
                  name="website"
                  placeholder="Agency Website"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="form-group full-width">
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
              >
                <option value="">Years of Experience in Education *</option>
                <option value="1-2">1-2 Years</option>
                <option value="3-5">3-5 Years</option>
                <option value="6-10">6-10 Years</option>
                <option value="10+">10+ Years</option>
              </select>
            </div>
            
            <div className="form-group full-width">
              <textarea
                name="message"
                placeholder="Tell us about your agency and why you'd like to partner with AUM..."
                value={formData.message}
                onChange={handleChange}
                rows={5}
              />
            </div>
            
            <button type="submit" className="submit-btn">
              SUBMIT APPLICATION
            </button>
          </form>
        </div>
      )
    }
  ];

  return (
    <div className="agent-portal-page">
      {/* Hero Banner with University Image */}
      <section className="hero-banner">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-text">
            <div className="program-title-box">Agent Portal</div>
            <h1 id="overview">Thank You For Being Our Trusted Partner</h1>
            <div>
              <p>
                Welcome to the American University of Malta's exclusive Agent Portal, where boundless opportunities await you! As an approved agent, this is your passport to a world of invaluable resources, equipping you to provide expert guidance to your students, empowering them to craft a brighter future. Our journey together is just beginning, and we can't contain our excitement about collaborating with you. Welcome aboard, and let's embark on this extraordinary partnership together!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Alternating Content Boxes */}
      <div>
        {sections.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            className={`box-section ${i % 2 === 0 ? 'section-white' : 'section-grey'}`}
          >
            <div className="section-inner">
              <div className="two-column-box">
                <div className="box-heading">
                  <h2>{s.title}</h2>
                </div>
                <div className="box-content">
                  {s.content}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <style jsx>{`
        .agent-portal-page {
          margin: 0 auto;
          padding: 0;
          background: #fff;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        /* Hero Banner */
        .hero-banner {
          position: relative;
          min-height: 60vh;
          background: url('/img/university.jpg');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          display: flex;
          align-items: center;
          color: white;
        }

.hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(16, 75, 135, 0.7) 0%, rgba(92, 128, 165, 0.6) 100%);
        }

        .hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }

        .hero-text {
          width: 100%;
          text-align: center;
        }

        .program-title-box {
          position: relative;
          margin-bottom: 30px;
          padding: 25px 20px;
          color: white;
          font-size: 42px;
          font-weight: 700;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
        }

        .hero-text h1 {
          font-size: 36px;
          color: white;
          font-weight: 600;
          margin-bottom: 30px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .hero-text p {
          text-align: center;
          font-size: 20px;
          line-height: 32px;
          font-weight: 300;
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
          margin: 0;
          max-width: 800px;
          margin: 0 auto;
        }

        /* Box Sections */
        .box-section {
          position: relative;
        }

        .section-inner {
          margin: 0 60px;
          padding: 50px;
          position: relative;
          z-index: 1;
        }

        .section-white .section-inner {
          background: #fff;
        }

        .section-grey .section-inner {
          background: #f7f7f7;
        }

        .two-column-box {
          display: flex;
          align-items: flex-start;
        }

        .box-heading {
          width: 30%;
          padding-right: 20px;
        }

        .box-heading h2 {
          margin: 0;
          font-size: 27px;
          color: #104b87;
          line-height: 34px;
        }

        .box-content {
          width: 70%;
        }

        .box-content > *:first-child {
          margin-top: 0;
        }

        /* Resource Cards */
        .resource-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .resource-card {
          background: #fff;
          padding: 2rem;
          border-radius: 0.75rem;
          text-align: center;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .resource-card:hover {
          transform: translateY(-0.5rem);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border-color: #60a5fa;
        }

        .resource-icon {
          width: 5rem;
          height: 5rem;
          background: #3b82f6;
          border-radius: 50%;
          margin: 0 auto 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .resource-card h3 {
          color: #1e40af;
          margin: 1.5rem 0 1rem;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .resource-card p {
          color: #4b5563;
          line-height: 1.625;
          margin-bottom: 1.5rem;
        }

        .download-btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.375rem;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s ease;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .download-btn:hover {
          background: #fbbf24;
        }

        /* Social Links */
        .social-links {
          display: flex;
          justify-content: center;
          gap: 1.25rem;
          margin-top: 2rem;
          flex-wrap: wrap;
        }

        .social-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          border-radius: 0.5rem;
          text-decoration: none;
          font-weight: bold;
          transition: all 0.3s ease;
          color: white;
          min-width: 9rem;
          justify-content: center;
        }

        .social-link.facebook {
          background: #1877f2;
        }

        .social-link.instagram {
          background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
        }

        .social-link.linkedin {
          background: #0077b5;
        }

        .social-link.youtube {
          background: #ff0000;
        }

        .social-link:hover {
          transform: translateY(-0.125rem);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        /* Agent Signup Form */
        .agent-signup-form {
          background: #fff;
          padding: 2.5rem;
          border-radius: 0.75rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          margin-top: 2rem;
          border: 2px solid #f3f4f6;
        }

        .form-row {
          display: flex;
          gap: 1.25rem;
          margin-bottom: 1.25rem;
        }

        .form-group {
          flex: 1;
        }

        .form-group.full-width {
          width: 100%;
          margin-bottom: 1.25rem;
        }

        .agent-signup-form input,
        .agent-signup-form select,
        .agent-signup-form textarea {
          width: 100%;
          padding: 1rem 1.125rem;
          border: 2px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 1rem;
          box-sizing: border-box;
          transition: border-color 0.3s ease;
          font-family: inherit;
        }

        .agent-signup-form input:focus,
        .agent-signup-form select:focus,
        .agent-signup-form textarea:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .agent-signup-form select {
          background-color: white;
          cursor: pointer;
        }

        .agent-signup-form textarea {
          resize: vertical;
          min-height: 8rem;
        }

        .submit-btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 1rem 2.5rem;
          border-radius: 0.375rem;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s ease;
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 1.25rem;
          width: 100%;
        }

        .submit-btn:hover {
          background: #fbbf24;
        }

        /* Links */
        a {
          color: #3b82f6;
          text-decoration: none;
          font-weight: bold;
        }

        a:hover {
          text-decoration: underline;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .hero-banner {
            background-attachment: scroll;
            min-height: 50vh;
          }

          .hero-content {
            flex-direction: column;
            padding: 40px 20px;
          }
          
          .hero-text {
            width: 100%;
          }
          
          .program-title-box {
            font-size: 28px;
            padding: 20px 15px;
          }

          .hero-text h1 {
            font-size: 28px;
          }

          .hero-text p {
            font-size: 16px;
            line-height: 24px;
            text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
            margin: 0 auto;
            text-align: center;
          }

          .section-inner {
            margin: 0 20px;
            padding: 25px;
          }
          
          .two-column-box {
            flex-direction: column;
          }
          
          .box-heading,
          .box-content {
            width: 100%;
          }

          .box-heading {
            margin-bottom: 20px;
            padding-right: 0;
          }

          .resource-cards {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }

          .social-links {
            flex-direction: column;
            align-items: center;
          }
          
          .social-link {
            width: 12.5rem;
          }

          .form-row {
            flex-direction: column;
            gap: 0;
          }
          
          .agent-signup-form {
            padding: 1.5rem;
          }

          .agent-signup-form input,
          .agent-signup-form select,
          .agent-signup-form textarea {
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default AgentPortal;