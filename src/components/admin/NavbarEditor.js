// src/components/admin/NavbarEditor.js - Simplified with up/down arrows instead of drag and drop
import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaEye, FaEyeSlash, FaColumns, FaTag, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config'; // Adjust path as needed

// Inline styles to avoid CSS conflicts
const styles = {
  container: {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '24px',
    margin: '20px 0',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '2px solid #e9ecef'
  },
  title: {
    margin: 0,
    color: '#343a40',
    fontSize: '28px',
    fontWeight: 600
  },
  actions: {
    display: 'flex',
    gap: '12px'
  },
  btn: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease'
  },
  btnPrimary: {
    backgroundColor: '#007bff',
    color: 'white'
  },
  btnSuccess: {
    backgroundColor: '#28a745',
    color: 'white'
  },
  btnSecondary: {
    backgroundColor: '#6c757d',
    color: 'white'
  },
  btnDanger: {
    backgroundColor: '#dc3545',
    color: 'white'
  },
  btnWarning: {
    backgroundColor: '#ffc107',
    color: '#212529'
  },
  btnSm: {
    padding: '6px 12px',
    fontSize: '12px'
  },
  btnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  itemsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  itemCard: {
    backgroundColor: 'white',
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.2s ease'
  },
  itemContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  orderControls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flexShrink: 0
  },
  itemInfo: {
    flex: 1,
    minWidth: 0
  },
  itemTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#343a40',
    marginBottom: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap'
  },
  itemType: {
    fontSize: '11px',
    padding: '2px 8px',
    borderRadius: '12px',
    textTransform: 'uppercase',
    fontWeight: 700,
    letterSpacing: '0.5px',
    backgroundColor: '#e3f2fd',
    color: '#1976d2'
  },
  itemUrl: {
    fontSize: '12px',
    color: '#6c757d',
    fontFamily: 'monospace',
    backgroundColor: '#f8f9fa',
    padding: '2px 6px',
    borderRadius: '3px',
    display: 'inline-block',
    marginTop: '4px'
  },
  itemActions: {
    display: 'flex',
    gap: '8px',
    flexShrink: 0
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    maxWidth: '1200px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid #e9ecef'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#6c757d',
    padding: '8px',
    borderRadius: '4px'
  },
  form: {
    padding: '24px'
  },
  formField: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: 600,
    color: '#495057',
    fontSize: '14px'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '2px solid #e9ecef',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: 'white',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    border: '2px solid #e9ecef',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: 'white',
    boxSizing: 'border-box'
  },
  checkbox: {
    marginRight: '8px'
  },
  formActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '32px',
    paddingTop: '20px',
    borderTop: '1px solid #e9ecef'
  },
  megaMenuSection: {
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '2px solid #e9ecef'
  },
  megaMenuHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  columnsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  columnCard: {
    backgroundColor: '#f8f9fa',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px'
  },
  columnHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px'
  },
  columnTitleInput: {
    flex: 1,
    padding: '8px 12px',
    border: '2px solid #dee2e6',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 600,
    boxSizing: 'border-box'
  },
  columnItems: {
    backgroundColor: 'white',
    borderRadius: '6px',
    padding: '12px',
    border: '1px solid #dee2e6'
  },
  columnItemForm: {
    display: 'grid',
    gridTemplateColumns: '2fr 2fr auto auto',
    gap: '8px',
    alignItems: 'center',
    marginBottom: '8px',
    padding: '8px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px'
  },
  columnItemInput: {
    padding: '6px 8px',
    border: '1px solid #dee2e6',
    borderRadius: '4px',
    fontSize: '13px',
    margin: 0,
    boxSizing: 'border-box'
  }
};

const NavbarEditor = () => {
  const [navItems, setNavItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    type: 'link',
    url: '',
    isExternal: false,
    visible: true,
    megaMenuColumns: []
  });

  useEffect(() => {
    loadNavbarConfig();
  }, []);

  const loadNavbarConfig = async () => {
    try {
      console.log('Loading navbar config from Firestore...');
      
      const docRef = doc(db, 'navbar', 'config');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        console.log('Config loaded from Firestore:', docSnap.data());
        setNavItems(docSnap.data().items || getDefaultNavItems());
      } else {
        console.log('No config found in Firestore, using defaults');
        setNavItems(getDefaultNavItems());
      }
    } catch (error) {
      console.error('Error loading navbar config from Firestore:', error);
      alert('Error loading navbar config: ' + error.message);
      setNavItems(getDefaultNavItems());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultNavItems = () => [
    {
      id: 'undergraduate',
      title: 'Undergraduate',
      type: 'megamenu',
      visible: true,
      order: 1,
      megaMenuColumns: [
        {
          id: 'col-1',
          title: 'Business Programs',
          order: 1,
          items: [
//            { title: 'All Undergraduate Programs', url: '/undergraduate', isExternal: false },
            { title: 'Business Administration', url: '/program/business-admin', isExternal: false }
          ]
        }
      ]
    },
    {
      id: 'student-life',
      title: 'Student Life',
      type: 'link',
      url: '/student-life',
      isExternal: false,
      visible: true,
      order: 2
    },
    {
      id: 'apply-now',
      title: 'APPLY NOW',
      type: 'button',
      url: 'https://apply.aum.edu.mt',
      isExternal: true,
      visible: true,
      order: 3
    }
  ];

  // Move item up in order
  const handleMoveUp = (itemId) => {
    const currentIndex = navItems.findIndex(item => item.id === itemId);
    if (currentIndex <= 0) return; // Already at top
    
    const newItems = [...navItems];
    const temp = newItems[currentIndex];
    newItems[currentIndex] = newItems[currentIndex - 1];
    newItems[currentIndex - 1] = temp;
    
    // Update order numbers
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      order: index + 1
    }));
    
    setNavItems(updatedItems);
  };

  // Move item down in order
  const handleMoveDown = (itemId) => {
    const currentIndex = navItems.findIndex(item => item.id === itemId);
    if (currentIndex >= navItems.length - 1) return; // Already at bottom
    
    const newItems = [...navItems];
    const temp = newItems[currentIndex];
    newItems[currentIndex] = newItems[currentIndex + 1];
    newItems[currentIndex + 1] = temp;
    
    // Update order numbers
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      order: index + 1
    }));
    
    setNavItems(updatedItems);
  };

  // Move column up in mega menu
  const handleMoveColumnUp = (columnId) => {
    const columns = [...formData.megaMenuColumns];
    const currentIndex = columns.findIndex(col => col.id === columnId);
    if (currentIndex <= 0) return;
    
    const temp = columns[currentIndex];
    columns[currentIndex] = columns[currentIndex - 1];
    columns[currentIndex - 1] = temp;
    
    const updatedColumns = columns.map((col, index) => ({
      ...col,
      order: index + 1
    }));
    
    setFormData({
      ...formData,
      megaMenuColumns: updatedColumns
    });
  };

  // Move column down in mega menu
  const handleMoveColumnDown = (columnId) => {
    const columns = [...formData.megaMenuColumns];
    const currentIndex = columns.findIndex(col => col.id === columnId);
    if (currentIndex >= columns.length - 1) return;
    
    const temp = columns[currentIndex];
    columns[currentIndex] = columns[currentIndex + 1];
    columns[currentIndex + 1] = temp;
    
    const updatedColumns = columns.map((col, index) => ({
      ...col,
      order: index + 1
    }));
    
    setFormData({
      ...formData,
      megaMenuColumns: updatedColumns
    });
  };

  const handleAddItem = () => {
    setFormData({
      title: '',
      type: 'link',
      url: '',
      isExternal: false,
      visible: true,
      megaMenuColumns: []
    });
    setEditingItem(null);
    setShowAddForm(true);
  };

  const handleEditItem = (item) => {
    setFormData({
      title: item.title,
      type: item.type,
      url: item.url || '',
      isExternal: item.isExternal || false,
      visible: item.visible,
      megaMenuColumns: item.megaMenuColumns || []
    });
    setEditingItem(item);
    setShowAddForm(true);
  };

  const handleDeleteItem = (itemId) => {
    if (window.confirm('Are you sure you want to delete this navbar item?')) {
      const newItems = navItems.filter(item => item.id !== itemId);
      // Reorder remaining items
      const updatedItems = newItems.map((item, index) => ({
        ...item,
        order: index + 1
      }));
      setNavItems(updatedItems);
    }
  };

  const handleToggleVisibility = (itemId) => {
    setNavItems(navItems.map(item => 
      item.id === itemId ? { ...item, visible: !item.visible } : item
    ));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    
    if (editingItem) {
      setNavItems(navItems.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData }
          : item
      ));
    } else {
      const newItem = {
        ...formData,
        id: `item-${Date.now()}`,
        order: navItems.length + 1
      };
      setNavItems([...navItems, newItem]);
    }
    
    setShowAddForm(false);
    setEditingItem(null);
  };

  const handleAddColumn = () => {
    const newColumn = {
      id: `col-${Date.now()}`,
      title: '',
      order: formData.megaMenuColumns.length + 1,
      items: []
    };
    setFormData({
      ...formData,
      megaMenuColumns: [...formData.megaMenuColumns, newColumn]
    });
  };

  const handleUpdateColumn = (columnId, field, value) => {
    setFormData({
      ...formData,
      megaMenuColumns: formData.megaMenuColumns.map(col =>
        col.id === columnId ? { ...col, [field]: value } : col
      )
    });
  };

  const handleDeleteColumn = (columnId) => {
    if (window.confirm('Are you sure you want to delete this column?')) {
      const newColumns = formData.megaMenuColumns.filter(col => col.id !== columnId);
      // Reorder remaining columns
      const updatedColumns = newColumns.map((col, index) => ({
        ...col,
        order: index + 1
      }));
      setFormData({
        ...formData,
        megaMenuColumns: updatedColumns
      });
    }
  };

  const handleAddColumnItem = (columnId) => {
    setFormData({
      ...formData,
      megaMenuColumns: formData.megaMenuColumns.map(col =>
        col.id === columnId
          ? {
              ...col,
              items: [...col.items, { title: '', url: '', isExternal: false }]
            }
          : col
      )
    });
  };

  const handleUpdateColumnItem = (columnId, itemIndex, field, value) => {
    setFormData({
      ...formData,
      megaMenuColumns: formData.megaMenuColumns.map(col =>
        col.id === columnId
          ? {
              ...col,
              items: col.items.map((item, index) =>
                index === itemIndex ? { ...item, [field]: value } : item
              )
            }
          : col
      )
    });
  };

  const handleRemoveColumnItem = (columnId, itemIndex) => {
    setFormData({
      ...formData,
      megaMenuColumns: formData.megaMenuColumns.map(col =>
        col.id === columnId
          ? {
              ...col,
              items: col.items.filter((_, index) => index !== itemIndex)
            }
          : col
      )
    });
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    console.log('Attempting to save navbar config:', navItems);
    
    try {
      const docRef = doc(db, 'navbar', 'config');
      await setDoc(docRef, {
        items: navItems,
        lastUpdated: new Date().toISOString()
      });
      
      console.log('Successfully saved to Firestore');
      alert('Navbar configuration saved successfully!');
      
    } catch (error) {
      console.error('Error saving navbar config:', error);
      alert('Error saving configuration: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px', color: '#666' }}>
          Loading navbar configuration...
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Navbar Management</h2>
        <div style={styles.actions}>
          <button 
            style={{...styles.btn, ...styles.btnPrimary}} 
            onClick={handleAddItem}
          >
            <FaPlus /> Add Item
          </button>
          <button 
            style={{...styles.btn, ...styles.btnSuccess}} 
            onClick={handleSaveChanges}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Debug info */}
      <div style={{ marginBottom: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '4px', fontSize: '14px' }}>
        <strong>Debug Info:</strong> {navItems.length} items loaded
        <button 
          onClick={() => console.log('Current navItems:', navItems)} 
          style={{ marginLeft: '10px', padding: '4px 8px', fontSize: '12px' }}
        >
          Log Items to Console
        </button>
      </div>

      {/* Main navbar items list with up/down arrows */}
      <ul style={styles.itemsList}>
        {navItems.map((item, index) => (
          <li key={item.id} style={styles.itemCard}>
            <div style={styles.itemContent}>
              {/* Order Controls */}
              <div style={styles.orderControls}>
                <button
                  style={{
                    ...styles.btn, 
                    ...styles.btnSm, 
                    ...styles.btnWarning,
                    ...(index === 0 ? styles.btnDisabled : {})
                  }}
                  onClick={() => handleMoveUp(item.id)}
                  disabled={index === 0}
                  title="Move up"
                >
                  <FaArrowUp />
                </button>
                <button
                  style={{
                    ...styles.btn, 
                    ...styles.btnSm, 
                    ...styles.btnWarning,
                    ...(index === navItems.length - 1 ? styles.btnDisabled : {})
                  }}
                  onClick={() => handleMoveDown(item.id)}
                  disabled={index === navItems.length - 1}
                  title="Move down"
                >
                  <FaArrowDown />
                </button>
              </div>
              
              <div style={styles.itemInfo}>
                <div style={styles.itemTitle}>
                  {item.title}
                  <span style={styles.itemType}>
                    {item.type === 'megamenu' ? 'mega menu' : item.type}
                  </span>
                </div>
                {item.url && (
                  <div style={styles.itemUrl}>{item.url}</div>
                )}
                {item.megaMenuColumns && item.megaMenuColumns.length > 0 && (
                  <div style={{ fontSize: '12px', color: '#7b1fa2', marginTop: '4px' }}>
                    <FaColumns /> {item.megaMenuColumns.length} columns
                  </div>
                )}
              </div>

              <div style={styles.itemActions}>
                <button
                  style={{
                    ...styles.btn, 
                    ...styles.btnSm, 
                    ...(item.visible ? styles.btnSuccess : styles.btnSecondary)
                  }}
                  onClick={() => handleToggleVisibility(item.id)}
                  title={item.visible ? 'Hide item' : 'Show item'}
                >
                  {item.visible ? <FaEye /> : <FaEyeSlash />}
                </button>
                <button
                  style={{...styles.btn, ...styles.btnSm, ...styles.btnPrimary}}
                  onClick={() => handleEditItem(item)}
                >
                  <FaEdit />
                </button>
                <button
                  style={{...styles.btn, ...styles.btnSm, ...styles.btnDanger}}
                  onClick={() => handleDeleteItem(item.id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Form Modal */}
      {showAddForm && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>
                {editingItem ? 'Edit Navbar Item' : 'Add Navbar Item'}
              </h3>
              <button 
                style={styles.closeBtn}
                onClick={() => setShowAddForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitForm} style={styles.form}>
              <div style={styles.formField}>
                <label style={styles.label}>Title *</label>
                <input
                  style={styles.input}
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div style={styles.formField}>
                <label style={styles.label}>Type *</label>
                <select
                  style={styles.select}
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="link">Simple Link</option>
                  <option value="megamenu">Mega Menu</option>
                  <option value="button">Button</option>
                </select>
              </div>

              {formData.type !== 'megamenu' && (
                <div style={styles.formField}>
                  <label style={styles.label}>URL *</label>
                  <input
                    style={styles.input}
                    type="text"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    required
                    placeholder="e.g., /about or https://external-site.com"
                  />
                </div>
              )}

              {formData.type !== 'megamenu' && (
                <div style={styles.formField}>
                  <label style={{ ...styles.label, display: 'flex', alignItems: 'center' }}>
                    <input
                      style={styles.checkbox}
                      type="checkbox"
                      checked={formData.isExternal}
                      onChange={(e) => setFormData({ ...formData, isExternal: e.target.checked })}
                    />
                    External Link
                  </label>
                </div>
              )}

              <div style={styles.formField}>
                <label style={{ ...styles.label, display: 'flex', alignItems: 'center' }}>
                  <input
                    style={styles.checkbox}
                    type="checkbox"
                    checked={formData.visible}
                    onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                  />
                  Visible
                </label>
              </div>

              {/* Mega Menu Columns Section */}
              {formData.type === 'megamenu' && (
                <div style={styles.megaMenuSection}>
                  <div style={styles.megaMenuHeader}>
                    <h4 style={{ margin: 0, color: '#7b1fa2', fontSize: '18px', fontWeight: 600 }}>
                      <FaColumns /> Mega Menu Columns
                    </h4>
                    <button
                      type="button"
                      style={{...styles.btn, ...styles.btnSm, ...styles.btnPrimary}}
                      onClick={handleAddColumn}
                    >
                      <FaPlus /> Add Column
                    </button>
                  </div>

                  <ul style={styles.columnsList}>
                    {formData.megaMenuColumns.map((column, index) => (
                      <li key={column.id} style={styles.columnCard}>
                        <div style={styles.columnHeader}>
                          <div style={styles.orderControls}>
                            <button
                              type="button"
                              style={{
                                ...styles.btn, 
                                ...styles.btnSm, 
                                ...styles.btnWarning,
                                ...(index === 0 ? styles.btnDisabled : {})
                              }}
                              onClick={() => handleMoveColumnUp(column.id)}
                              disabled={index === 0}
                              title="Move column up"
                            >
                              <FaArrowUp />
                            </button>
                            <button
                              type="button"
                              style={{
                                ...styles.btn, 
                                ...styles.btnSm, 
                                ...styles.btnWarning,
                                ...(index === formData.megaMenuColumns.length - 1 ? styles.btnDisabled : {})
                              }}
                              onClick={() => handleMoveColumnDown(column.id)}
                              disabled={index === formData.megaMenuColumns.length - 1}
                              title="Move column down"
                            >
                              <FaArrowDown />
                            </button>
                          </div>
                          <input
                            style={styles.columnTitleInput}
                            type="text"
                            placeholder="Column Title"
                            value={column.title}
                            onChange={(e) => handleUpdateColumn(column.id, 'title', e.target.value)}
                          />
                          <button
                            type="button"
                            style={{...styles.btn, ...styles.btnSm, ...styles.btnDanger}}
                            onClick={() => handleDeleteColumn(column.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>

                        <div style={styles.columnItems}>
                          {column.items.map((item, itemIndex) => (
                            <div key={itemIndex} style={styles.columnItemForm}>
                              <input
                                style={styles.columnItemInput}
                                type="text"
                                placeholder="Link Title"
                                value={item.title}
                                onChange={(e) => handleUpdateColumnItem(column.id, itemIndex, 'title', e.target.value)}
                              />
                              <input
                                style={styles.columnItemInput}
                                type="text"
                                placeholder="URL"
                                value={item.url}
                                onChange={(e) => handleUpdateColumnItem(column.id, itemIndex, 'url', e.target.value)}
                              />
                              <label style={{ display: 'flex', alignItems: 'center', fontSize: '11px', margin: 0, whiteSpace: 'nowrap', fontWeight: 500 }}>
                                <input
                                  type="checkbox"
                                  checked={item.isExternal}
                                  onChange={(e) => handleUpdateColumnItem(column.id, itemIndex, 'isExternal', e.target.checked)}
                                  style={{ marginRight: '4px', transform: 'scale(1.1)' }}
                                />
                                External
                              </label>
                              <button
                                type="button"
                                style={{...styles.btn, ...styles.btnSm, ...styles.btnDanger}}
                                onClick={() => handleRemoveColumnItem(column.id, itemIndex)}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            style={{
                              ...styles.btn, 
                              ...styles.btnSm, 
                              ...styles.btnSecondary,
                              width: '100%',
                              marginTop: '8px',
                              justifyContent: 'center'
                            }}
                            onClick={() => handleAddColumnItem(column.id)}
                          >
                            <FaPlus /> Add Link
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={styles.formActions}>
                <button 
                  type="button" 
                  style={{...styles.btn, ...styles.btnSecondary}} 
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" style={{...styles.btn, ...styles.btnPrimary}}>
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarEditor;