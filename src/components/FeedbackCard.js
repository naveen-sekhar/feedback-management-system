import React, { useState, useEffect } from 'react';

const FeedbackCard = ({ feedback, onEdit, onDelete, showUser = false, isReadOnly = false }) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const createdAt = new Date(feedback.createdAt);
      const deadline = new Date(createdAt.getTime() + 15 * 60 * 1000); // 15 minutes
      const now = new Date();
      const diff = deadline - now;

      if (diff <= 0) {
        setTimeRemaining('Edit window expired');
        setIsEditable(false);
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeRemaining(`${minutes}m ${seconds}s remaining to edit`);
        setIsEditable(true);
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [feedback.createdAt]);

  const getCategoryClass = (category) => {
    const classes = {
      bug: 'category-bug',
      feature: 'category-feature',
      improvement: 'category-improvement',
      general: 'category-general'
    };
    return classes[category] || 'category-general';
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">{feedback.title}</h3>
          <span className={`card-category ${getCategoryClass(feedback.category)}`}>
            {feedback.category}
          </span>
        </div>
        <div className="card-rating">
          {renderStars(feedback.rating)}
        </div>
      </div>
      
      <p className="card-description">{feedback.description}</p>
      
      <div className="card-meta">
        <div>
          {showUser && feedback.user && (
            <span className="user-badge">
              By: {feedback.user.name} ({feedback.user.email})
            </span>
          )}
          <span style={{ display: 'block', marginTop: '5px' }}>
            Submitted: {formatDate(feedback.createdAt)}
          </span>
        </div>
        
        {!isReadOnly && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span className={`edit-timer ${isEditable ? 'active' : 'expired'}`}>
              {timeRemaining}
            </span>
            <div className="card-actions">
              {isEditable && (
                <>
                  <button 
                    className="btn btn-warning btn-sm"
                    onClick={() => onEdit(feedback)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(feedback._id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackCard;
