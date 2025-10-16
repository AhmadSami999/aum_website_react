import React, { useEffect, useState } from 'react';
import './OurUniversity.css';
import { fetchOurUniversityContent } from '../firebase/firestore';
import sampleImage from '../assets/university.jpg';
import mqfImage from '../assets/mqf.webp';
import getQualifiedImage from '../assets/get_qualified_transparent.png';
import writingImage from '../assets/writing.jpg';
import { Helmet, HelmetProvider } from 'react-helmet-async';

function OurUniversity() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      const data = await fetchOurUniversityContent();
      setContent(data);
      setLoading(false);
    }
    loadContent();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (!content) return <div>No content found.</div>;

  return (
    <HelmetProvider>
      <div className="our-university-page">
        <Helmet prioritizeSeoTags>
          <title>{content.metaTitle || content.headerTitle}</title>
          <meta
            name="description"
            content={content.metaDescription || content.welcome?.text?.slice(0, 160)}
          />
        </Helmet>

        <header className="our-uni-header">
          <h1>{content.headerTitle}</h1>
        </header>

        <section className="our-uni-welcome-box">
          <div className="our-uni-welcome-text">
            <p><strong>{content.welcome.boldText}</strong></p>
            <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: content.welcome.text }} />
          </div>
        </section>

        <section className="our-uni-two-column-section">
          <div className="our-uni-text-column">
            <p>
              The American University of Malta (AUM) merges the best of both worlds in terms of academic standards and accreditation.
            </p>
            <p>
              All programs are designed by a professional faculty board so as to comply with American Education standards...
            </p>
            <div className="our-uni-mission-images">
              <img src={mqfImage} alt="MQF" />
              <img src={getQualifiedImage} alt="Get Qualified" />
            </div>
          </div>
          <div className="our-uni-image-column">
            <img src={content.headerImage?.url || sampleImage} alt="University Campus" />
          </div>
        </section>

        <section className="our-uni-mission-heading-section">
          <h1>Mission, Vision &amp; Values</h1>
        </section>

        <section className="our-uni-info-box our-uni-mission-info">
          <div className="our-uni-info-text">
            <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: content.missionInfo.text }} />
            <button className="our-uni-official-button">{content.missionInfo.buttonText}</button>
          </div>
        </section>

        <section className="our-uni-two-column-section our-uni-swapped">
          <div className="our-uni-image-column">
            <img src={writingImage} alt="Writing" />
          </div>
          <div className="our-uni-text-column">
            <p><strong>MISSION</strong></p>
            <p>The American University of Malta is a comprehensive university...</p>
            <p><strong>VISION</strong></p>
            <p>The American University of Malta secures a bright future...</p>
            <p><strong>VALUES</strong></p>
            <p>Quality</p>
            <p>Excellence</p>
            <p>Integrity</p>
            <p>Relevance</p>
          </div>
        </section>

        <section className="our-uni-visit-heading-section">
          <h1>Visit Us</h1>
        </section>

        <section className="our-uni-info-box our-uni-visit-info">
          <div className="our-uni-info-text">
            <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: content.visitInfo.text }} />
          </div>
        </section>

        <section className="our-uni-two-column-section">
          <div className="our-uni-text-column">
            <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: content.visitInfo.text }} />
          </div>
          <div className="our-uni-video-column">
            <div className="our-uni-video-placeholder">Video Placeholder</div>
          </div>
        </section>

        <section className="our-uni-campus-section">
          <h1>Where is our Campus</h1>
          <div className="our-uni-red-separator"></div>
          <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: content.campus.text1 }} />
          <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: content.campus.text2 }} />
          <button className="our-uni-campus-button">{content.campus.buttonText}</button>
          <div className="our-uni-map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d413504.1920736945!2d14.048714520634045!3d35.93470006967962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x130e5b27ed1a514f%3A0xdd026e513112de37!2sAmerican%20University%20of%20Malta!5e0!3m2!1sen!2sca!4v1744936662378!5m2!1sen!2sca"
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="American University of Malta Campus Map"
            ></iframe>
          </div>
        </section>

        <section className="contact-section">
          <h1>Contact Information</h1>
          <div className="our-uni-red-separator"></div>
          <div className="offices-section">
            <div className="office-card">
              <h3>General Inquiries</h3>
              <p><a href="mailto:info@aum.edu.mt">info@aum.edu.mt</a></p>
              <p><a href="tel:+35621696970">+356 2169 6970</a></p>
            </div>
            <div className="office-card">
              <h3>Admissions Office</h3>
              <p><a href="mailto:admission@aum.edu.mt">admission@aum.edu.mt</a></p>
            </div>
            <div className="office-card">
              <h3>Registrar Office</h3>
              <p><a href="mailto:registrar@aum.edu.mt">registrar@aum.edu.mt</a></p>
            </div>
            <div className="office-card">
              <h3>HR Office</h3>
              <p><a href="mailto:hr@aum.edu.mt">hr@aum.edu.mt</a></p>
            </div>
            <div className="office-card">
              <h3>Office of Student Affairs</h3>
              <p><a href="mailto:studentaffairs@aum.edu.mt">studentaffairs@aum.edu.mt</a></p>
            </div>
            <div className="office-card">
              <h3>Marketing Office</h3>
              <p><a href="mailto:marketing@aum.edu.mt">marketing@aum.edu.mt</a></p>
            </div>
            <div className="office-card">
              <h3>Finance Office</h3>
              <p><a href="mailto:finance@aum.edu.mt">finance@aum.edu.mt</a></p>
            </div>
            <div className="office-card">
              <h3>Provost Office</h3>
              <p><a href="mailto:provost@aum.edu.mt">provost@aum.edu.mt</a></p>
            </div>
          </div>
        </section>
      </div>
    </HelmetProvider>
  );
}

export default OurUniversity;
