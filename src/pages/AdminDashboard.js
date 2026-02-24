import React, { useState, useEffect, useCallback } from 'react';
import { feedbackAPI } from '../services/api';
import FeedbackCard from '../components/FeedbackCard';
import Loading from '../components/Loading';

const AdminDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });

  const fetchAllFeedbacks = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await feedbackAPI.getAllFeedback(page, 10);
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
    fetchAllFeedbacks();
  }, [fetchAllFeedbacks]);

  const handlePageChange = (page) => {
    fetchAllFeedbacks(page);
  };

  if (loading && feedbacks.length === 0) {
    return <Loading />;
  }

  return (
    <div className="dashboard container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard - All Feedback</h1>
        <span className="user-badge" style={{ fontSize: '1rem', padding: '10px 20px' }}>
          Total: {pagination.total} submissions
        </span>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="alert alert-warning" style={{ marginBottom: '20px' }}>
        ℹ️ Admin View: Read-only access to all user feedback submissions.
      </div>

      {feedbacks.length === 0 ? (
        <div className="empty-state">
          <h3>No feedback submissions yet</h3>
          <p>Users haven't submitted any feedback.</p>
        </div>
      ) : (
        <>
          {feedbacks.map((feedback) => (
            <FeedbackCard
              key={feedback._id}
              feedback={feedback}
              showUser={true}
              isReadOnly={true}
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

export default AdminDashboard;
