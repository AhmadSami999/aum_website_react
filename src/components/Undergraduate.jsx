// /src/pages/Undergraduate.jsx
import React, { useState, useEffect } from 'react';
import {
  fetchPrograms,
  fetchUndergraduateContent
} from '../firebase/firestore';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './Undergraduate.css';

/* Fallback hero image for the visa section */
const visaImageFallback =
  'https://images.pexels.com/photos/54280/pexels-photo-54280.jpeg?auto=compress&cs=tinysrgb&h=900';

function Undergraduate() {
  /* ---------- state ---------- */
  const [programs, setPrograms]       = useState([]);
  const [loadingPrograms, setLP]      = useState(true);
  const [errorPrograms,   setEP]      = useState(null);

  const [pageData, setPageData]       = useState(null);
  const [loadingPage, setLPg]         = useState(true);

  /* ---------- fetch programs ---------- */
  useEffect(() => {
    (async () => {
      try {
        setPrograms(await fetchPrograms('undergraduate'));
      } catch (err) {
        setEP(err.message);
      } finally {
        setLP(false);
      }
    })();
  }, []);

  /* ---------- fetch page data ---------- */
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchUndergraduateContent();
        setPageData(data);
      } catch (err) {
        console.error('Error fetching undergraduate page content:', err);
      } finally {
        setLPg(false);
      }
    })();
  }, []);

  /* ---------- loading / error ---------- */
  if (loadingPrograms || loadingPage) return <div className="loading">Loading…</div>;
  if (errorPrograms)                  return <div className="error">Error: {errorPrograms}</div>;

  /* ---------- derived content ---------- */
  const metaTitle       = pageData?.metaTitle       || 'Undergraduate Programs';
  const metaDescription = pageData?.metaDescription || '';

  /* intro text */
  const intro           = pageData?.intro || {};
  const p1              = intro.p1 || 'Start your journey at AUM.';
  const p2              = intro.p2 || '';
  const p3              = intro.p3 || '';

  /* visa section */
  const visa            = pageData?.visaSection || {};
  const visaHeading     = visa.heading   || 'Student Visa Requirements';
  const visaP1          = visa.p1        || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
  const visaP2          = visa.p2        || 'Morbi cursus, justo quis viverra dictum, urna massa tempus magna.';
  const visaCtaLabel    = visa.ctaLabel  || 'Start Your Application';
  const visaCtaUrl      = visa.ctaUrl    || '/apply';
  const visaCtaLabel2   = visa.ctaLabel2 || '';
  const visaCtaUrl2     = visa.ctaUrl2   || '';
  const visaImage       = visa.imageUrl  || visaImageFallback;

  /* page header title */
  const headerTitle     = pageData?.pageHeaderTitle || 'Our Study Programs';

  /* ---------- UI ---------- */
  return (
    <div className="undergraduate-page">
      <Helmet>
        <title>{metaTitle}</title>
        {metaDescription && <meta name="description" content={metaDescription} />}
      </Helmet>

      {/* ---------- PAGE HEADER ---------- */}
      <section className="page-header">
        <h1>{headerTitle}</h1>
      </section>

      {/* ---------- BLUE INTRO BOX ---------- */}
      <section className="blue-box">
        <div className="intro-content-single">
          <div className="info-column-full">
            {p1 && <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: p1 }} />}
            {p2 && <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: p2 }} />}
            {p3 && <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: p3 }} />}
          </div>
        </div>
      </section>

      {/* ---------- VISA SECTION ---------- */}
      <section className="visa-section">
        <h2>{visaHeading}</h2>

        <div className="blue-box visa-box">
          <div className="two-column-content">
            <div className="image-column visa-image">
              <img src={visaImage} alt="Student visa application" />
            </div>

            <div className="info-column">
              {visaP1 && <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: visaP1 }} />}
              {visaP2 && <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: visaP2 }} />}
              <div className="cta-buttons">
                <a href={visaCtaUrl} className="cta-btn">{visaCtaLabel}</a>
                {visaCtaLabel2 && visaCtaUrl2 && (
                  <a href={visaCtaUrl2} className="cta-btn cta-btn-secondary">{visaCtaLabel2}</a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- PROGRAM LIST ---------- */}
      <section className="programs-listing-section">
        <h2>Undergraduate Programs</h2>

        <div className="programs-grid">
          {programs.length === 0 ? (
            <p>No programs available at the moment.</p>
          ) : (
            programs.map(p => (
              <div key={p.id} className="program-card">
                <div className="program-image">
                  <img src={p.imageUrl} alt={p.title} />
                </div>

                <div className="program-info">
                  <h3>{p.title}</h3>
                  <Link to={`/program/${p.id}`} className="read-more-btn">
                    Read More
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default Undergraduate;