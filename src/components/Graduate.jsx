import React, { useState, useEffect } from 'react';
import {
  fetchPrograms,
  fetchGraduateContent        // ← NEW
} from '../firebase/firestore';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './Graduate.css';

/* ------------------------------------------------------------------
 *  placeholders if any slot is empty
 * ----------------------------------------------------------------- */
const introPlaceholders = Array.from({ length: 12 }, (_, i) =>
  `https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=400&q=80&sig=${i}`
);
const visaFallback = 'https://images.pexels.com/photos/54280/pexels-photo-54280.jpeg?auto=compress&cs=tinysrgb&h=900';

function Graduate() {
  const [programs, setPrograms]     = useState([]);
  const [lp, setLP]                 = useState(true);
  const [err, setErr]               = useState(null);

  const [page, setPage]             = useState(null);
  const [lPage, setLPage]           = useState(true);

  /* fetch graduate programs */
  useEffect(() => {
    (async () => {
      try {
        setPrograms(await fetchPrograms('graduate'));
      } catch (e) {
        setErr(e.message);
      } finally {
        setLP(false);
      }
    })();
  }, []);

  /* fetch page content */
  useEffect(() => {
    (async () => {
      try {
        setPage(await fetchGraduateContent());
      } catch (e) {
        console.error('Error loading graduate page:', e);
      } finally {
        setLPage(false);
      }
    })();
  }, []);

  if (lp || lPage) return <div className="loading">Loading…</div>;
  if (err)        return <div className="error">Error: {err}</div>;

  /* meta */
  const title = page?.metaTitle || 'Graduate Programs';
  const desc  = page?.metaDescription || '';

  /* header & intro */
  const header   = page?.pageHeaderTitle || 'Our Graduate Programs';
  const intro    = page?.intro || {};
  const p1       = intro.p1 || 'Welcome to our Graduate Programs';
  const p2       = intro.p2 || '';
  const p3       = intro.p3 || '';

  /* intro images grid */
  const gridUrls = page?.introImages?.length
    ? page.introImages.map((u,i) => u || introPlaceholders[i])
    : introPlaceholders;

  /* visa section */
  const visa    = page?.visaSection || {};
  const vh      = visa.heading   || 'Student Visa Requirements';
  const vp1     = visa.p1        || 'Lorem ipsum dolor sit amet...';
  const vp2     = visa.p2        || 'Morbi cursus, justo quis viverra dictum...';
  const vcLabel = visa.ctaLabel  || 'Start Your Application';
  const vcUrl   = visa.ctaUrl    || '/apply';
  const vImg    = visa.imageUrl  || visaFallback;

  return (
    <div className="graduate-page">
      <Helmet>
        <title>{title}</title>
        {desc && <meta name="description" content={desc} />}
      </Helmet>

      {/* page header */}
      <section className="page-header">
        <h1>{header}</h1>
      </section>

      {/* blue intro box */}
      <section className="blue-box">
        <div className="two-column-content">
          <div className="info-column">
            {p1 && <p><strong>{p1}</strong></p>}
            {p2 && <p>{p2}</p>}
            {p3 && <p>{p3}</p>}
          </div>
          <div className="image-column">
            <div className="intro-images-grid">
              {gridUrls.map((src,i) => (
                <img key={i} src={src} alt="Graduate intro" loading="lazy" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* visa section */}
      <section className="visa-section">
        <h2>{vh}</h2>
        <div className="blue-box visa-box">
          <div className="two-column-content">
            <div className="image-column visa-image">
              <img src={vImg} alt="Visa" />
            </div>
            <div className="info-column">
              <p>{vp1}</p>
              <p>{vp2}</p>
              <a href={vcUrl} className="cta-btn">{vcLabel}</a>
            </div>
          </div>
        </div>
      </section>

      {/* programs */}
      <section className="programs-listing-section">
        <h2>Graduate Programs</h2>
        <div className="programs-grid">
          {programs.length === 0 ? (
            <p>No programs available at the moment.</p>
          ) : (
            programs.map(pr => (
              <div key={pr.id} className="program-card">
                <div className="program-image">
                  <img src={pr.imageUrl} alt={pr.title} />
                </div>
                <div className="program-info">
                  <h3>{pr.title}</h3>
                  <p>{pr.shortTitle}</p>
                  <Link to={`/program/${pr.id}`} className="read-more-btn">
                    Read More
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

export default Graduate;
