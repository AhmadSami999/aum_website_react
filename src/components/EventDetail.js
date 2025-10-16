import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchEventById } from '../firebase/firestore';
import './EventDetail.css';

function EventDetail() {
  const { slugId } = useParams();
  const id = slugId.split('-').pop();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadEvent() {
      try {
        const data = await fetchEventById(id);
        setEvent(data);
      } catch (err) {
        console.error('Error loading event details:', err);
        setError('Error loading event details.');
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading event details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!event) {
    return <div>No event found.</div>;
  }

  return (
    <div className="event-detail-page">
      <h1>{event.title}</h1>
      {event.imageUrl && (
        <div className="event-image">
          <img src={event.imageUrl} alt={event.title} />
        </div>
      )}
      <div className="event-info">
        <p>{event.details}</p>
        <p><strong>Date: </strong>{event.date}</p>
      </div>
    </div>
  );
}

export default EventDetail;
