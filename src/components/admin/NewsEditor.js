// /src/components/admin/NewsEditor.js
import React, { useState, useEffect } from 'react';
import { fetchNews, addNews, updateNews, deleteNews } from '../../firebase/firestore';
import RichTextEditor from './RichTextEditor';
import './NewsEditor.css';

function NewsEditor() {
  const [newsItems, setNewsItems] = useState([]);
  const [currentNews, setCurrentNews] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    metaTitle: '',
    metaDescription: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    loadNews();
  }, []);

  async function loadNews() {
    try {
      const data = await fetchNews();
      setNewsItems(data);
    } catch (error) {
      setMessage({ text: `Error loading news: ${error.message}`, type: 'error' });
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleRichTextChange(field, value) {
    setFormData({ ...formData, [field]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      if (currentNews) {
        await updateNews(currentNews.id, formData);
        setMessage({ text: 'News updated successfully!', type: 'success' });
      } else {
        await addNews(formData);
        setMessage({ text: 'News added successfully!', type: 'success' });
      }
      setFormData({ title: '', excerpt: '', content: '', metaTitle: '', metaDescription: '' });
      setCurrentNews(null);
      loadNews();
    } catch (error) {
      setMessage({ text: `Error: ${error.message}`, type: 'error' });
    }
    setLoading(false);
  }

  function handleEdit(item) {
    setCurrentNews(item);
    setFormData({
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      metaTitle: item.metaTitle || '',
      metaDescription: item.metaDescription || ''
    });
  }

  async function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this news item?')) {
      try {
        await deleteNews(id);
        setMessage({ text: 'News deleted successfully!', type: 'success' });
        loadNews();
      } catch (error) {
        setMessage({ text: `Error deleting news: ${error.message}`, type: 'error' });
      }
    }
  }

  function handleCancel() {
    setCurrentNews(null);
    setFormData({ title: '', excerpt: '', content: '', metaTitle: '', metaDescription: '' });
  }

  return (
    <div className="news-editor">
      <h2 className="news-editor__title">News Editor</h2>
      {message.text && <div className={`message ${message.type}`}>{message.text}</div>}
      <form onSubmit={handleSubmit} className="news-editor__form">
        <div className="news-editor__form-group">
          <label htmlFor="title">News Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="news-editor__form-group">
          <label htmlFor="excerpt">News Excerpt</label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            rows="3"
            required
          ></textarea>
        </div>
        <div className="news-editor__form-group">
          <label htmlFor="content">News Content</label>
          <RichTextEditor
            value={formData.content}
            onChange={(value) => handleRichTextChange('content', value)}
            placeholder="Enter the full news content with rich text formatting"
          />
        </div>
        <div className="news-editor__form-group">
          <label htmlFor="metaTitle">Meta Title</label>
          <input
            type="text"
            id="metaTitle"
            name="metaTitle"
            value={formData.metaTitle}
            onChange={handleInputChange}
          />
        </div>
        <div className="news-editor__form-group">
          <label htmlFor="metaDescription">Meta Description</label>
          <textarea
            id="metaDescription"
            name="metaDescription"
            rows="2"
            value={formData.metaDescription}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div className="news-editor__form-buttons">
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : currentNews ? 'Update News' : 'Add News'}
          </button>
          {currentNews && (
            <button type="button" onClick={handleCancel} className="news-editor__cancel-btn">
              Cancel
            </button>
          )}
        </div>
      </form>
      <div className="news-editor__news">
        <h3>Existing News</h3>
        {newsItems.length === 0 ? (
          <p>No news items found. Add your first news item above.</p>
        ) : (
          <ul>
            {newsItems.map(item => (
              <li key={item.id} className="news-editor__news-item">
                <div className="news-editor__news-item-content">
                  <h4>{item.title}</h4>
                  <p>{item.excerpt}</p>
                </div>
                <div className="news-editor__news-item-actions">
                  <button onClick={() => handleEdit(item)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="news-editor__delete-btn">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default NewsEditor;
