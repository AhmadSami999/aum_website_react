// /src/components/OdooExplorer.js - Comprehensive Odoo data explorer
import React, { useState, useEffect } from 'react';
import { FaSearch, FaDatabase, FaTable, FaEye, FaDownload, FaSpinner, FaChevronDown, FaChevronRight } from 'react-icons/fa';

const FIREBASE_FUNCTION_URL = 'https://us-central1-american-university-of-malta.cloudfunctions.net/odooProxy';

function OdooExplorer() {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [modelFields, setModelFields] = useState({});
  const [modelData, setModelData] = useState({});
  const [loading, setLoading] = useState({});
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedModels, setExpandedModels] = useState(new Set());

  // Call Firebase function
  const callFunction = async (action, additionalData = {}) => {
    try {
      const response = await fetch(FIREBASE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          ...additionalData
        })
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Function call error:', error);
      throw error;
    }
  };

  // Get all available models
  const getModels = async () => {
    setLoading(prev => ({ ...prev, models: true }));
    setError(null);
    
    try {
      const result = await callFunction('get_models');
      
      if (result.success) {
        setModels(result.models || []);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(prev => ({ ...prev, models: false }));
    }
  };

  // Get fields for a specific model
  const getModelFields = async (modelName) => {
    setLoading(prev => ({ ...prev, [`fields_${modelName}`]: true }));
    
    try {
      const result = await callFunction('get_model_fields', { model: modelName });
      
      if (result.success) {
        setModelFields(prev => ({
          ...prev,
          [modelName]: result.fields
        }));
      }
    } catch (err) {
      console.error(`Error getting fields for ${modelName}:`, err);
    } finally {
      setLoading(prev => ({ ...prev, [`fields_${modelName}`]: false }));
    }
  };

  // Get sample data for a model
  const getModelData = async (modelName, limit = 5) => {
    setLoading(prev => ({ ...prev, [`data_${modelName}`]: true }));
    
    try {
      const result = await callFunction('get_model_data', { 
        model: modelName,
        limit
      });
      
      if (result.success) {
        setModelData(prev => ({
          ...prev,
          [modelName]: result.records
        }));
      }
    } catch (err) {
      console.error(`Error getting data for ${modelName}:`, err);
    } finally {
      setLoading(prev => ({ ...prev, [`data_${modelName}`]: false }));
    }
  };

  // Toggle model expansion
  const toggleModel = (modelName) => {
    const newExpanded = new Set(expandedModels);
    if (newExpanded.has(modelName)) {
      newExpanded.delete(modelName);
    } else {
      newExpanded.add(modelName);
      // Auto-load fields and data when expanding
      if (!modelFields[modelName]) {
        getModelFields(modelName);
      }
      if (!modelData[modelName]) {
        getModelData(modelName);
      }
    }
    setExpandedModels(newExpanded);
  };

  // Filter models based on search
  const filteredModels = models.filter(model => 
    model.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Export data as JSON
  const exportData = () => {
    const data = {
      models,
      modelFields,
      modelData,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'odoo-structure.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    getModels();
  }, []);

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1400px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '30px',
        borderRadius: '15px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5em' }}>
          <FaDatabase style={{ marginRight: '15px' }} />
          Odoo Data Explorer
        </h1>
        <p style={{ margin: 0, fontSize: '1.1em', opacity: 0.9 }}>
          Explore all available models, fields, and data in your Odoo instance
        </p>
      </div>

      {/* Controls */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        gap: '15px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '300px' }}>
          <FaSearch style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#999'
          }} />
          <input
            type="text"
            placeholder="Search models (e.g., res.partner, project, sale...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 40px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        <button
          onClick={getModels}
          disabled={loading.models}
          style={{
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '8px',
            cursor: loading.models ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '16px'
          }}
        >
          {loading.models ? <FaSpinner className="spinner" /> : <FaDatabase />}
          Refresh Models
        </button>

        <button
          onClick={exportData}
          style={{
            background: '#2196F3',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '16px'
          }}
        >
          <FaDownload />
          Export Data
        </button>
      </div>

      {error && (
        <div style={{
          background: '#ffebee',
          border: '1px solid #f44336',
          color: '#c62828',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Summary Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#4CAF50' }}>
            {models.length}
          </div>
          <div style={{ color: '#666' }}>Total Models</div>
        </div>
        
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#2196F3' }}>
            {filteredModels.length}
          </div>
          <div style={{ color: '#666' }}>Filtered Results</div>
        </div>
        
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#FF9800' }}>
            {Object.keys(modelFields).length}
          </div>
          <div style={{ color: '#666' }}>Models Explored</div>
        </div>
      </div>

      {/* Models List */}
      <div style={{
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#f5f5f5',
          padding: '15px 20px',
          borderBottom: '1px solid #ddd',
          fontWeight: 'bold',
          fontSize: '18px'
        }}>
          <FaTable style={{ marginRight: '10px' }} />
          Available Models ({filteredModels.length})
        </div>

        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {filteredModels.map((model, index) => (
            <div key={model.model || index} style={{
              borderBottom: '1px solid #f0f0f0'
            }}>
              {/* Model Header */}
              <div
                style={{
                  padding: '15px 20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: expandedModels.has(model.model) ? '#f8f9ff' : 'white',
                  transition: 'background-color 0.2s ease'
                }}
                onClick={() => toggleModel(model.model)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {expandedModels.has(model.model) ? <FaChevronDown /> : <FaChevronRight />}
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#333' }}>
                      {model.model}
                    </div>
                    <div style={{ color: '#666', fontSize: '14px' }}>
                      {model.name}
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {modelData[model.model] && (
                    <span style={{
                      background: '#e8f5e8',
                      color: '#2e7d32',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}>
                      {modelData[model.model].length} records
                    </span>
                  )}
                  
                  {loading[`fields_${model.model}`] && <FaSpinner className="spinner" />}
                  {loading[`data_${model.model}`] && <FaSpinner className="spinner" />}
                </div>
              </div>

              {/* Expanded Content */}
              {expandedModels.has(model.model) && (
                <div style={{ padding: '0 20px 20px 60px' }}>
                  
                  {/* Fields Section */}
                  {modelFields[model.model] && (
                    <div style={{ marginBottom: '20px' }}>
                      <h4 style={{ color: '#333', marginBottom: '10px' }}>
                        📋 Fields ({Object.keys(modelFields[model.model]).length})
                      </h4>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '10px',
                        maxHeight: '200px',
                        overflowY: 'auto'
                      }}>
                        {Object.entries(modelFields[model.model]).map(([fieldName, fieldInfo]) => (
                          <div key={fieldName} style={{
                            background: '#f9f9f9',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid #e0e0e0'
                          }}>
                            <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#333' }}>
                              {fieldName}
                            </div>
                            <div style={{ fontSize: '11px', color: '#666' }}>
                              {fieldInfo.type} {fieldInfo.required ? '(required)' : ''}
                            </div>
                            {fieldInfo.string && (
                              <div style={{ fontSize: '11px', color: '#888' }}>
                                {fieldInfo.string}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sample Data Section */}
                  {modelData[model.model] && (
                    <div>
                      <h4 style={{ color: '#333', marginBottom: '10px' }}>
                        📊 Sample Data ({modelData[model.model].length} records)
                      </h4>
                      <div style={{
                        background: '#f5f5f5',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        maxHeight: '300px',
                        overflow: 'auto'
                      }}>
                        <pre style={{
                          margin: 0,
                          padding: '15px',
                          fontSize: '12px',
                          lineHeight: '1.4'
                        }}>
                          {JSON.stringify(modelData[model.model], null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        getModelFields(model.model);
                      }}
                      disabled={loading[`fields_${model.model}`]}
                      style={{
                        background: '#2196F3',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      {loading[`fields_${model.model}`] ? 'Loading...' : 'Refresh Fields'}
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        getModelData(model.model, 10);
                      }}
                      disabled={loading[`data_${model.model}`]}
                      style={{
                        background: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      {loading[`data_${model.model}`] ? 'Loading...' : 'Get Sample Data'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .spinner {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default OdooExplorer;