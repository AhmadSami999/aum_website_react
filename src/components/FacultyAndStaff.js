import React, { useEffect, useState } from 'react';
import { fetchFacultyAndStaffContent, fetchFacultyMembers } from '../firebase/firestore';
import './FacultyAndStaff.css';
import { Helmet, HelmetProvider } from 'react-helmet-async';

function FacultyAndStaff() {
  const [pageContent, setPageContent] = useState(null);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);

  const colleges = [
    'College of Business',
    'College of Data Science & Engineering',
    'College of Arts',
  ];

  useEffect(() => {
    async function load() {
      const content = await fetchFacultyAndStaffContent();
      const facultyList = await fetchFacultyMembers();
      setPageContent(content);
      setFaculty(facultyList);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (!pageContent) return <div>Error loading page content.</div>;

  return (
    <HelmetProvider>
      <div className="faculty-directory-page">
        <Helmet prioritizeSeoTags>
          <title>{pageContent.metaTitle || pageContent.headerTitle}</title>
          <meta name="description" content={pageContent.metaDescription || pageContent.introText?.slice(0, 160)} />
        </Helmet>

        {/* Heading */}
        <header className="faculty-header">
          <div className="red-box"></div>
          <h1>{pageContent.headerTitle}</h1>
        </header>

        {/* Intro Box */}
        <section className="faculty-info-box">
          <p>{pageContent.introText}</p>
        </section>

        {/* Provost Section */}
        <section className="provost-section">
          <div
            className="provost-image"
            style={{
              backgroundImage: `url(${pageContent.provost?.imageUrl || ''})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="provost-info">
            <h2>Meet Our Rector</h2>
            <h3>{pageContent.provost?.name}</h3>
            <p>{pageContent.provost?.bio}</p>
          </div>
        </section>

        {/* Grouped Faculty Members by College */}
        {colleges.map(college => {
          const members = faculty.filter(f => f.college === college);
          if (!members.length) return null;

          return (
            <section key={college} className="college-section">
              <h2>{college}</h2>
              <div className="divider"></div>
              <div className="college-grid">
                {members.map(member => (
                  <div key={member.id} className="college-item">
                    <img src={member.imageUrl} alt={member.name} />
                    <div className="college-info">
                      <h3>{member.name}</h3>
                      <p>{member.title}</p>
                      <p>{member.department}</p>
                      <p>{member.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </HelmetProvider>
  );
}

export default FacultyAndStaff;
