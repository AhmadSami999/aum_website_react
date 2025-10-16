// /src/components/admin/EventsEditor.js
import React, { useState, useEffect } from 'react';
import { fetchEvents, addEvent, updateEvent, deleteEvent } from '../../firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/config';
import RichTextEditor from './RichTextEditor';
import './EventsEditor.css';

function EventsEditor() {
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    details: '',
    date: '',
    imageUrl: '',
    metaTitle: '',
    metaDescription: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch (error) {
      setMessage({ text: `Error loading events: ${error.message}`, type: 'error' });
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleRichTextChange(field, value) {
    setFormData({ ...formData, [field]: value });
  }

  function handleEventImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const uniqueName = `${Date.now()}-${file.name}`;
    const storageRef = ref(storage, `programs/events/${uniqueName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      null,
      (error) => {
        console.error('Upload error:', error);
        setMessage({ text: `Upload error: ${error.message}`, type: 'error' });
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setFormData(prevFormData => ({
          ...prevFormData,
          imageUrl: downloadURL
        }));
        e.target.value = null; // Reset input to allow re-uploading same file if needed
      }
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const eventData = { ...formData };
      if (currentEvent) {
        await updateEvent(currentEvent.id, eventData);
        setMessage({ text: 'Event updated successfully!', type: 'success' });
      } else {
        await addEvent(eventData);
        setMessage({ text: 'Event added successfully!', type: 'success' });
        setFormData({
          title: '',
          excerpt: '',
          details: '',
          date: '',
          imageUrl: '',
          metaTitle: '',
          metaDescription: ''
        });
      }
      await loadEvents();
      setCurrentEvent(null);
    } catch (error) {
      setMessage({ text: `Error: ${error.message}`, type: 'error' });
    }
    setLoading(false);
  }

  function handleEdit(event) {
    setCurrentEvent(event);
    setFormData({
      title: event.title,
      excerpt: event.excerpt,
      details: event.details,
      date: event.date || '',
      imageUrl: event.imageUrl || '',
      metaTitle: event.metaTitle || '',
      metaDescription: event.metaDescription || ''
    });
  }

  async function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
        setMessage({ text: 'Event deleted successfully!', type: 'success' });
        await loadEvents();
      } catch (error) {
        setMessage({ text: `Error deleting event: ${error.message}`, type: 'error' });
      }
    }
  }

  function handleCancel() {
    setCurrentEvent(null);
    setFormData({
      title: '',
      excerpt: '',
      details: '',
      date: '',
      imageUrl: '',
      metaTitle: '',
      metaDescription: ''
    });
  }

  return (
    <div className="events-editor">
      <h2 className="events-editor__title">Events Editor</h2>
      {message.text && <div className={`message ${message.type}`}>{message.text}</div>}
      <form onSubmit={handleSubmit} className="events-editor__form">
        <div className="events-editor__form-group">
          <label htmlFor="title">Event Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="events-editor__form-group">
          <label htmlFor="excerpt">Event Excerpt</label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            rows="3"
            required
          ></textarea>
        </div>
        <div className="events-editor__form-group">
          <label htmlFor="details">Event Details</label>
          <RichTextEditor
            value={formData.details}
            onChange={(value) => handleRichTextChange('details', value)}
            placeholder="Enter detailed event information with rich text formatting"
          />
        </div>
        <div className="events-editor__form-group">
          <label htmlFor="date">Event Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
          />
        </div>
        <div className="events-editor__form-group">
          <label htmlFor="image">Event Image (optional)</label>
          {formData.imageUrl && (
            <div className="current-image">
              <img src={formData.imageUrl} alt="Current event" />
              <p>Current image</p>
            </div>
          )}
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleEventImageUpload}
          />
        </div>
        <div className="events-editor__form-group">
          <label htmlFor="metaTitle">Meta Title</label>
          <input
            type="text"
            id="metaTitle"
            name="metaTitle"
            value={formData.metaTitle}
            onChange={handleInputChange}
          />
        </div>
        <div className="events-editor__form-group">
          <label htmlFor="metaDescription">Meta Description</label>
          <textarea
            id="metaDescription"
            name="metaDescription"
            rows="2"
            value={formData.metaDescription}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div className="events-editor__form-buttons">
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : currentEvent ? 'Update Event' : 'Add Event'}
          </button>
          {currentEvent && (
            <button type="button" onClick={handleCancel} className="events-editor__cancel-btn">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="events-editor__list">
        <h3>Existing Events</h3>
        {events.length === 0 ? (
          <p>No events found. Add your first event above.</p>
        ) : (
          <ul>
            {events.map(ev => (
              <li key={ev.id} className="events-editor__list-item">
                <div className="events-editor__list-item-content">
                  {ev.imageUrl && (
                    <img src={ev.imageUrl} alt={ev.title} className="events-editor__item-image" />
                  )}
                  <div>
                    <h4>{ev.title}</h4>
                    <p>{ev.excerpt}</p>
                    <p>Date: {ev.date}</p>
                  </div>
                </div>
                <div className="events-editor__list-item-actions">
                  <button onClick={() => handleEdit(ev)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(ev.id)} className="delete-btn">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default EventsEditor;
