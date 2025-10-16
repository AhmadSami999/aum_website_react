import React, { useState, useEffect } from 'react';
import { fetchQATopics } from '../firebase/firestore';
import './QualityAssurance.css';

function QualityAssurance({ isAdmin = false }) {
  const [qaTopics, setQaTopics] = useState([]);
  const [activeTopicId, setActiveTopicId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQAContent = async () => {
      try {
        const topics = await fetchQATopics();
        setQaTopics(topics);
        setActiveTopicId(topics[0]?.id || null);
        setLoading(false);
      } catch (error) {
        console.error('Error loading QA content:', error);
        setLoading(false);
      }
    };
    
    loadQAContent();
  }, []);

  const getActiveContent = () => {
    if (!qaTopics.length) {
      return '<p>No content available. Please add some topics in the admin panel.</p>';
    }

    for (const topic of qaTopics) {
      if (topic.id === activeTopicId) {
        return topic.content;
      }
      const subTopic = topic.children?.find(child => child.id === activeTopicId);
      if (subTopic) {
        return subTopic.content;
      }
    }
    return '<p>Select a topic to view its content.</p>';
  };

  const getActiveTitle = () => {
    if (!qaTopics.length) {
      return 'Quality Assurance';
    }

    for (const topic of qaTopics) {
      if (topic.id === activeTopicId) {
        return topic.title;
      }
      const subTopic = topic.children?.find(child => child.id === activeTopicId);
      if (subTopic) {
        return subTopic.title;
      }
    }
    return 'Quality Assurance';
  };

  if (loading) {
    return <div className="qa-loading">Loading Quality Assurance content...</div>;
  }

  return (
    <div className="quality-assurance-page">
      {/* Sidebar Navigation */}
      <div className="qa-sidebar">
        <div className="qa-sidebar-header">
          <h3>Quality Assurance</h3>
          {isAdmin && (
            <button 
              className="admin-edit-btn"
              onClick={() => window.location.href = '/admin/qa-editor'}
            >
              Edit
            </button>
          )}
        </div>
        
        <nav className="qa-navigation">
          {qaTopics.length === 0 ? (
            <div className="qa-nav-empty">
              <p>No topics available yet.</p>
              {isAdmin && (
                <button 
                  className="admin-edit-btn"
                  onClick={() => window.location.href = '/admin/qa-editor'}
                >
                  Add Topics
                </button>
              )}
            </div>
          ) : (
            qaTopics.map(topic => (
              <div key={topic.id} className="qa-nav-section">
                <button
                  className={`qa-nav-item main-topic ${activeTopicId === topic.id ? 'active' : ''}`}
                  onClick={() => setActiveTopicId(topic.id)}
                >
                  {topic.title}
                </button>
                
                {topic.children && topic.children.length > 0 && (
                  <div className="qa-nav-subtopics">
                    {topic.children.map(subTopic => (
                      <button
                        key={subTopic.id}
                        className={`qa-nav-item sub-topic ${activeTopicId === subTopic.id ? 'active' : ''}`}
                        onClick={() => setActiveTopicId(subTopic.id)}
                      >
                        {subTopic.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </nav>
      </div>

      {/* Content Area */}
      <div className="qa-content">
        <div className="qa-content-header">
          <h1>{getActiveTitle()}</h1>
        </div>
        <div 
          className="qa-content-body"
          dangerouslySetInnerHTML={{ __html: getActiveContent() }}
        />
      </div>
    </div>
  );
}

export default QualityAssurance;