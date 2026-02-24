import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { feedbackAPI } from '../services/api';
import FeedbackForm from '../components/FeedbackForm';

const NewFeedback = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await feedbackAPI.create(formData);
      setSuccess('Feedback submitted successfully!');
      setError('');
      
      // Redirect to dashboard after short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback');
      throw err;
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="container feedback-form-container">
      <div className="card">
        <h2 style={{ marginBottom: '30px', color: '#333' }}>Submit New Feedback</h2>
        
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="alert alert-warning" style={{ marginBottom: '20px' }}>
          ⚠️ Note: You can only edit feedback within 15 minutes of submission.
        </div>

        <FeedbackForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default NewFeedback;
