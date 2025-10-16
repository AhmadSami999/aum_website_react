import React, { useState, useEffect } from 'react';
import { fetchEvents } from '../firebase/firestore';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './Events.css';

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({ title: 'Upcoming Events', description: '' });

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await fetchEvents();
        setEvents(data);
        const foundMeta = data.find(ev => ev.metaTitle || ev.metaDescription);
        if (foundMeta) {
          setMeta({
            title: foundMeta.metaTitle || 'Upcoming Events',
            description: foundMeta.metaDescription || ''
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  if (error) {
    return <div className="error">Error loading events: {error}</div>;
  }

  return (
    <div className="events-page">
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
      </Helmet>

      <h1>Upcoming Events</h1>
      {events.length === 0 ? (
        <p>No events available at this moment.</p>
      ) : (
        <div className="events-grid">
          {events.map(ev => (
            <div key={ev.id} className="event-card">
              {ev.imageUrl ? (
                <img src={ev.imageUrl} alt={ev.title} className="event-image" />
              ) : null}
              <h3>{ev.title}</h3>
              <p>{ev.excerpt}</p>
              <p>Date: {ev.date}</p>
              <Link to={`/events/${slugify(ev.title)}-${ev.id}`} className="read-more-btn">Read More</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Events;
