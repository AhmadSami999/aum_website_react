// Unified Page Editor Component
import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import ImageCropper from './ImageCropper';
import { getPageConfig } from './pageConfigs';
import { useHomeContext } from '../../contexts/HomeContext';
import RichTextEditor from './RichTextEditor';
import './PageEditor.css';

// Main PageEditor Component
function PageEditor() {
  const { pageId } = useParams();
  const config = getPageConfig(pageId);
  const { updateHomeBackground } = useHomeContext();

  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showCropper, setShowCropper] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (!config) {
      setMessage({ text: 'Invalid page configuration', type: 'error' });
      setLoading(false);
      return;
    }

    async function loadContent() {
      try {
        const docRef = doc(db, config.collection, config.documentId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setContent(mergeWithDefaults(data, config.defaultContent));
        } else {
          setContent(config.defaultContent);
        }
      } catch (error) {
        console.error("Error loading content:", error);
        setMessage({ text: `Error loading content: ${error.message}`, type: 'error' });
        setContent(config.defaultContent);
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, [pageId, config]);

  // Helper function to merge loaded data with defaults
  const mergeWithDefaults = (data, defaults) => {
    const merged = { ...defaults };
    
    const mergeRecursive = (target, source) => {
      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          target[key] = target[key] || {};
          mergeRecursive(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
    };
    
    mergeRecursive(merged, data);
    return merged;
  };

  // Get value from nested path (e.g., "hero.title")
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  // Set value in nested path
  const setNestedValue = (obj, path, value) => {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    target[lastKey] = value;
  };

  // Handle input changes
  const handleInputChange = (fieldName, value) => {
    setContent(prev => {
      const newContent = { ...prev };
      setNestedValue(newContent, fieldName, value);
      return newContent;
    });
  };

  // Handle file upload
  const handleFileUpload = (e, fieldName, folder) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setSelectedFile({ file, fieldName, folder });
    setShowCropper(true);
  };

  // Handle crop complete
  const onCropComplete = (croppedBlob) => {
    setShowCropper(false);
    
    if (!croppedBlob || !selectedFile) return;
    
    const newFile = new File([croppedBlob], selectedFile.file.name, { type: croppedBlob.type });
    uploadCroppedImage(newFile, selectedFile.fieldName, selectedFile.folder);
  };

  // Upload cropped image
  const uploadCroppedImage = (file, fieldName, folder) => {
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `${folder}/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload progress: ${progress.toFixed(2)}%`);
      },
      (error) => {
        console.error("Upload error:", error);
        setMessage({ text: `Upload error: ${error.message}`, type: 'error' });
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          handleInputChange(fieldName, downloadURL);
          
          // Special handling for home page background
          if (pageId === 'home' && fieldName === 'iconBackground.url') {
            updateHomeBackground(downloadURL);
          }
          
          setMessage({ text: 'Image uploaded successfully!', type: 'success' });
        } catch (error) {
          console.error("Error getting download URL:", error);
          setMessage({ text: `Error finalizing upload: ${error.message}`, type: 'error' });
        }
      }
    );
  };

  // Handle repeater field operations
  const handleRepeaterAdd = (fieldName, defaultItem) => {
    setContent(prev => {
      const newContent = { ...prev };
      const currentArray = getNestedValue(newContent, fieldName) || [];
      const newItem = { ...defaultItem, id: `item-${Date.now()}` };
      setNestedValue(newContent, fieldName, [...currentArray, newItem]);
      return newContent;
    });
  };

  const handleRepeaterRemove = (fieldName, index) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    setContent(prev => {
      const newContent = { ...prev };
      const currentArray = getNestedValue(newContent, fieldName) || [];
      setNestedValue(newContent, fieldName, currentArray.filter((_, i) => i !== index));
      return newContent;
    });
  };

  const handleRepeaterChange = (fieldName, index, itemField, value) => {
    setContent(prev => {
      const newContent = { ...prev };
      const currentArray = getNestedValue(newContent, fieldName) || [];
      currentArray[index] = { ...currentArray[index], [itemField]: value };
      setNestedValue(newContent, fieldName, currentArray);
      return newContent;
    });
  };

  // Save content
  const handleSave = async () => {
    setSaving(true);
    setMessage({ text: '', type: '' });
    
    try {
      const docRef = doc(db, config.collection, config.documentId);
      await setDoc(docRef, content);
      setMessage({ text: `${config.title} updated successfully!`, type: 'success' });
    } catch (error) {
      console.error("Error saving content:", error);
      setMessage({ text: `Error updating content: ${error.message}`, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Render field based on type
  const renderField = (field) => {
    const value = getNestedValue(content, field.name) || '';
    
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            rows={field.rows || 3}
            placeholder={field.placeholder}
            required={field.required}
          />
        );
      
      case 'richtext':
        return (
          <RichTextEditor
            value={value}
            onChange={(val) => handleInputChange(field.name, val)}
            placeholder={field.placeholder}
          />
        );
      
      case 'image':
        return (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, field.name, field.folder)}
            />
            {value && (
              <div className="current-image">
                <p>Current image:</p>
                <img src={value} alt="Current" style={{ maxWidth: '100%', maxHeight: '200px' }} />
              </div>
            )}
          </>
        );
      
      default:
        return null;
    }
  };

  if (!config) {
    return (
      <div className="page-editor">
        <h2>Page Not Found</h2>
        <p>The page configuration for "{pageId}" was not found.</p>
        <Link to="/admin">Back to Admin Dashboard</Link>
      </div>
    );
  }

  if (loading) return <div className="loading">Loading content...</div>;

  return (
    <div className="page-editor">
      <h2>Edit {config.title}</h2>
      {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

      <div className="editor-sections">
        {config.sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="editor-section">
            <h3>{section.title}</h3>
            
            {section.type === 'repeater' ? (
              // Render repeater section
              <div className="repeater-section">
                {(getNestedValue(content, section.name) || []).map((item, index) => (
                  <div key={item.id || index} className="repeater-item">
                    <div className="repeater-item-header">
                      <h4>Item {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => handleRepeaterRemove(section.name, index)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                    {section.fields.map((field) => (
                      <div key={field.name} className="form-group">
                        <label>{field.label}</label>
                        {field.type === 'richtext' ? (
                          <RichTextEditor
                            value={item[field.name] || ''}
                            onChange={(val) => handleRepeaterChange(section.name, index, field.name, val)}
                            placeholder={field.placeholder}
                          />
                        ) : field.type === 'textarea' ? (
                          <textarea
                            value={item[field.name] || ''}
                            onChange={(e) => handleRepeaterChange(section.name, index, field.name, e.target.value)}
                            rows={field.rows || 3}
                            required={field.required}
                          />
                        ) : (
                          <input
                            type="text"
                            value={item[field.name] || ''}
                            onChange={(e) => handleRepeaterChange(section.name, index, field.name, e.target.value)}
                            required={field.required}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleRepeaterAdd(section.name, section.defaultItem)}
                  className="add-btn"
                >
                  {section.addButtonText || 'Add Item'}
                </button>
              </div>
            ) : (
              // Render normal fields
              section.fields.map((field) => (
                <div key={field.name} className="form-group">
                  <label htmlFor={field.name}>
                    {field.label}
                    {field.required && <span className="required">*</span>}
                  </label>
                  {renderField(field)}
                </div>
              ))
            )}
          </div>
        ))}
      </div>

      <div className="save-section">
        <button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <Link to={config.viewPath} target="_blank" className="view-page-btn">
          View Page
        </Link>
      </div>

      {showCropper && selectedFile && (
        <div className="cropper-modal">
          <ImageCropper
            file={selectedFile.file}
            onCropComplete={onCropComplete}
            onCancel={() => setShowCropper(false)}
          />
        </div>
      )}
    </div>
  );
}

export default PageEditor;