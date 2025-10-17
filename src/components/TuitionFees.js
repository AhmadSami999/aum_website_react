import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import './TuitionFees.css';

function TuitionFees() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const docSnap = await getDoc(doc(db, 'settings', 'tuitionFees'));
      if (docSnap.exists()) setData(docSnap.data());
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div className="tuition-fees-page">Loading...</div>;
  if (!data) return <div className="tuition-fees-page">Tuition fee data not found.</div>;

  return (
    <HelmetProvider>
      <div className="tuition-fees-page">
        <Helmet prioritizeSeoTags>
          <title>{data.metaTitle || data.title}</title>
          <meta name="description" content={data.metaDescription || data.subtitle || ''} />
        </Helmet>

        <div className="tuition-header">
          <h1>{data.title}</h1>
          <div className="subtitle-wrapper">
            <h2>{data.subtitle}</h2>
            <span className="one-time">One-time</span>
          </div>
        </div>

        <div className="tuition-fee-cards">
          {data.cards.map((card) => (
            <div className="tuition-card" key={card.id}>
              <h3>{card.heading}</h3>
              <div className="price-block">
                <p className="tuition">{card.tuition}</p>
                <p className="admission">{card.admission}</p>
              </div>
              <p className="programs">{card.programs}</p>
            </div>
          ))}
        </div>
      </div>
    </HelmetProvider>
  );
}

export default TuitionFees;
