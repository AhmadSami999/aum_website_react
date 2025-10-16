// src/components/admin/GraduatePageEditor.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchGraduateContent,
  updateGraduateContent
} from '../../firebase/firestore';
import { storage } from '../../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import ImageCropper from './ImageCropper';
import './GraduatePageEditor.css';

const defaultContent = {
  pageHeaderTitle: 'Our Graduate Programs',
  intro: {
    p1: 'Welcome to our Graduate Programs.',
    p2: '',
    p3: ''
  },
  introImages: Array(12).fill(''),
  visaSection: {
    heading: 'Student Visa Requirements',
    p1: 'Lorem ipsum dolor sit amet...',
    p2: 'Morbi cursus, justo quis viverra dictum...',
    ctaLabel: 'Start Your Application',
    ctaUrl: '/apply',
    imageUrl: ''
  },
  metaTitle: '',
  metaDescription: ''
};

function GraduatePageEditor() {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [selectedFor, setSelectedFor] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [originalFile, setOriginalFile] = useState(null);

  // load
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchGraduateContent();
        const merged = {
          ...defaultContent,
          ...data,
          intro:        { ...defaultContent.intro,        ...(data?.intro        || {}) },
          introImages:  data?.introImages?.length ? data.introImages : Array(12).fill(''),
          visaSection:  { ...defaultContent.visaSection,  ...(data?.visaSection  || {}) }
        };
        setContent(merged);
      } catch (err) {
        setMessage({ text: `Error loading: ${err.message}`, type: 'error' });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (sec, fld, val) => setContent(prev =>
    sec ? { ...prev, [sec]: { ...prev[sec], [fld]: val } }
        : { ...prev, [fld]: val }
  );

  const handleFileSelect = (e, target) => {
    const file = e.target.files[0];
    if (!file) return;
    setOriginalFile(file);
    setSelectedFor(target);
    setShowCropper(true);
  };

  const onCropComplete = blob => {
    setShowCropper(false);
    if (!blob) return;
    const file = new File([blob], originalFile.name, { type: blob.type });
    const storageRef = ref(storage, `programs/graduate/${Date.now()}_${file.name}`);
    const task = uploadBytesResumable(storageRef, file);
    task.on('state_changed', null,
      err => setMessage({ text: `Upload error: ${err.message}`, type: 'error' }),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        setContent(prev => {
          if (selectedFor === 'visa') {
            return { ...prev, visaSection: { ...prev.visaSection, imageUrl: url } };
          } else {
            const arr = [...prev.introImages];
            arr[selectedFor] = url;
            return { ...prev, introImages: arr };
          }
        });
        setMessage({ text: 'Uploaded!', type: 'success' });
      }
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ text: '', type: '' });
    try {
      await updateGraduateContent(content);
      setMessage({ text: 'Graduate page updated!', type: 'success' });
    } catch (err) {
      setMessage({ text: `Error saving: ${err.message}`, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading…</div>;

  return (
    <div className="gp-editor">
      <h2>Edit Graduate Page</h2>
      {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

      <div className="editor-sections">
        {/* header, intro, grid, visa, SEO */}
        {/* (use same JSX structure as UndergraduatePageEditor, swapping in content.introImages and fetchGraduateContent/updateGraduateContent) */}
      </div>

      <div className="save-section">
        <button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
        <Link to="/graduate" target="_blank" className="view-page-btn">View Page</Link>
      </div>

      {showCropper && originalFile && (
        <ImageCropper file={originalFile} onCropComplete={onCropComplete} onCancel={() => setShowCropper(false)} />
      )}
    </div>
  );
}

export default GraduatePageEditor;
