import React, { useEffect, useState } from 'react';
import {
  fetchFacultyMembers,
  addFacultyMember,
  updateFacultyMember,
  deleteFacultyMember,
} from '../../firebase/firestore';
import { storage } from '../../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import ImageCropper from './ImageCropper';
import './FacultyManager.css';
import RichTextEditor from './RichTextEditor';

const colleges = [
  'College of Business',
  'College of Data Science & Engineering',
  'College of Arts',
];

const emptyMember = {
  name: '',
  title: '',
  department: '',
  bio: '',
  imageUrl: '',
  college: colleges[0],
};

function FacultyManager() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState(emptyMember);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await fetchFacultyMembers();
      setMembers(data);
      setLoading(false);
    }
    load();
  }, []);

  function handleInputChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Store the file and show the cropper
    setSelectedFile(file);
    setShowCropper(true);
  }

  function handleRichTextChange(field, value) {
    setForm({ ...form, [field]: value });
  }


  function onCropComplete(croppedBlob) {
    // Close the cropper
    setShowCropper(false);

    if (!croppedBlob || !selectedFile) {
      console.error("Cropping failed - no blob or selected file");
      return;
    }

    // Create a new file from the blob
    const newFile = new File([croppedBlob], selectedFile.name, { type: croppedBlob.type });

    // Upload the cropped image
    uploadCroppedImage(newFile);
  }

  function uploadCroppedImage(file) {
    const storageRef = ref(storage, `faculty/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Optional: Add progress tracking
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload progress: ${progress.toFixed(2)}%`);
      },
      error => {
        setMessage({ text: error.message, type: 'error' });
        console.error('Upload error:', error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setForm(prev => ({ ...prev, imageUrl: downloadURL }));
          setMessage({ text: 'Image uploaded successfully!', type: 'success' });
        } catch (error) {
          console.error('Error getting download URL:', error);
          setMessage({ text: error.message, type: 'error' });
        }
      }
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updateFacultyMember(editingId, form);
        setMessage({ text: 'Faculty member updated.', type: 'success' });
      } else {
        await addFacultyMember(form);
        setMessage({ text: 'Faculty member added.', type: 'success' });
      }
      const data = await fetchFacultyMembers();
      setMembers(data);
      setForm(emptyMember);
      setEditingId(null);
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this member?')) return;
    await deleteFacultyMember(id);
    const data = await fetchFacultyMembers();
    setMembers(data);
  }

  function handleEdit(member) {
    setForm(member);
    setEditingId(member.id);
  }

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="home-editor">
      <h2>Faculty Members</h2>

      {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

      {/* Form for Adding/Editing */}
      <form onSubmit={handleSubmit} className="editor-section">
        <h3>{editingId ? 'Edit Member' : 'Add New Member'}</h3>

        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            className="styled-input"
            value={form.name}
            onChange={e => handleInputChange('name', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            className="styled-input"
            value={form.title}
            onChange={e => handleInputChange('title', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Department</label>
          <input
            type="text"
            className="styled-input"
            value={form.department}
            onChange={e => handleInputChange('department', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>College</label>
          <select
            className="styled-input"
            value={form.college}
            onChange={e => handleInputChange('college', e.target.value)}
          >
            {colleges.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Bio</label>
          <RichTextEditor
            value={form.bio}
            onChange={(value) => handleRichTextChange('bio', value)}
            placeholder="Enter the faculty member's bio with rich text formatting"
          />
        </div>

        <div className="form-group">
          <label>Image</label>
          <input
            type="file"
            className="styled-input"
            accept="image/*"
            onChange={handleFileUpload}
          />
          {form.imageUrl && (
            <div className="current-image">
              <p>Current image:</p>
              <img
                src={form.imageUrl}
                alt={form.name || "Faculty member"}
                style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }}
              />
            </div>
          )}
        </div>

        <div className="save-section">
          <button type="submit" disabled={saving}>
            {saving ? 'Saving...' : editingId ? 'Update Member' : 'Add Member'}
          </button>
        </div>
      </form>

      {/* Grouped Members */}
      <div className="editor-sections">
        {colleges.map(college => (
          <div key={college} className="editor-section">
            <h3>{college}</h3>
            {members.filter(m => m.college === college).length === 0 ? (
              <p>No faculty members in this college.</p>
            ) : (
              members.filter(m => m.college === college).map(member => (
                <div key={member.id} className="member-card">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src={member.imageUrl || '/placeholder.png'}
                      alt={member.name}
                      className="member-avatar"
                    />
                    <div className="member-info">
                      <strong>{member.name}</strong><br />
                      <small>{member.title} — {member.department}</small>
                    </div>
                  </div>
                  <div className="member-actions">
                    <button
                      type="button"
                      className="edit"
                      onClick={() => handleEdit(member)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="delete"
                      onClick={() => handleDelete(member.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ))}
      </div>

      {/* Image Cropper Modal */}
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

export default FacultyManager;
