import React, { useState, useEffect } from 'react';

function EnglishLanguageProgram() {
  const [activeSection, setActiveSection] = useState('overview');
  const [isMobile, setIsMobile] = useState(false);

  // Contact form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
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

  const tableOfContents = [
    { id: 'overview', title: 'Program Overview' },
    { id: 'tests', title: 'Accepted Tests' },
    { id: 'info', title: 'Program Information' },
    { id: 'levels', title: 'Course Levels' },
    { id: 'attendance', title: 'Attendance Policy' },
    { id: 'management', title: 'Course Management' },
    { id: 'apply', title: 'How to Apply' },
    { id: 'tuition', title: 'Tuition Fee' },
    { id: 'refund', title: 'Refund Policy' },
    { id: 'late-policy', title: 'Late Students Policy' },
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

  const sections = [
    { 
      id: 'tests', 
      title: 'Accepted English Proficiency Tests',
      content: (
        <div>
          <p>The common English proficiency tests accepted by our university are:</p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ background: '#fff', padding: '12px 15px', marginBottom: '8px', borderRadius: '5px', borderLeft: '3px solid #5c80a5', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              International English Language Testing System (IELTS) 6.0/6.5
            </li>
            <li style={{ background: '#fff', padding: '12px 15px', marginBottom: '8px', borderRadius: '5px', borderLeft: '3px solid #5c80a5', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              Test of English as a Foreign language (TOEFL) – 65
            </li>
            <li style={{ background: '#fff', padding: '12px 15px', marginBottom: '8px', borderRadius: '5px', borderLeft: '3px solid #5c80a5', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              Pearson Test of English (PTE) (Academic) – 45
            </li>
            <li style={{ background: '#fff', padding: '12px 15px', marginBottom: '8px', borderRadius: '5px', borderLeft: '3px solid #5c80a5', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              ESB International Level 1 ESOL International
            </li>
          </ul>
          <p>The AUM also accepts ESB International Level 1 ESOL International as a proof of the English Language proficiency. If an applicant has no proof of the language proficiency, the university offers to take ELP course for ESB International Certificate. A diagnostic test will be performed to evaluate the current level of the student.</p>
          <p>At the end of the course students will be evaluated on an online English language exam, English Speaking Board (ESB). English Speaking Board (ESB) exams cater to non-native English speakers aiming to improve their language skills for various purposes, including education, work, or personal development.</p>
          <p>Registration is managed through the American University of Malta.</p>
        </div>
      )
    },
    { 
      id: 'info', 
      title: 'Generic Program Information',
      content: (
        <div>
          <div style={{ background: '#fff', padding: '20px', margin: '20px 0', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#104b87', marginTop: 0, marginBottom: '15px' }}>English Language Proficiency Level for Admission</h3>
            <p>The required English Language proficiency level for admission for undergraduate and graduate programs is ESB Level 1 Certificate ESOL International B2/MQF Level 2.</p>
          </div>
          <div style={{ background: '#fff', padding: '20px', margin: '20px 0', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#104b87', marginTop: 0, marginBottom: '15px' }}>ELP Course Duration and Tests</h3>
            <p>The duration of ELP course for Levels A1, A2, B1 and B2 is 16 weeks and students will be tested after studies for B1 Level and B2 Level. Upon successful completion of B2 Level students can enrol in their chosen educational program.</p>
          </div>
        </div>
      )
    },
    { 
      id: 'levels', 
      title: 'ELP Course Level Description / Qualification Progression and CEFR Levels',
      content: (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px', 
          marginTop: '20px' 
        }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', transition: 'transform 0.2s' }}>
            <h4 style={{ background: '#5c80a5', color: 'white', padding: '10px', margin: '-20px -20px 15px -20px', borderRadius: '8px 8px 0 0' }}>A1 Level</h4>
            <p>Beginner level - Basic English skills</p>
          </div>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', transition: 'transform 0.2s' }}>
            <h4 style={{ background: '#5c80a5', color: 'white', padding: '10px', margin: '-20px -20px 15px -20px', borderRadius: '8px 8px 0 0' }}>A2 Level</h4>
            <p>Elementary level - Basic conversational skills</p>
          </div>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', transition: 'transform 0.2s' }}>
            <h4 style={{ background: '#5c80a5', color: 'white', padding: '10px', margin: '-20px -20px 15px -20px', borderRadius: '8px 8px 0 0' }}>B1 Level</h4>
            <p>Intermediate level - Functional English skills</p>
          </div>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', transition: 'transform 0.2s' }}>
            <h4 style={{ background: '#5c80a5', color: 'white', padding: '10px', margin: '-20px -20px 15px -20px', borderRadius: '8px 8px 0 0' }}>B2 Level</h4>
            <p>Upper-intermediate level - Academic English readiness</p>
          </div>
        </div>
      )
    },
    { 
      id: 'attendance', 
      title: 'Class Attendance Policy',
      content: (
        <div>
          <p>For ELP students, all policies related to regular and excused non-attendance are applicable with the following modifications:</p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ background: '#fff', padding: '12px 15px', marginBottom: '8px', borderRadius: '5px', borderLeft: '3px solid #5c80a5', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              If a student is not present at the beginning of the class, they are 'late'. Being 'late' 3 times is equivalent to one absence.
            </li>
            <li style={{ background: '#fff', padding: '12px 15px', marginBottom: '8px', borderRadius: '5px', borderLeft: '3px solid #5c80a5', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              Students who are absent for 2 classes will receive an attendance warning.
            </li>
            <li style={{ background: '#fff', padding: '12px 15px', marginBottom: '8px', borderRadius: '5px', borderLeft: '3px solid #5c80a5', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              Students who are absent for 3 classes will have to meet with the EAP Coordinator.
            </li>
            <li style={{ background: '#fff', padding: '12px 15px', marginBottom: '8px', borderRadius: '5px', borderLeft: '3px solid #5c80a5', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              Students who are absent for 4 classes will receive a failing grade for the class but may need to continue to attend classes to maintain their AUM student status.
            </li>
            <li style={{ background: '#fff', padding: '12px 15px', marginBottom: '8px', borderRadius: '5px', borderLeft: '3px solid #5c80a5', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              Students who are absent for 10 classes will be suspended from AUM and may be reported to the Central Visa Unit.
            </li>
          </ul>
        </div>
      )
    },
    { 
      id: 'management', 
      title: 'ELP Course Management',
      content: (
        <div>
          <p>If applicants have any questions regarding course content, academic progress and teaching, it is recommended to apply to the Provost or Registrar Office.</p>
        </div>
      )
    },
    { 
      id: 'apply', 
      title: 'How to Apply for ELP Course',
      content: (
        <div>
          <h3>A Guide to Determine English Language Level and Registration</h3>
          <p>To apply for the English Language Program (ELP), applicants have to follow the steps below:</p>
          <ol style={{ background: '#fff', padding: '20px', borderRadius: '5px', counterReset: 'step-counter', listStyle: 'none' }}>
            <li style={{ padding: '12px 0 12px 40px', borderBottom: '1px solid #eee', counterIncrement: 'step-counter', position: 'relative' }}>
              <span style={{ 
                position: 'absolute', 
                left: 0, 
                top: '12px', 
                background: '#5c80a5', 
                color: 'white', 
                width: '25px', 
                height: '25px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: 'bold', 
                fontSize: '0.9rem' 
              }}>1</span>
              Apply for ELP Course: <a href="https://aum.edu.mt/programs/english-language-program/" target="_blank" rel="noopener noreferrer" style={{ color: '#5c80a5', textDecoration: 'none', fontWeight: 'bold' }}>https://aum.edu.mt/programs/english-language-program/</a>
            </li>
            <li style={{ padding: '12px 0 12px 40px', counterIncrement: 'step-counter', position: 'relative' }}>
              <span style={{ 
                position: 'absolute', 
                left: 0, 
                top: '12px', 
                background: '#5c80a5', 
                color: 'white', 
                width: '25px', 
                height: '25px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: 'bold', 
                fontSize: '0.9rem' 
              }}>2</span>
              Register for ELP Course in OIS
            </li>
          </ol>
        </div>
      )
    },
    { 
      id: 'tuition', 
      title: 'Tuition Fee',
      content: (
        <div>
          <div style={{ background: '#5c80a5', color: 'white', padding: '15px', textAlign: 'center', borderRadius: '5px', marginBottom: '20px', fontSize: '1.2rem' }}>
            <strong>Tuition fee: €1,600</strong>
          </div>
          <p>Tuition fees cover all of the following services and amenities:</p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {[
              'Diagnostic testing',
              'B1 Level Test',
              'B2 Level Test',
              'AUM Library',
              'AUM ID',
              'Temporary Residence Permit advising',
              'Orientation program',
              'Course materials',
              'AUM email and Internet',
              'ELP Course tuition'
            ].map((item, i) => (
              <li key={i} style={{ background: '#fff', padding: '12px 15px', marginBottom: '8px', borderRadius: '5px', borderLeft: '3px solid #5c80a5', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )
    },
    { 
      id: 'refund', 
      title: 'Refund Policy',
      content: (
        <div>
          <p>A full refund is available only prior to the first day of class. All refunds after classes have begun are pro-rated. Details will be provided during registration. Diagnostic test fees, tuition deposits are non-refundable.</p>
        </div>
      )
    },
    { 
      id: 'late-policy', 
      title: 'Policy on Late Students',
      content: (
        <div>
          <p>New students will be allowed to enrol. If dates of joining are late more than 1 or 2 weeks, and level of the English language of an applicant is low (A1 or A2), then applicants will be informed that if they don't meet final exam requirements, ELP course studies will be repeated at the next semester.</p>
        </div>
      )
    }
  ];

  const styles = {
    page: {
      margin: '0 auto',
      padding: 0,
      background: '#fff',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
    },
    blueInfoSection: {
      display: 'flex',
      alignItems: 'flex-start',
      padding: isMobile ? '20px' : '30px',
      background: '#5c80a5',
      color: '#fff',
      boxSizing: 'border-box',
      width: '100%',
      flexDirection: isMobile ? 'column' : 'row'
    },
    sideLinks: {
      width: isMobile ? '100%' : '30%',
      textAlign: isMobile ? 'center' : 'right',
      marginBottom: isMobile ? '20px' : '0'
    },
    sideLinksUl: {
      listStyle: 'none',
      padding: isMobile ? '0' : '0 15px',
      margin: 0,
      display: isMobile ? 'flex' : 'block',
      flexWrap: isMobile ? 'wrap' : 'nowrap',
      justifyContent: isMobile ? 'center' : 'flex-start',
      gap: isMobile ? '10px' : '0'
    },
    sideLinksLi: {
      position: 'relative',
      marginBottom: isMobile ? '5px' : '10px'
    },
    sideLinksA: {
      fontSize: isMobile ? '14px' : '18px',
      color: '#fff',
      textDecoration: 'none',
      fontWeight: 300,
      display: 'inline-block',
      paddingRight: isMobile ? '0' : '30px',
      transition: 'color 0.3s ease',
      position: 'relative',
      padding: isMobile ? '8px 12px' : '0',
      borderRadius: isMobile ? '4px' : '0',
      border: isMobile ? '1px solid rgba(255,255,255,0.3)' : 'none'
    },
    overview: {
      width: isMobile ? '100%' : '70%',
      padding: isMobile ? '0' : '0 50px',
      textAlign: 'center',
      boxSizing: 'border-box'
    },
    overviewP: {
      textAlign: 'left',
      fontSize: isMobile ? '16px' : '20px',
      lineHeight: isMobile ? '22px' : '26px',
      fontWeight: 300
    },
    programTitleBox: {
      position: 'relative',
      marginBottom: '20px',
      padding: isMobile ? '15px 10px' : '20px 15px',
      background: '#fff',
      color: '#104b87',
      fontSize: isMobile ? '24px' : '36px',
      fontWeight: 700,
      border: '3px solid #104b87',
      borderRadius: '15px',
      zIndex: 0
    },
    boxSection: {
      position: 'relative'
    },
    sectionInner: {
      margin: isMobile ? '0 20px' : '0 60px',
      padding: isMobile ? '25px' : '50px',
      position: 'relative',
      zIndex: 1
    },
    sectionWhite: {
      background: '#fff'
    },
    sectionGrey: {
      background: '#f7f7f7'
    },
    twoColumnBox: {
      display: 'flex',
      alignItems: 'flex-start',
      flexDirection: isMobile ? 'column' : 'row'
    },
    boxHeading: {
      width: isMobile ? '100%' : '30%',
      paddingRight: isMobile ? '0' : '20px',
      marginBottom: isMobile ? '20px' : '0'
    },
    boxHeadingH2: {
      margin: 0,
      fontSize: isMobile ? '22px' : '27px',
      color: '#104b87',
      lineHeight: isMobile ? '28px' : '34px'
    },
    boxContent: {
      width: isMobile ? '100%' : '70%'
    },
    advisorCallout: {
      padding: isMobile ? '40px 20px' : '60px',
      textAlign: 'center',
      background: '#ffffff'
    },
    advisorP: {
      fontSize: isMobile ? '16px' : '18px',
      marginBottom: '20px'
    },
    applyBtn: {
      display: 'inline-block',
      background: '#5c80a5',
      color: '#fff',
      padding: '12px 30px',
      textDecoration: 'none',
      borderRadius: '5px',
      fontWeight: 'bold',
      fontSize: '16px',
      margin: '10px 0 30px',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease'
    },
    contactForm: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '30px',
      justifyContent: 'center',
      marginTop: '30px',
      flexDirection: isMobile ? 'column' : 'row'
    },
    contactLeft: {
      flex: isMobile ? '1 1 100%' : '1 1 320px'
    },
    contactRight: {
      flex: isMobile ? '1 1 100%' : '1 1 320px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: isMobile ? 'stretch' : 'flex-end'
    },
    input: {
      width: '100%',
      padding: '14px 18px',
      border: '1px solid #000',
      borderRadius: 0,
      fontSize: '16px',
      marginBottom: '20px',
      boxSizing: 'border-box'
    },
    textarea: {
      width: '100%',
      padding: '14px 18px',
      border: '1px solid #000',
      borderRadius: 0,
      fontSize: '16px',
      minHeight: isMobile ? '120px' : '170px',
      resize: 'vertical',
      boxSizing: 'border-box',
      alignSelf: 'stretch'
    },
    sendBtn: {
      marginTop: '10px',
      width: isMobile ? '100%' : '150px',
      background: '#5c80a5',
      color: '#fff',
      padding: '12px 30px',
      textDecoration: 'none',
      borderRadius: '5px',
      fontWeight: 'bold',
      fontSize: '18px',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      textAlign: 'center'
    }
  };

  return (
    <div style={styles.page}>
      {/* Blue Info / Overview */}
      <section style={styles.blueInfoSection}>
        <nav style={styles.sideLinks}>
          <ul style={styles.sideLinksUl}>
            <li style={styles.sideLinksLi}>
              <a 
                href="#overview" 
                style={styles.sideLinksA}
                onMouseOver={(e) => {
                  e.target.style.color = '#fcbf0b';
                  if (!isMobile && e.target.nextSibling) {
                    e.target.nextSibling.style.background = '#fcbf0b';
                    e.target.nextSibling.style.borderColor = '#fcbf0b';
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.color = '#fff';
                  if (!isMobile && e.target.nextSibling) {
                    e.target.nextSibling.style.background = 'transparent';
                    e.target.nextSibling.style.borderColor = '#fff';
                  }
                }}
              >
                Program Overview
              </a>
              {!isMobile && (
                <span style={{
                  content: '',
                  width: '8px',
                  height: '8px',
                  border: '2px solid #fff',
                  borderRadius: '50%',
                  position: 'absolute',
                  right: '-20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  transition: 'background-color 0.3s ease, border-color 0.3s ease',
                  background: 'transparent'
                }}></span>
              )}
            </li>
            {sections.map((s) => (
              <li key={s.id} style={styles.sideLinksLi}>
                <a 
                  href={`#${s.id}`} 
                  style={styles.sideLinksA}
                  onMouseOver={(e) => {
                    e.target.style.color = '#fcbf0b';
                    if (!isMobile && e.target.nextSibling) {
                      e.target.nextSibling.style.background = '#fcbf0b';
                      e.target.nextSibling.style.borderColor = '#fcbf0b';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.target.style.color = '#fff';
                    if (!isMobile && e.target.nextSibling) {
                      e.target.nextSibling.style.background = 'transparent';
                      e.target.nextSibling.style.borderColor = '#fff';
                    }
                  }}
                >
                  {s.title}
                </a>
                {!isMobile && (
                  <span style={{
                    content: '',
                    width: '8px',
                    height: '8px',
                    border: '2px solid #fff',
                    borderRadius: '50%',
                    position: 'absolute',
                    right: '-20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    transition: 'background-color 0.3s ease, border-color 0.3s ease',
                    background: 'transparent'
                  }}></span>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div style={styles.overview}>
          <div style={styles.programTitleBox}>English Language Program (ELP)</div>
          <h2 id="overview" style={{ fontSize: isMobile ? '24px' : '32px', color: '#fff', fontWeight: 600, marginBottom: '20px' }}>Program Overview</h2>
          <div>
            <p style={styles.overviewP}>
              The English Language Program at American University of Malta is designed and offered to help international students who do not meet the required level of English proficiency to apply for our academic programs or need to improve their English to be eligible for admission.
            </p>
            <p style={styles.overviewP}>
              English Language proficiency is an admission requirement for international students whose first language is not English, and the level of English was not approved by a relevant institution to a level and standards of program admission requirements.
            </p>
          </div>
        </div>
      </section>

      {/* Alternating Content Boxes */}
      <div>
        {sections.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            style={styles.boxSection}
          >
            <div style={{
              ...styles.sectionInner,
              ...(i % 2 === 0 ? styles.sectionWhite : styles.sectionGrey)
            }}>
              <div style={styles.twoColumnBox}>
                <div style={styles.boxHeading}>
                  <h2 style={styles.boxHeadingH2}>{s.title}</h2>
                </div>
                <div style={styles.boxContent}>
                  {s.content}
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Advisor Callout & Contact */}
        <div style={styles.advisorCallout}>
          <p style={styles.advisorP}>Please contact our advisor for guidance about the English Language Program.</p>

          <a 
            href="https://apply.aum.edu.mt/s/"
            style={styles.applyBtn}
            target="_blank" 
            rel="noopener noreferrer"
            onMouseOver={(e) => e.target.style.backgroundColor = '#fcbf0b'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#5c80a5'}
          >
            APPLY&nbsp;NOW
          </a>

          <p style={styles.advisorP}>
            If you have any queries about the English Language Program, kindly fill in the form below and we will
            get back to you as soon as possible.
          </p>

        </div>
      </div>
    </div>
  );
}

export default EnglishLanguageProgram;