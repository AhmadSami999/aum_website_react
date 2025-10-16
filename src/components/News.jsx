// /src/components/News.js
import React, { useEffect, useState } from 'react';
import { fetchNews } from '../firebase/firestore';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './News.css';

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function News() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ title: 'AUM News', description: '' });

  useEffect(() => {
    async function load() {
      const data = await fetchNews();
      setItems(data);
      const foundMeta = data.find(n => n.metaTitle || n.metaDescription);
      if (foundMeta) {
        setMeta({
          title: foundMeta.metaTitle || 'AUM News',
          description: foundMeta.metaDescription || ''
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="news-page">Loading...</div>;

  return (
    <div className="news-page">
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
      </Helmet>

      <h1>Latest News</h1>
      <div className="news-grid">
        {items.length === 0 ? (
          <p>No news items at the moment.</p>
        ) : (
          items.map(item => (
            <div key={item.id} className="news-card">
              <h3>{item.title}</h3>
              <p>{item.excerpt}</p>
              <Link to={`/news/${slugify(item.title)}-${item.id}`} className="read-more-btn">
                Read More
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default News;
