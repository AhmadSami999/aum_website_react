// /src/components/NewsDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchNewsById } from '../firebase/firestore';
import { Helmet } from 'react-helmet';
import './NewsDetail.css';

function NewsDetail() {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchNewsById(id);
      setNewsItem(data);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <div className="news-detail">Loading...</div>;
  if (!newsItem) return <div className="news-detail">News item not found.</div>;

  return (
    <div className="news-detail">
      <Helmet>
        <title>{newsItem.metaTitle || newsItem.title}</title>
        <meta
          name="description"
          content={newsItem.metaDescription || newsItem.excerpt?.slice(0, 160)}
        />
      </Helmet>

      <h1>{newsItem.title}</h1>
      <p className="news-excerpt">{newsItem.excerpt}</p>
      <div className="news-content" dangerouslySetInnerHTML={{ __html: newsItem.content }} />
    </div>
  );
}

export default NewsDetail;
