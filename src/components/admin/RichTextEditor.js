import React, { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { ImageResize } from 'tiptap-extension-resize-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { storage } from '../../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import './RichTextEditor.css';

export default function RichTextEditor({ value, onChange, placeholder }) {
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [showTableDropdown, setShowTableDropdown] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageAlignment, setImageAlignment] = useState('none');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('url'); // 'url' or 'upload'
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [sourceValue, setSourceValue] = useState(value || '');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      ImageResize.configure({
        inline: false,
        allowBase64: false,
        useFigure: false,
        HTMLAttributes: {
          class: 'editor-image resizable-image',
        },
        // Ensure class attribute is parsed and stored
        addAttributes() {
          return {
            ...this.parent?.(),
            class: {
              default: 'editor-image resizable-image',
              parseHTML: element => element.getAttribute('class'),
              renderHTML: attributes => {
                if (!attributes.class) return {};
                return { class: attributes.class };
              }
            }
          };
        },
        // Force dimensions to be saved as attributes and preserve classes
        renderHTML({ HTMLAttributes, node }) {
          const { width, height, class: className } = node.attrs;
          return [
            'img',
            {
              ...HTMLAttributes,
              class: className || HTMLAttributes.class,
              width: width || null,
              height: height || null,
              style: width && height ? `width: ${width}px; height: ${height}px;` : null,
            }
          ];
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML() && !isSourceMode) {
      editor.commands.setContent(value);
    }
    if (isSourceMode) {
      setSourceValue(value || '');
    }
  }, [value, editor, isSourceMode]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showTableDropdown && !event.target.closest('.table-dropdown-container')) {
        setShowTableDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showTableDropdown]);

  const insertTable = () => {
    if (editor) {
      editor.chain().focus().insertTable({ 
        rows: tableRows, 
        cols: tableCols, 
        withHeaderRow: true 
      }).run();
      setShowTableModal(false);
    }
  };

  const uploadImageToFirebase = (file) => {
    return new Promise((resolve, reject) => {
      const fileName = `rich-text-images/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  };

  const insertImage = async () => {
    if (!editor) return;

    let finalImageUrl = imageUrl;

    // If using upload method and file is selected, upload first
    if (uploadMethod === 'upload' && selectedFile) {
      setIsUploading(true);
      setUploadProgress(0);
      
      try {
        finalImageUrl = await uploadImageToFirebase(selectedFile);
      } catch (error) {
        console.error('Failed to upload image:', error);
        alert('Failed to upload image. Please try again.');
        setIsUploading(false);
        return;
      }
      
      setIsUploading(false);
    }

    if (finalImageUrl) {
      let imageClass = 'editor-image resizable-image';
      
      // Add alignment classes
      if (imageAlignment === 'left') {
        imageClass += ' image-align-left';
      } else if (imageAlignment === 'center') {
        imageClass += ' image-align-center';
      } else if (imageAlignment === 'right') {
        imageClass += ' image-align-right';
      }


      editor.chain().focus().setImage({ 
        src: finalImageUrl, 
        alt: imageAlt || 'Image',
        class: imageClass
      }).run();
      
      // Reset modal state
      setShowImageModal(false);
      setImageUrl('');
      setImageAlt('');
      setImageAlignment('none');
      setSelectedFile(null);
      setUploadProgress(0);
      setUploadMethod('url');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      // Auto-set alt text to filename without extension
      if (!imageAlt) {
        const altText = file.name.split('.').slice(0, -1).join('.');
        setImageAlt(altText);
      }
    }
  };

  const toggleSourceMode = () => {
    if (isSourceMode) {
      // Switching from source to visual
      if (editor) {
        editor.commands.setContent(sourceValue);
        onChange(sourceValue);
      }
    } else {
      // Switching from visual to source
      setSourceValue(editor ? editor.getHTML() : '');
    }
    setIsSourceMode(!isSourceMode);
  };

  const handleSourceChange = (e) => {
    const newValue = e.target.value;
    setSourceValue(newValue);
    onChange(newValue);
  };

  const updateSelectedImageAlignment = (alignment) => {
    if (!editor) {
      console.log('❌ No editor available');
      return;
    }
    
    console.log('🔄 === ALIGNMENT CHANGE DEBUG ===');
    console.log('🔄 Requested alignment:', alignment);
    console.log('🔄 Editor state:', editor.state);
    console.log('🔄 Current selection:', editor.state.selection);
    console.log('🔄 Is image active?', editor.isActive('image'));
    
    // Get the current selection
    const { state } = editor;
    const { selection } = state;
    
    console.log('🔄 Selection from:', selection.from, 'to:', selection.to);
    
    // Try different ways to find the selected node
    const selectedNode = state.doc.nodeAt(selection.from);
    console.log('🔄 Node at selection.from:', selectedNode);
    
    // Also try checking the node at selection anchor
    const anchorNode = state.doc.nodeAt(selection.anchor);
    console.log('🔄 Node at anchor:', anchorNode);
    
    // Try to find any image node in the selection
    let imageNode = null;
    let imagePos = null;
    
    state.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
      console.log('🔄 Node between selection:', node.type.name, 'at pos:', pos);
      if (node.type.name === 'image') {
        imageNode = node;
        imagePos = pos;
        return false; // stop searching
      }
    });
    
    console.log('🔄 Found image node:', imageNode);
    console.log('🔄 Image position:', imagePos);
    
    if (imageNode) {
      const currentClass = imageNode.attrs.class || '';
      const currentSrc = imageNode.attrs.src || '';
      const currentAlt = imageNode.attrs.alt || '';
      
      console.log('🔄 Current image attributes:');
      console.log('🔄 - class:', currentClass);
      console.log('🔄 - src:', currentSrc);
      console.log('🔄 - alt:', currentAlt);
      
      // Remove existing alignment classes
      let newClass = currentClass
        .replace(/\bimage-align-left\b/g, '')
        .replace(/\bimage-align-center\b/g, '')
        .replace(/\bimage-align-right\b/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      
      // Add new alignment class
      if (alignment === 'left') {
        newClass += ' image-align-left';
      } else if (alignment === 'center') {
        newClass += ' image-align-center';
      } else if (alignment === 'right') {
        newClass += ' image-align-right';
      }
      
      newClass = newClass.trim();
      console.log('🔄 New image class:', newClass);
      
      // Update the image with new class
      console.log('🔄 Updating image at position:', imagePos);
      
      try {
        editor.chain().focus().setImage({
          src: currentSrc,
          alt: currentAlt,
          class: newClass
        }).run();
        console.log('✅ Image update command executed');
      } catch (error) {
        console.error('❌ Error updating image:', error);
      }
      
      // Check if the update worked
      setTimeout(() => {
        const newHtml = editor.getHTML();
        console.log('🔄 HTML after update:', newHtml);
      }, 100);
    } else {
      console.log('❌ No image node found in selection');
      console.log('🔄 Available nodes in document:');
      state.doc.descendants((node, pos) => {
        if (node.type.name === 'image') {
          console.log('🔄 Found image at pos:', pos, 'attrs:', node.attrs);
        }
      });
    }
    
    console.log('🔄 === END ALIGNMENT DEBUG ===');
  };

  if (!editor) return null;

  return (
    <div className="rich-text-editor">
      <div className="editor-toolbar">
        {/* Text Formatting */}
        <div className="toolbar-group">
          <button 
            type="button" 
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'active' : ''}
            title="Bold"
            disabled={isSourceMode}
          >
            <strong>B</strong>
          </button>
          <button 
            type="button" 
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'active' : ''}
            title="Italic"
            disabled={isSourceMode}
          >
            <em>I</em>
          </button>
          <button 
            type="button" 
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'active' : ''}
            title="Strikethrough"
            disabled={isSourceMode}
          >
            <s>S</s>
          </button>
        </div>

        {/* Headings */}
        <div className="toolbar-group">
          <button 
            type="button" 
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'active' : ''}
            title="Heading 1"
            disabled={isSourceMode}
          >
            H1
          </button>
          <button 
            type="button" 
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}
            title="Heading 2"
            disabled={isSourceMode}
          >
            H2
          </button>
          <button 
            type="button" 
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive('heading', { level: 3 }) ? 'active' : ''}
            title="Heading 3"
            disabled={isSourceMode}
          >
            H3
          </button>
        </div>

        {/* Lists */}
        <div className="toolbar-group">
          <button 
            type="button" 
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'active' : ''}
            title="Bullet List"
            disabled={isSourceMode}
          >
            • List
          </button>
          <button 
            type="button" 
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'active' : ''}
            title="Numbered List"
            disabled={isSourceMode}
          >
            1. List
          </button>
        </div>

        {/* Image Controls */}
        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => setShowImageModal(true)}
            title="Insert Image"
            className="image-insert-btn"
            disabled={isSourceMode}
          >
            🖼 Image
          </button>
          
          {/* Image Alignment Buttons */}
          <button
            type="button"
            onClick={() => updateSelectedImageAlignment('left')}
            title="Align Left"
            className="alignment-btn"
            disabled={isSourceMode || !editor?.isActive('image')}
          >
            ⬅️
          </button>
          <button
            type="button"
            onClick={() => updateSelectedImageAlignment('center')}
            title="Align Center"
            className="alignment-btn"
            disabled={isSourceMode || !editor?.isActive('image')}
          >
            ⏸️
          </button>
          <button
            type="button"
            onClick={() => updateSelectedImageAlignment('right')}
            title="Align Right"
            className="alignment-btn"
            disabled={isSourceMode || !editor?.isActive('image')}
          >
            ➡️
          </button>
        </div>

        {/* Table Controls */}
        <div className="toolbar-group table-dropdown-container">
          <button
            type="button"
            onClick={() => setShowTableModal(true)}
            title="Insert Table"
            className="table-insert-btn"
            disabled={isSourceMode}
          >
            ⊞ Table
          </button>
          
          <div className="table-dropdown-wrapper">
            <button
              type="button"
              onClick={() => setShowTableDropdown(!showTableDropdown)}
              title="Table Options"
              className={`table-dropdown-btn ${editor.isActive('table') ? 'active' : ''}`}
              disabled={!editor.isActive('table')}
            >
              ▼
            </button>
            
            {showTableDropdown && editor.isActive('table') && (
              <div className="table-dropdown">
                <button onClick={() => {
                  editor.chain().focus().addRowBefore().run();
                  setShowTableDropdown(false);
                }}>
                  Insert Row Above
                </button>
                <button onClick={() => {
                  editor.chain().focus().addRowAfter().run();
                  setShowTableDropdown(false);
                }}>
                  Insert Row Below
                </button>
                <button onClick={() => {
                  editor.chain().focus().addColumnBefore().run();
                  setShowTableDropdown(false);
                }}>
                  Insert Column Before
                </button>
                <button onClick={() => {
                  editor.chain().focus().addColumnAfter().run();
                  setShowTableDropdown(false);
                }}>
                  Insert Column After
                </button>
                <div className="dropdown-separator"></div>
                <button onClick={() => {
                  editor.chain().focus().deleteRow().run();
                  setShowTableDropdown(false);
                }}>
                  Delete Row
                </button>
                <button onClick={() => {
                  editor.chain().focus().deleteColumn().run();
                  setShowTableDropdown(false);
                }}>
                  Delete Column
                </button>
                <button onClick={() => {
                  editor.chain().focus().deleteTable().run();
                  setShowTableDropdown(false);
                }}>
                  Delete Table
                </button>
                <div className="dropdown-separator"></div>
                <button onClick={() => {
                  editor.chain().focus().toggleHeaderRow().run();
                  setShowTableDropdown(false);
                }}>
                  Toggle Header Row
                </button>
                <button onClick={() => {
                  editor.chain().focus().toggleHeaderColumn().run();
                  setShowTableDropdown(false);
                }}>
                  Toggle Header Column
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Other Controls */}
        <div className="toolbar-group">
          <button 
            type="button" 
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'active' : ''}
            title="Blockquote"
            disabled={isSourceMode}
          >
            Quote
          </button>
          <button 
            type="button" 
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Rule"
            disabled={isSourceMode}
          >
            ---
          </button>
        </div>

        {/* Undo/Redo */}
        <div className="toolbar-group">
          <button 
            type="button" 
            onClick={() => editor.chain().focus().undo().run()}
            title="Undo"
            disabled={!editor.can().undo()}
          >
            ↶ Undo
          </button>
          <button 
            type="button" 
            onClick={() => editor.chain().focus().redo().run()}
            title="Redo"
            disabled={!editor.can().redo()}
          >
            ↷ Redo
          </button>
        </div>

        {/* HTML Source Toggle */}
        <div className="toolbar-group">
          <button
            type="button"
            onClick={toggleSourceMode}
            className="toolbar-btn"
            title={isSourceMode ? 'Visual Mode' : 'HTML Source'}
          >
            {isSourceMode ? '📝 Visual' : '</> HTML'}
          </button>
        </div>
      </div>

      {isSourceMode ? (
        <textarea
          className="source-editor"
          value={sourceValue}
          onChange={handleSourceChange}
          placeholder={placeholder}
        />
      ) : (
        <EditorContent editor={editor} />
      )}

      {/* Table Creation Modal */}
      {showTableModal && (
        <div className="table-modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) setShowTableModal(false);
        }}>
          <div className="table-modal">
            <div className="modal-header">
              <h3>Insert Table</h3>
              <button 
                className="modal-close"
                onClick={() => setShowTableModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-content">
              <div className="table-size-controls">
                <div className="size-control">
                  <label>Rows:</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={tableRows}
                    onChange={(e) => setTableRows(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </div>
                <div className="size-control">
                  <label>Columns:</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={tableCols}
                    onChange={(e) => setTableCols(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </div>
              </div>
              
              <div className="table-preview">
                <div className="preview-grid">
                  {Array.from({ length: tableRows }, (_, row) => (
                    <div key={row} className="preview-row">
                      {Array.from({ length: tableCols }, (_, col) => (
                        <div 
                          key={col} 
                          className={`preview-cell ${row === 0 ? 'header' : ''}`}
                        >
                          {row === 0 ? `H${col + 1}` : `R${row}C${col + 1}`}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <p className="preview-text">
                  Preview: {tableRows} rows × {tableCols} columns
                </p>
              </div>
            </div>
            
            <div className="modal-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowTableModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="insert-btn"
                onClick={insertTable}
              >
                Insert Table
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Insertion Modal */}
      {showImageModal && (
        <div className="table-modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) setShowImageModal(false);
        }}>
          <div className="table-modal">
            <div className="modal-header">
              <h3>Insert Image</h3>
              <button 
                className="modal-close"
                onClick={() => setShowImageModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-content">
              <div className="image-controls">
                {/* Upload Method Selection */}
                <div className="image-control">
                  <label>Choose Method:</label>
                  <div className="method-tabs">
                    <button
                      type="button"
                      className={`method-tab ${uploadMethod === 'upload' ? 'active' : ''}`}
                      onClick={() => setUploadMethod('upload')}
                    >
                      📤 Upload File
                    </button>
                    <button
                      type="button"
                      className={`method-tab ${uploadMethod === 'url' ? 'active' : ''}`}
                      onClick={() => setUploadMethod('url')}
                    >
                      🔗 From URL
                    </button>
                  </div>
                </div>

                {/* File Upload Section */}
                {uploadMethod === 'upload' && (
                  <div className="image-control">
                    <label>Select Image:</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="file-input"
                    />
                    {selectedFile && (
                      <div className="file-info">
                        <span className="file-name">📁 {selectedFile.name}</span>
                        <span className="file-size">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                      </div>
                    )}
                  </div>
                )}

                {/* URL Input Section */}
                {uploadMethod === 'url' && (
                  <div className="image-control">
                    <label>Image URL:</label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                )}

                {/* Common Fields */}
                <div className="image-control">
                  <label>Alt Text:</label>
                  <input
                    type="text"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    placeholder="Description of the image"
                  />
                </div>
                <div className="image-control">
                  <label>Alignment:</label>
                  <select
                    value={imageAlignment}
                    onChange={(e) => setImageAlignment(e.target.value)}
                  >
                    <option value="none">None</option>
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
              
              {/* Upload Progress */}
              {isUploading && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p>Uploading... {Math.round(uploadProgress)}%</p>
                </div>
              )}

              {/* Image Preview */}
              {((uploadMethod === 'url' && imageUrl) || (uploadMethod === 'upload' && selectedFile)) && (
                <div className="image-preview">
                  <p>Preview:</p>
                  <div className={`preview-image-container align-${imageAlignment}`}>
                    <img 
                      src={uploadMethod === 'url' ? imageUrl : URL.createObjectURL(selectedFile)} 
                      alt={imageAlt || 'Preview'} 
                      style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'contain' }}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="modal-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowImageModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="insert-btn"
                onClick={insertImage}
                disabled={isUploading || (uploadMethod === 'url' && !imageUrl) || (uploadMethod === 'upload' && !selectedFile)}
              >
                {isUploading ? 'Uploading...' : 'Insert Image'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}