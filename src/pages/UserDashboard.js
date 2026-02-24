import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { feedbackAPI } from '../services/api';
import FeedbackCard from '../components/FeedbackCard';
import FeedbackForm from '../components/FeedbackForm';
import Loading from '../components/Loading';

const UserDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });

  const fetchFeedbacks = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await feedbackAPI.getMyFeedback(page, 10);
      setFeedbacks(response.data.data);
      setPagination(response.data.pagination);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch feedbacks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const handleEdit = (feedback) => {
    setEditingFeedback(feedback);
    setSuccess('');
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingFeedback(null);
  };

  const handleUpdateFeedback = async (formData) => {
    try {
      await feedbackAPI.update(editingFeedback._id, formData);
      setSuccess('Feedback updated successfully!');
      setEditingFeedback(null);
      fetchFeedbacks(pagination.current);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update feedback';
      setError(message);
      throw err;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return;
    }

    try {
      await feedbackAPI.delete(id);
      setSuccess('Feedback deleted successfully!');
      fetchFeedbacks(pagination.current);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete feedback');
    }
  };

  const handlePageChange = (page) => {
    fetchFeedbacks(page);
  };

  if (loading && feedbacks.length === 0) {
    return <Loading />;
  }

  return (
    <div className="dashboard container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Feedback</h1>
        <Link to="/feedback/new" className="btn btn-primary">
          + Submit New Feedback
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {editingFeedback && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Feedback</h2>
              <button className="modal-close" onClick={handleCancelEdit}>
                ×
              </button>
            </div>
            <FeedbackForm
              initialData={editingFeedback}
              onSubmit={handleUpdateFeedback}
              onCancel={handleCancelEdit}
              isEditing={true}
            />
          </div>
        </div>
      )}

      {feedbacks.length === 0 ? (
        <div className="empty-state">
          <h3>No feedback submitted yet</h3>
          <p>Start by submitting your first feedback!</p>
          <Link to="/feedback/new" className="btn btn-primary" style={{ marginTop: '20px' }}>
            Submit Feedback
          </Link>
        </div>
      ) : (
        <>
          {feedbacks.map((feedback) => (
            <FeedbackCard
              key={feedback._id}
              feedback={feedback}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}

          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(pagination.current - 1)}
                disabled={pagination.current === 1}
              >
                Previous
              </button>
              <span className="page-info">
                Page {pagination.current} of {pagination.pages} ({pagination.total} total)
              </span>
              <button
                onClick={() => handlePageChange(pagination.current + 1)}
                disabled={pagination.current === pagination.pages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserDashboard;
