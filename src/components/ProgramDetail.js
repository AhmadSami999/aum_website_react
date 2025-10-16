import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProgramBySlug } from '../firebase/firestore';
import { Helmet } from 'react-helmet';
import './ProgramDetail.css';

function ProgramDetail() {
  const { slug } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ---------------- CONTACT‑FORM STATE ---------------- */
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

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

  /* ---------------- PROGRAM FETCH --------------------- */
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProgramBySlug(slug);
        setProgram(data);
      } catch (err) {
        console.error('[ProgramDetail] Error fetching program:', err);
        setError('Error loading program details.');
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading)
    return (
      <div className="program-detail program-detail-page">
        Loading program details...
      </div>
    );
  if (error)
    return (
      <div className="program-detail program-detail-page error">
        {error}
      </div>
    );
  if (!program)
    return (
      <div className="program-detail program-detail-page">
        No program details found.
      </div>
    );

  // Use dynamic sections if available, otherwise fall back to legacy structure
  const sections = program.dynamicSections || [
    { id: 'entry', title: 'Program Entry Requirements', content: program.entryRequirements, headingStyle: 'default' },
    { id: 'details', title: 'Program Details', content: program.details, headingStyle: 'default' },
    { id: 'objectives', title: 'Program Objectives', content: program.objectives, headingStyle: 'default' },
    { id: 'learning', title: 'Learning Outcomes', content: program.learningOutcomes, headingStyle: 'default' },
    { id: 'employability', title: 'Program Employability', content: program.employability, headingStyle: 'default' }
  ].filter(section => section.content); // Only show sections that have content

  // Function to render the appropriate media
  const renderMedia = () => {
    if (!program.imageUrl) return null;
    
    if (program.mediaType === 'video' && program.videoUrl) {
      return (
        <div className="program-video-container">
          <video 
            autoPlay 
            muted
            loop
            playsInline
            preload="metadata"
            poster={program.imageUrl} 
            className="program-video"
          >
            <source src={program.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    } else {
      return <img src={program.imageUrl} alt={program.title} />;
    }
  };

  // Function to generate anchor-friendly IDs
  const generateSectionId = (title) => {
    return title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  return (
    <div className="program-detail program-detail-page">
      <Helmet>
        <title>{program.metaTitle || program.title}</title>
        <meta
          name="description"
          content={
            program.metaDescription ||
            program.overview?.replace(/<[^>]+>/g, '').slice(0, 160)
          }
        />
      </Helmet>

      {/* ---------- Header Media (Image or Video) ---------- */}
      {(program.imageUrl || program.videoUrl) && (
        <section className="header-image-section">
          {renderMedia()}
        </section>
      )}

      {/* ---------- Blue Info / Overview ---------- */}
      <section className="blue-info-section">
        <div className="blue-info-inner">
          <nav className="side-links">
            <ul>
              <li><a href="#overview">Program Overview</a></li>
              {sections.map((section) => (
                <li key={section.id || generateSectionId(section.title)}>
                  <a href={`#${section.id || generateSectionId(section.title)}`}>
                    {section.title}
                  </a>
                </li>
              ))}
              {program.programStructure?.length > 0 && (
                <li><a href="#structure">Program Structure</a></li>
              )}
            </ul>
          </nav>

          <div className="overview">
            <div className="program-title-box">{program.title}</div>
            <h2 id="overview">Program Overview</h2>
            <div
              className="overview-text"
              dangerouslySetInnerHTML={{ __html: program.overview }}
            />
          </div>
        </div>
      </section>

      {/* ---------- Dynamic Content Sections ---------- */}
      <div className="program-detail-content program-content">
        {sections.map((section, i) => {
          const sectionId = section.id || generateSectionId(section.title);
          const isTriangularHeading = section.headingStyle === 'triangular';
          
          return (
            <section
              key={sectionId}
              id={sectionId}
              className={`box-section ${
                i % 2 === 0 ? 'section-white' : 'section-grey'
              } ${isTriangularHeading ? 'triangular-heading-section' : ''}`}
            >
              <div className="section-inner">
                {isTriangularHeading ? (
                  // Triangular blue heading style
                  <div className="triangular-heading-container">
                    <div className="triangular-heading">
                      <h2>{section.title}</h2>
                    </div>
                    <div className="triangular-content">
                      <div
                        className="box-content"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                      />
                    </div>
                  </div>
                ) : (
                  // Default two-column layout
                  <div className="two-column-box">
                    <div className="box-heading">
                      <h2>{section.title}</h2>
                    </div>
                    <div
                      className="box-content"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  </div>
                )}
              </div>
            </section>
          );
        })}

        {/* ---------- Program Structure (if exists) ---------- */}
        {program.programStructure?.length > 0 && (
          <section id="structure" className="structure-container">
            <div className="structure-divider">
              <h2>Program Structure</h2>
            </div>

            <div className="structure-inner">
              <div className="table-responsive">
                <table className="program-detail-table">
                  <thead>
                    <tr>
                      <th>Module / Unit Title</th>
                      <th>Compulsory / Elective</th>
                      <th>ECTS / ECVETS</th>
                      <th>Mode of Delivery</th>
                      <th>Mode of Assessment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {program.programStructure.map((row, idx) => (
                      <tr key={idx}>
                        <td data-label="Module / Unit Title">{row.title}</td>
                        <td data-label="Compulsory / Elective">{row.type}</td>
                        <td data-label="ECTS / ECVETS">{row.credits}</td>
                        <td data-label="Mode of Delivery">{row.delivery}</td>
                        <td data-label="Mode of Assessment">{row.assessment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ---------- Program Director Section ---------- */}
            {program.programDirector?.showContact && program.programDirector.name && (
              <div className="program-director-section">
                <div className="director-container">
                  <div className="director-info">
                    {program.programDirector.imageUrl && (
                      <div className="director-photo">
                        <img src={program.programDirector.imageUrl} alt={program.programDirector.name} />
                      </div>
                    )}
                    <div className="director-details">
                      <h3 className="director-name">{program.programDirector.name}</h3>
                      <p className="director-title">{program.programDirector.title}</p>
                      
                      <div className="director-contact">
                        <h4>Contact the Director for this Program</h4>
                        <div className="contact-info">
                          <div className="contact-name">{program.programDirector.name}</div>
                          {program.programDirector.email && (
                            <div className="contact-item">
                              <strong>Email:</strong> 
                              <a href={`mailto:${program.programDirector.email}`}>
                                {program.programDirector.email}
                              </a>
                            </div>
                          )}
                          {program.programDirector.phone && (
                            <div className="contact-item">
                              <strong>Phone:</strong> 
                              <a href={`tel:${program.programDirector.phone}`}>
                                {program.programDirector.phone}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Show program director even if no program structure */}
        {(!program.programStructure || program.programStructure.length === 0) && 
         program.programDirector?.showContact && program.programDirector.name && (
          <section className="contact-section">
            <div className="program-director-section">
              <div className="director-container">
                <div className="director-info">
                  {program.programDirector.imageUrl && (
                    <div className="director-photo">
                      <img src={program.programDirector.imageUrl} alt={program.programDirector.name} />
                    </div>
                  )}
                  <div className="director-details">
                    <h3 className="director-name">{program.programDirector.name}</h3>
                    <p className="director-title">{program.programDirector.title}</p>
                    
                    <div className="director-contact">
                      <h4>Contact the Director for this Program</h4>
                      <div className="contact-info">
                        <div className="contact-name">{program.programDirector.name}</div>
                        {program.programDirector.email && (
                          <div className="contact-item">
                            <strong>Email:</strong> 
                            <a href={`mailto:${program.programDirector.email}`}>
                              {program.programDirector.email}
                            </a>
                          </div>
                        )}
                        {program.programDirector.phone && (
                          <div className="contact-item">
                            <strong>Phone:</strong> 
                            <a href={`tel:${program.programDirector.phone}`}>
                              {program.programDirector.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default ProgramDetail;