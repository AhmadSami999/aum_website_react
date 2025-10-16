import React, { useState, useEffect, useCallback } from 'react';
import { fetchPrograms, addProgram, updateProgram, deleteProgram } from '../../firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/config';
import { generateSlug } from '../../utils/slugUtils';
import RichTextEditor from './RichTextEditor';
import ImageCropper from './ImageCropper';
import './ProgramEditor.css';

function ProgramEditor({ programType }) {
  /* ---------- STATE ---------- */
  const [programs, setPrograms] = useState([]);
  const [currentProgram, setCurrentProgram] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    shortTitle: '',
    description: '',
    overview: '',
    // Legacy fields for backward compatibility
    entryRequirements: '',
    details: '',
    objectives: '',
    learningOutcomes: '',
    employability: '',
    // New dynamic sections
    dynamicSections: [],
    programStructure: [],
    // Program director/contact info
    programDirector: {
      name: '',
      title: '',
      email: '',
      phone: '',
      imageUrl: '',
      showContact: true
    },
    type: programType,
    imageUrl: '',
    videoUrl: '',
    mediaType: 'image',
    hideFromNavbar: false,
    metaTitle: '',
    metaDescription: '',
    slug: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [mediaType, setMediaType] = useState('image');
  const [activeTab, setActiveTab] = useState('basic');
  const [editingSlug, setEditingSlug] = useState(null);
  const [tempSlug, setTempSlug] = useState('');

  /* ---------- DATA LOAD ---------- */
  const loadPrograms = useCallback(async () => {
    try {
      const data = await fetchPrograms(programType);
      setPrograms(data);
    } catch (error) {
      setMessage({ text: `Error loading programs: ${error.message}`, type: 'error' });
    }
  }, [programType]);

  useEffect(() => { loadPrograms(); }, [loadPrograms]);

  /* ---------- FORM HELPERS ---------- */
  function resetForm() {
    setFormData({
      title: '',
      shortTitle: '',
      description: '',
      overview: '',
      entryRequirements: '',
      details: '',
      objectives: '',
      learningOutcomes: '',
      employability: '',
      dynamicSections: [],
      programStructure: [],
      programDirector: {
        name: '',
        title: '',
        email: '',
        phone: '',
        imageUrl: '',
        showContact: true
      },
      type: programType,
      imageUrl: '',
      videoUrl: '',
      mediaType: 'image',
      hideFromNavbar: false,
      metaTitle: '',
      metaDescription: '',
      slug: ''
    });
    setMediaType('image');
    setActiveTab('basic');
  }

  function openAddForm() {
    setCurrentProgram(null);
    resetForm();
    setShowForm(true);
    setTimeout(() => {
      document.querySelector('.editor-form')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  }

  function openEditForm(program) {
    setCurrentProgram(program);
    
    // Convert legacy data to dynamic sections if needed
    const dynamicSections = program.dynamicSections || [];
    
    // If no dynamic sections but has legacy fields, convert them
    if (dynamicSections.length === 0) {
      const legacyFields = [
        { field: 'entryRequirements', title: 'Program Entry Requirements' },
        { field: 'details', title: 'Program Details' },
        { field: 'objectives', title: 'Program Objectives' },
        { field: 'learningOutcomes', title: 'Learning Outcomes' },
        { field: 'employability', title: 'Program Employability' }
      ];

      legacyFields.forEach(({ field, title }) => {
        if (program[field]) {
          dynamicSections.push({
            id: field,
            title: title,
            content: program[field],
            headingStyle: 'default'
          });
        }
      });
    }

    setFormData({
      ...program,
      dynamicSections: dynamicSections,
      programStructure: program.programStructure || [],
      programDirector: program.programDirector || {
        name: '',
        title: '',
        email: '',
        phone: '',
        imageUrl: '',
        showContact: true
      },
      metaTitle: program.metaTitle || '',
      metaDescription: program.metaDescription || '',
      videoUrl: program.videoUrl || '',
      mediaType: program.mediaType || 'image',
      slug: program.slug || generateSlug(program.title)
    });
    setMediaType(program.mediaType || 'image');
    setActiveTab('basic');
    setShowForm(true);
    setTimeout(() => {
      document.querySelector('.editor-form')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  }

  function closeForm() {
    setShowForm(false);
    setCurrentProgram(null);
    resetForm();
  }

  /* ---------- GENERIC FIELD CHANGE ---------- */
  function handleInputChange(field, value) {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      if (field === 'title' && value) {
        updated.slug = generateSlug(value);
      }
      
      return updated;
    });
  }

  function handleSlugChange(value) {
    const sanitizedSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    
    setFormData(prev => ({ ...prev, slug: sanitizedSlug }));
  }

  /* ---------- PROGRAM DIRECTOR ---------- */
  function handleDirectorChange(field, value) {
    setFormData(prev => ({
      ...prev,
      programDirector: {
        ...prev.programDirector,
        [field]: value
      }
    }));
  }

  /* ---------- DYNAMIC SECTIONS ---------- */
  function addDynamicSection() {
    const newSection = {
      id: `section_${Date.now()}`,
      title: '',
      content: '',
      headingStyle: 'default'
    };
    
    setFormData(prev => ({
      ...prev,
      dynamicSections: [...prev.dynamicSections, newSection]
    }));
  }

  function removeDynamicSection(index) {
    setFormData(prev => ({
      ...prev,
      dynamicSections: prev.dynamicSections.filter((_, i) => i !== index)
    }));
  }

  function updateDynamicSection(index, field, value) {
    setFormData(prev => ({
      ...prev,
      dynamicSections: prev.dynamicSections.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      )
    }));
  }

  function moveDynamicSection(index, direction) {
    setFormData(prev => {
      const sections = [...prev.dynamicSections];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      
      if (newIndex >= 0 && newIndex < sections.length) {
        [sections[index], sections[newIndex]] = [sections[newIndex], sections[index]];
      }
      
      return { ...prev, dynamicSections: sections };
    });
  }

  /* ---------- URL HELPERS ---------- */
  function getProgramUrl(program) {
    const slug = program.slug || generateSlug(program.title);
    return `/program/${slug}`;
  }

  function handleViewProgram(program) {
    const url = getProgramUrl(program);
    window.open(url, '_blank');
  }

  function copyUrlToClipboard(program) {
    const url = `${window.location.origin}${getProgramUrl(program)}`;
    navigator.clipboard.writeText(url).then(() => {
      setMessage({ text: 'URL copied to clipboard!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 2000);
    });
  }

  /* ---------- SLUG EDITING ---------- */
  function startEditingSlug(program) {
    setEditingSlug(program.id);
    setTempSlug(program.slug || generateSlug(program.title));
  }

  function cancelEditingSlug() {
    setEditingSlug(null);
    setTempSlug('');
  }

  async function saveSlug(program) {
    try {
      const sanitizedSlug = tempSlug
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      await updateProgram(program.id, { ...program, slug: sanitizedSlug });
      setMessage({ text: 'URL updated successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 2000);
      await loadPrograms();
      setEditingSlug(null);
      setTempSlug('');
    } catch (err) {
      setMessage({ text: `Error updating URL: ${err.message}`, type: 'error' });
    }
  }

  /* ---------- MEDIA HANDLING ---------- */
  function handleMediaTypeChange(e) {
    const newMediaType = e.target.value;
    setMediaType(newMediaType);
    setFormData(prev => ({ ...prev, mediaType: newMediaType }));
  }

  function handleMediaChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    
    if (file.type.startsWith('video/')) {
      handleVideoUpload(file);
    } else if (file.type.startsWith('image/')) {
      setShowCropper(true);
    } else {
      setMessage({ text: 'Unsupported file type. Please upload an image or video.', type: 'error' });
    }
  }

  function handleVideoUpload(file) {
    const storageRef = ref(storage, `programs/${programType}/videos/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    setLoading(true);
    
    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setMessage({ text: `Upload is ${progress.toFixed(0)}% done`, type: 'info' });
      },
      (error) => {
        setLoading(false);
        setMessage({ text: `Error uploading video: ${error.message}`, type: 'error' });
      },
      async () => {
        try {
          const videoUrl = await getDownloadURL(uploadTask.snapshot.ref);
          const thumbnailUrl = await generateVideoThumbnail(file, `programs/${programType}/thumbnails/${Date.now()}_${file.name}`);
          
          setFormData(prev => ({ 
            ...prev, 
            imageUrl: thumbnailUrl,
            videoUrl: videoUrl,
            mediaType: 'video'
          }));
          
          setMessage({ text: 'Video uploaded successfully!', type: 'success' });
        } catch (error) {
          setMessage({ text: `Error processing video: ${error.message}`, type: 'error' });
        } finally {
          setLoading(false);
        }
      }
    );
  }

  async function generateVideoThumbnail(videoFile, storagePath) {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      
      const videoUrl = URL.createObjectURL(videoFile);
      video.src = videoUrl;
      
      video.onloadeddata = function() {
        video.currentTime = 1;
        
        video.onseeked = async function() {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            canvas.toBlob(async (blob) => {
              try {
                const thumbnailRef = ref(storage, storagePath);
                const uploadTask = uploadBytesResumable(thumbnailRef, blob);
                
                await uploadTask;
                const thumbnailUrl = await getDownloadURL(uploadTask.snapshot.ref);
                
                URL.revokeObjectURL(videoUrl);
                resolve(thumbnailUrl);
              } catch (error) {
                reject(error);
              }
            }, 'image/jpeg', 0.8);
          } catch (error) {
            URL.revokeObjectURL(videoUrl);
            reject(error);
          }
        };
      };
      
      video.onerror = function() {
        URL.revokeObjectURL(videoUrl);
        reject(new Error('Failed to load video'));
      };
    });
  }

  function onCropComplete(croppedBlob) {
    setShowCropper(false);
    if (!croppedBlob || !selectedFile) return;
    
    const newFile = new File([croppedBlob], selectedFile.name, { type: croppedBlob.type });
    
    // Check if this is for director photo or program media
    const isDirectorPhoto = selectedFile._isDirectorPhoto;
    
    if (isDirectorPhoto) {
      const storageRef = ref(storage, `programs/${programType}/directors/${Date.now()}_${newFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, newFile);
      
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setMessage({ text: `Director photo upload is ${progress.toFixed(0)}% done`, type: 'info' });
        },
        err => { 
          setMessage({ text: `Error uploading director photo: ${err.message}`, type: 'error' }); 
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          handleDirectorChange('imageUrl', url);
          setMessage({ text: 'Director photo uploaded successfully!', type: 'success' });
        }
      );
    } else {
      const storageRef = ref(storage, `programs/${programType}/${Date.now()}_${newFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, newFile);
      uploadTask.on('state_changed', null,
        err => { setMessage({ text: err.message, type: 'error' }); },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData(prev => ({ 
            ...prev, 
            imageUrl: url,
            videoUrl: '',
            mediaType: 'image'
          }));
        });
    }
  }

  /* ---------- PROGRAM STRUCTURE ---------- */
  function addStructureRow() {
    setFormData(prev => ({
      ...prev,
      programStructure: [
        ...prev.programStructure,
        { title: '', type: '', credits: '', delivery: '', assessment: '' }
      ]
    }));
  }

  function removeStructureRow(idx) {
    setFormData(prev => ({
      ...prev,
      programStructure: prev.programStructure.filter((_, i) => i !== idx)
    }));
  }

  function handleStructureChange(idx, field, value) {
    setFormData(prev => ({
      ...prev,
      programStructure: prev.programStructure.map((row, i) =>
        i === idx ? { ...row, [field]: value } : row
      )
    }));
  }

  /* ---------- SUBMIT ---------- */
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const dataToSave = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title)
      };

      if (currentProgram) {
        await updateProgram(currentProgram.id, dataToSave);
        setMessage({ text: 'Program updated successfully!', type: 'success' });
      } else {
        await addProgram(dataToSave);
        setMessage({ text: 'Program added successfully!', type: 'success' });
      }
      
      await loadPrograms();
      
      setTimeout(() => {
        closeForm();
        document.querySelector('.programs-list')?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 1500);
      
    } catch (err) {
      setMessage({ text: `Error: ${err.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  /* ---------- DELETE ---------- */
  async function handleDelete(id) {
    if (!window.confirm('Delete this program?')) return;
    try {
      await deleteProgram(id);
      setMessage({ text: 'Program deleted.', type: 'success' });
      await loadPrograms();
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    }
  }

  /* ---------- RENDER ---------- */
  return (
    <div className="program-editor">
      <div className="editor-header">
        <h2>{programType === 'undergraduate' ? 'Undergraduate' : 'Graduate'} Programs</h2>
        <button className="add-program-btn" onClick={openAddForm}>
          + Add New Program
        </button>
      </div>

      {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

      {/* === PROGRAM LIST === */}
      <div className="programs-list">
        {programs.length === 0 ? (
          <div className="empty-state">
            <p>No programs yet.</p>
            <button className="add-program-btn" onClick={openAddForm}>
              Add Your First Program
            </button>
          </div>
        ) : (
          <div className="programs-grid">
            {programs.map(p => (
              <div key={p.id} className="program-card">
                {p.imageUrl && (
                  <div className="program-card-image">
                    <img src={p.imageUrl} alt={p.title} />
                    {p.mediaType === 'video' && <span className="video-indicator">▶</span>}
                  </div>
                )}
                <div className="program-card-content">
                  <h4>{p.title}</h4>
                  <p>{p.shortTitle}</p>
                  <div className="program-url">
                    {editingSlug === p.id ? (
                      <div className="slug-edit-inline">
                        <div className="slug-input-wrapper-inline">
                          <span className="slug-prefix-inline">/program/</span>
                          <input
                            type="text"
                            value={tempSlug}
                            onChange={e => setTempSlug(e.target.value)}
                            className="slug-input-inline"
                            autoFocus
                            onKeyDown={e => {
                              if (e.key === 'Enter') saveSlug(p);
                              if (e.key === 'Escape') cancelEditingSlug();
                            }}
                          />
                        </div>
                        <div className="slug-actions">
                          <button 
                            className="slug-save-btn"
                            onClick={() => saveSlug(p)}
                          >
                            ✓
                          </button>
                          <button 
                            className="slug-cancel-btn"
                            onClick={cancelEditingSlug}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="slug-display">
                        <small>
                          <code>{getProgramUrl(p)}</code>
                          <button 
                            className="slug-edit-btn"
                            onClick={() => startEditingSlug(p)}
                            title="Edit URL"
                          >
                            Edit
                          </button>
                        </small>
                      </div>
                    )}
                  </div>
                </div>
                <div className="program-card-actions">
                  <button 
                    className="action-btn view-btn" 
                    onClick={() => handleViewProgram(p)}
                    title="Open program in new tab"
                  >
                    View
                  </button>
                  <button 
                    className="action-btn copy-btn" 
                    onClick={() => copyUrlToClipboard(p)}
                    title="Copy URL"
                  >
                    Copy URL
                  </button>
                  <button 
                    className="action-btn edit-btn" 
                    onClick={() => openEditForm(p)}
                  >
                    Edit
                  </button>
                  <button 
                    className="action-btn delete-btn" 
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* === FORM === */}
      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <div className="form-header">
              <h3>{currentProgram ? 'Edit Program' : 'Add New Program'}</h3>
              <button className="close-btn" onClick={closeForm}>✕</button>
            </div>

            <div className="form-tabs">
              <button 
                className={`tab ${activeTab === 'basic' ? 'active' : ''}`}
                onClick={() => setActiveTab('basic')}
              >
                Basic Info
              </button>
              <button 
                className={`tab ${activeTab === 'content' ? 'active' : ''}`}
                onClick={() => setActiveTab('content')}
              >
                Dynamic Sections
              </button>
              <button 
                className={`tab ${activeTab === 'structure' ? 'active' : ''}`}
                onClick={() => setActiveTab('structure')}
              >
                Structure
              </button>
              <button 
                className={`tab ${activeTab === 'director' ? 'active' : ''}`}
                onClick={() => setActiveTab('director')}
              >
                Program Director
              </button>
              <button 
                className={`tab ${activeTab === 'media' ? 'active' : ''}`}
                onClick={() => setActiveTab('media')}
              >
                Media & SEO
              </button>
            </div>

            <form onSubmit={handleSubmit} className="editor-form">
              {/* BASIC INFO TAB */}
              {activeTab === 'basic' && (
                <div className="tab-content">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Program Title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={e => handleInputChange('title', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Short Title</label>
                      <input
                        type="text"
                        value={formData.shortTitle}
                        onChange={e => handleInputChange('shortTitle', e.target.value)}
                        placeholder="For navigation menu"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>URL Slug</label>
                    <div className="slug-input-wrapper">
                      <span className="slug-prefix">/program/</span>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={e => handleSlugChange(e.target.value)}
                        placeholder="auto-generated-from-title"
                        className="slug-input"
                      />
                    </div>
                    {formData.slug && (
                      <div className="slug-preview">
                        Preview: <code>/program/{formData.slug}</code>
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Program Description</label>
                    <RichTextEditor
                      value={formData.description}
                      onChange={val => handleInputChange('description', val)}
                      placeholder="Brief description of the program"
                    />
                  </div>

                  <div className="form-group">
                    <label>Program Overview</label>
                    <RichTextEditor
                      value={formData.overview}
                      onChange={val => handleInputChange('overview', val)}
                      placeholder="Detailed program overview"
                    />
                  </div>
                </div>
              )}

              {/* DYNAMIC SECTIONS TAB */}
              {activeTab === 'content' && (
                <div className="tab-content">
                  <div className="dynamic-sections-header">
                    <h4>Dynamic Content Sections</h4>
                    <button type="button" className="add-section-btn" onClick={addDynamicSection}>
                      + Add New Section
                    </button>
                  </div>

                  {formData.dynamicSections.length === 0 ? (
                    <div className="empty-sections">
                      <p>No content sections yet. Add your first section to get started.</p>
                      <button type="button" className="add-section-btn" onClick={addDynamicSection}>
                        Add First Section
                      </button>
                    </div>
                  ) : (
                    <div className="dynamic-sections-list">
                      {formData.dynamicSections.map((section, index) => (
                        <div key={section.id} className="dynamic-section-item">
                          <div className="section-item-header">
                            <div className="section-order">
                              <span>Section {index + 1}</span>
                              <div className="section-controls">
                                <button
                                  type="button"
                                  className="move-btn"
                                  onClick={() => moveDynamicSection(index, 'up')}
                                  disabled={index === 0}
                                  title="Move up"
                                >
                                  ↑
                                </button>
                                <button
                                  type="button"
                                  className="move-btn"
                                  onClick={() => moveDynamicSection(index, 'down')}
                                  disabled={index === formData.dynamicSections.length - 1}
                                  title="Move down"
                                >
                                  ↓
                                </button>
                                <button
                                  type="button"
                                  className="delete-section-btn"
                                  onClick={() => removeDynamicSection(index)}
                                  title="Delete section"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="section-fields">
                            <div className="form-group">
                              <label>Section Title</label>
                              <input
                                type="text"
                                value={section.title}
                                onChange={e => updateDynamicSection(index, 'title', e.target.value)}
                                placeholder="e.g., Program Entry Requirements"
                                required
                              />
                            </div>

                            <div className="form-group">
                              <label>Heading Style</label>
                              <div className="heading-style-options">
                                <label>
                                  <input
                                    type="radio"
                                    name={`headingStyle_${section.id}`}
                                    value="default"
                                    checked={section.headingStyle === 'default'}
                                    onChange={e => updateDynamicSection(index, 'headingStyle', e.target.value)}
                                  />
                                  Default (Two-column layout)
                                </label>
                                <label>
                                  <input
                                    type="radio"
                                    name={`headingStyle_${section.id}`}
                                    value="triangular"
                                    checked={section.headingStyle === 'triangular'}
                                    onChange={e => updateDynamicSection(index, 'headingStyle', e.target.value)}
                                  />
                                  Triangular Blue Header
                                </label>
                              </div>
                            </div>

                            <div className="form-group">
                              <label>Section Content</label>
                              <RichTextEditor
                                value={section.content}
                                onChange={val => updateDynamicSection(index, 'content', val)}
                                placeholder="Section content..."
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* STRUCTURE TAB */}
              {activeTab === 'structure' && (
                <div className="tab-content">
                  <div className="structure-section">
                    <div className="section-header">
                      <h4>Program Structure</h4>
                      <button type="button" className="add-row-btn" onClick={addStructureRow}>
                        + Add Module
                      </button>
                    </div>
                    
                    {formData.programStructure.length === 0 ? (
                      <div className="empty-structure">
                        <p>No modules added yet.</p>
                        <button type="button" className="add-row-btn" onClick={addStructureRow}>
                          Add First Module
                        </button>
                      </div>
                    ) : (
                      <div className="structure-grid">
                        {formData.programStructure.map((row, idx) => (
                          <div key={idx} className="structure-item">
                            <div className="structure-item-header">
                              <span>Module {idx + 1}</span>
                              <button
                                type="button"
                                className="delete-row-btn"
                                onClick={() => removeStructureRow(idx)}
                              >
                                ✕
                              </button>
                            </div>
                            <div className="structure-fields">
                              <input
                                type="text"
                                value={row.title}
                                onChange={e => handleStructureChange(idx, 'title', e.target.value)}
                                placeholder="Module title"
                              />
                              <select
                                value={row.type}
                                onChange={e => handleStructureChange(idx, 'type', e.target.value)}
                              >
                                <option value="">Type</option>
                                <option value="Compulsory">Compulsory</option>
                                <option value="Elective">Elective</option>
                              </select>
                              <input
                                type="text"
                                value={row.credits}
                                onChange={e => handleStructureChange(idx, 'credits', e.target.value)}
                                placeholder="Credits"
                              />
                              <input
                                type="text"
                                value={row.delivery}
                                onChange={e => handleStructureChange(idx, 'delivery', e.target.value)}
                                placeholder="Delivery mode"
                              />
                              <input
                                type="text"
                                value={row.assessment}
                                onChange={e => handleStructureChange(idx, 'assessment', e.target.value)}
                                placeholder="Assessment"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PROGRAM DIRECTOR TAB */}
              {activeTab === 'director' && (
                <div className="tab-content">
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.programDirector.showContact}
                        onChange={e => handleDirectorChange('showContact', e.target.checked)}
                      />
                      Show Program Director Contact Information
                    </label>
                  </div>

                  {formData.programDirector.showContact && (
                    <>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Director Name *</label>
                          <input
                            type="text"
                            value={formData.programDirector.name}
                            onChange={e => handleDirectorChange('name', e.target.value)}
                            placeholder="Dr. James R. Bozeman"
                            required={formData.programDirector.showContact}
                          />
                        </div>
                        <div className="form-group">
                          <label>Director Title *</label>
                          <input
                            type="text"
                            value={formData.programDirector.title}
                            onChange={e => handleDirectorChange('title', e.target.value)}
                            placeholder="Professor of Mathematics"
                            required={formData.programDirector.showContact}
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Email Address *</label>
                          <input
                            type="email"
                            value={formData.programDirector.email}
                            onChange={e => handleDirectorChange('email', e.target.value)}
                            placeholder="james.bozeman@aum.edu.mt"
                            required={formData.programDirector.showContact}
                          />
                        </div>
                        <div className="form-group">
                          <label>Phone Number</label>
                          <input
                            type="tel"
                            value={formData.programDirector.phone}
                            onChange={e => handleDirectorChange('phone', e.target.value)}
                            placeholder="+356 2169 6970"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Director Photo</label>
                        {formData.programDirector.imageUrl && (
                          <div className="current-director-photo">
                            <img src={formData.programDirector.imageUrl} alt="Director" />
                          </div>
                        )}
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              file._isDirectorPhoto = true;
                              setSelectedFile(file);
                              setShowCropper(true);
                            }
                          }}
                        />
                        <small className="form-help">Upload a professional headshot photo of the program director.</small>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* MEDIA & SEO TAB */}
              {activeTab === 'media' && (
                <div className="tab-content">
                  <div className="form-group">
                    <label>Media Type</label>
                    <div className="media-type-selection">
                      <label>
                        <input
                          type="radio"
                          name="mediaType"
                          value="image"
                          checked={mediaType === 'image'}
                          onChange={handleMediaTypeChange}
                        />
                        Image
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="mediaType"
                          value="video"
                          checked={mediaType === 'video'}
                          onChange={handleMediaTypeChange}
                        />
                        Video
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Program {mediaType === 'image' ? 'Image' : 'Video'}</label>
                    {formData.imageUrl && (
                      <div className="current-media">
                        <img src={formData.imageUrl} alt="Current program" />
                        {formData.mediaType === 'video' && <span className="video-indicator">▶ Video</span>}
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept={mediaType === 'image' ? "image/*" : "video/*"} 
                      onChange={handleMediaChange} 
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.hideFromNavbar}
                        onChange={e => handleInputChange('hideFromNavbar', e.target.checked)}
                      />
                      Hide from Navigation Menu
                    </label>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Meta Title</label>
                      <input
                        type="text"
                        value={formData.metaTitle}
                        onChange={e => handleInputChange('metaTitle', e.target.value)}
                        placeholder="SEO title"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Meta Description</label>
                    <textarea
                      rows="3"
                      value={formData.metaDescription}
                      onChange={e => handleInputChange('metaDescription', e.target.value)}
                      placeholder="SEO description"
                    />
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={closeForm}>
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? 'Saving...' : currentProgram ? 'Update Program' : 'Add Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IMAGE CROPPER MODAL */}
      {showCropper && selectedFile && (
        <div className="cropper-modal">
          <ImageCropper
            file={selectedFile}
            onCropComplete={onCropComplete}
            onCancel={() => setShowCropper(false)}
          />
        </div>
      )}
    </div>
  );
}

export default ProgramEditor;