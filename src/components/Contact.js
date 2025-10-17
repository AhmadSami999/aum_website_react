import React, { useState } from 'react';
import './Contact.css';

function Contact() {
  // Added 'subject' to the initial state
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);
    setError('');

    try {
      // --- API Integration Start ---

      // IMPORTANT: Replace this URL with the actual URL of your Odoo instance and API endpoint
      const ODOO_API_ENDPOINT = 'http://desktop-oqip3mu:8118/api/helpdesk/ticket';

      const response = await fetch(ODOO_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // The field names here ('name', 'email', 'subject', 'description')
        // should match what your Odoo controller expects.
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          description: formData.message, // Mapping 'message' from form to 'description' for Odoo
        }),
      });

      if (!response.ok) {
        // Handle HTTP errors like 404 or 500
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        console.log("Ticket created successfully:", result);
        setSubmitted(true);
        // Clear the form on successful submission
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        // Handle errors returned by the Odoo API
        console.error("API Error:", result.error);
        setError(result.error || "An unknown error occurred on the server.");
      }

      // --- API Integration End ---

    } catch (error) {
      console.error("Error submitting contact form:", error);
      setError("Failed to submit the form. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <h1>Contact Us</h1>

      {submitted && <div className="success-message">Thank you! Your ticket has been created.</div>}
      {error && <div className="error-message">{error}</div>}

      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </label>

        {/* Added Subject field */}
        <label>
          Subject
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="What is this about?"
            required
          />
        </label>

        <label>
          Message
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Please describe your issue..."
            rows={6}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default Contact;