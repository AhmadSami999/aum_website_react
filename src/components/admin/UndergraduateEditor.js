// /src/components/admin/UndergraduateEditor.js
import React, { useState, useEffect } from 'react';
import { fetchPrograms, updateProgram, addProgram, deleteProgram } from '../../firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/config';
import RichTextEditor from './RichTextEditor';
import ImageCropper from './ImageCropper';
import './UndergraduateEditor.css';

function UndergraduateEditor() {
  /* ---------- STATE ---------- */
  const [programs, setPrograms] = useState([]);
  const [currentProgram, setCurrentProgram] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    shortTitle: '',
    description: '',
    overview: '',
    entryRequirements: '',
    details: '',
    objectives: '',
    learningOutcomes: '',
    employability: '',
    programStructure: [],          // NEW
    imageUrl: '',
    hideFromNavbar: false,
    metaTitle: '',
    metaDescription: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  /* ---------- CONSTANTS ---------- */
  const fieldLabels = {
    title: 'Program Title',
    shortTitle: 'Short Title (for Navigation)',
    description: 'Program Description',
    overview: 'Program Overview',
    entryRequirements: 'Entry Requirements',
    details: 'Program Details',
    objectives: 'Program Objectives',
    learningOutcomes: 'Learning Outcomes',
    employability: 'Program Employability'
    // programStructure handled separately
  };

  /* ---------- LOAD ---------- */
  useEffect(() => { loadPrograms(); }, []);
  async function loadPrograms() {
    try {
      const data = await fetchPrograms('undergraduate');
      setPrograms(data);
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    }
  }

  /* ---------- CHANGE HANDLERS ---------- */
  function handleInputChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }
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
      programStructure: prev.programStructure.map(
        (row, i) => (i === idx ? { ...row, [field]: value } : row)
      )
    }));
  }

  /* ---------- IMAGE ---------- */
  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setShowCropper(true);
  }
  function onCropComplete(blob) {
    setShowCropper(false);
    if (!blob || !selectedFile) return;
    const newFile = new File([blob], selectedFile.name, { type: blob.type });
    const storageRef = ref(storage, `programs/undergraduate/${Date.now()}_${newFile.name}`);
    const task = uploadBytesResumable(storageRef, newFile);
    task.on('state_changed', null, err => {
      setMessage({ text: err.message, type: 'error' });
    }, async () => {
      const url = await getDownloadURL(task.snapshot.ref);
      setFormData(prev => ({ ...prev, imageUrl: url }));
    });
  }

  /* ---------- SUBMIT ---------- */
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (currentProgram) {
        await updateProgram(currentProgram.id, { ...formData, type: 'undergraduate' });
        setMessage({ text: 'Program updated!', type: 'success' });
      } else {
        await addProgram({ ...formData, type: 'undergraduate' });
        setMessage({ text: 'Program added!', type: 'success' });
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
          programStructure: [],
          imageUrl: '',
          hideFromNavbar: false,
          metaTitle: '',
          metaDescription: ''
        });
      }
      await loadPrograms();
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  /* ---------- EDIT / DELETE ---------- */
  function handleEdit(p) {
    setCurrentProgram(p);
    setFormData({
      ...p,
      programStructure: p.programStructure || [],
      metaTitle: p.metaTitle || '',
      metaDescription: p.metaDescription || ''
    });
  }
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
  function handleCancel() {
    setCurrentProgram(null);
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
      programStructure: [],
      imageUrl: '',
      hideFromNavbar: false,
      metaTitle: '',
      metaDescription: ''
    });
  }

  /* ---------- RENDER ---------- */
  return (
    <div className="undergraduate-editor">
      <h2>Edit Undergraduate Programs</h2>
      {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

      {/* LIST */}
      <div className="programs-list">
        <h3>Existing Programs</h3>
        <ul>
          {programs.map(p => (
            <li key={p.id} className="program-item">
              <div className="program-item-content">
                {p.imageUrl && <img src={p.imageUrl} alt={p.title} />}
                <div><h4>{p.title}</h4><p>{p.shortTitle}</p></div>
              </div>
              <div className="program-item-actions">
                <button className="edit-btn" onClick={() => handleEdit(p)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(p.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* FORM */}
      <h3>{currentProgram ? 'Edit' : 'Add New'} Undergraduate Program</h3>
      <form onSubmit={handleSubmit} className="editor-form">
        {Object.keys(fieldLabels).map(key => (
          <div className="form-group" key={key}>
            <label>{fieldLabels[key]}</label>
            {['title', 'shortTitle'].includes(key) ? (
              <input
                type="text"
                value={formData[key]}
                onChange={e => handleInputChange(key, e.target.value)}
              />
            ) : (
              <RichTextEditor
                value={formData[key]}
                onChange={val => handleInputChange(key, val)}
                placeholder={fieldLabels[key]}
              />
            )}
          </div>
        ))}

        {/* STRUCTURE REPEATER */}
        <div className="form-group">
          <label>Program Structure</label>
          <div className="structure-editor-wrapper">
            <table className="structure-editor-table">
              <thead>
                <tr>
                  <th>Module / Unit Title</th>
                  <th>Compulsory / Elective</th>
                  <th>ECTS / ECVETS</th>
                  <th>Mode of Delivery</th>
                  <th>Mode of Assessment</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {formData.programStructure.map((row, idx) => (
                  <tr key={idx}>
                    <td>
                      <input
                        type="text"
                        value={row.title}
                        onChange={e => handleStructureChange(idx, 'title', e.target.value)}
                      />
                    </td>
                    <td>
                      <select
                        value={row.type}
                        onChange={e => handleStructureChange(idx, 'type', e.target.value)}
                      >
                        <option value="">—</option>
                        <option value="Compulsory">Compulsory</option>
                        <option value="Elective">Elective</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.credits}
                        onChange={e => handleStructureChange(idx, 'credits', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.delivery}
                        onChange={e => handleStructureChange(idx, 'delivery', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.assessment}
                        onChange={e => handleStructureChange(idx, 'assessment', e.target.value)}
                      />
                    </td>
                    <td>
                      <button type="button" onClick={() => removeStructureRow(idx)}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" className="add-row-btn" onClick={addStructureRow}>
              + Add Row
            </button>
          </div>
        </div>

        {/* IMAGE + META */}
        <div className="form-group">
          <label>Program Image</label>
          {formData.imageUrl && (
            <div className="current-image">
              <img src={formData.imageUrl} alt="Program" />
              <p>Current image</p>
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={formData.hideFromNavbar}
              onChange={e => handleInputChange('hideFromNavbar', e.target.checked)}
            />
            Hide from Navbar
          </label>
        </div>

        <div className="form-group">
          <label>Meta Title</label>
          <input
            type="text"
            value={formData.metaTitle}
            onChange={e => handleInputChange('metaTitle', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Meta Description</label>
          <textarea
            rows="2"
            value={formData.metaDescription}
            onChange={e => handleInputChange('metaDescription', e.target.value)}
          />
        </div>

        {/* BUTTONS */}
        <div className="form-buttons">
          <button type="submit" disabled={loading}>
            {loading ? 'Saving…' : currentProgram ? 'Update Program' : 'Add Program'}
          </button>
          {currentProgram && (
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* CROPPER */}
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

export default UndergraduateEditor;
