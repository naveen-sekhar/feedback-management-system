import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="container" style={{ textAlign: 'center', paddingTop: '60px' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px', color: '#333' }}>
        📝 Feedback Collection System
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '40px' }}>
        Share your valuable feedback and help us improve!
      </p>

      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
        {isAuthenticated() ? (
          isAdmin() ? (
            <Link to="/admin/dashboard" className="btn btn-primary" style={{ padding: '15px 30px', fontSize: '1.1rem' }}>
              Go to Admin Dashboard
            </Link>
          ) : (
            <>
              <Link to="/dashboard" className="btn btn-primary" style={{ padding: '15px 30px', fontSize: '1.1rem' }}>
                View My Feedback
              </Link>
              <Link to="/feedback/new" className="btn btn-success" style={{ padding: '15px 30px', fontSize: '1.1rem' }}>
                Submit Feedback
              </Link>
            </>
          )
        ) : (
          <>
            <Link to="/login" className="btn btn-primary" style={{ padding: '15px 30px', fontSize: '1.1rem' }}>
              Login
            </Link>
            <Link to="/register" className="btn btn-success" style={{ padding: '15px 30px', fontSize: '1.1rem' }}>
              Register
            </Link>
          </>
        )}
      </div>

      <div style={{ marginTop: '80px', textAlign: 'left', maxWidth: '800px', margin: '80px auto' }}>
        <h2 style={{ marginBottom: '30px', color: '#333' }}>Features</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          <div className="card">
            <h3 style={{ color: '#667eea', marginBottom: '15px' }}>👤 For Users</h3>
            <ul style={{ paddingLeft: '20px', color: '#666' }}>
              <li>Register and login securely</li>
              <li>Submit detailed feedback</li>
              <li>View your submitted feedback</li>
              <li>Edit feedback within 15 minutes</li>
            </ul>
          </div>

          <div className="card">
            <h3 style={{ color: '#667eea', marginBottom: '15px' }}>👨‍💼 For Admins</h3>
            <ul style={{ paddingLeft: '20px', color: '#666' }}>
              <li>Access admin dashboard</li>
              <li>View all user submissions</li>
              <li>Monitor feedback trends</li>
              <li>Read-only access to feedback</li>
            </ul>
          </div>
        </div>

        <div className="card" style={{ marginTop: '30px' }}>
          <h3 style={{ color: '#e74c3c', marginBottom: '15px' }}>⚠️ Important Rule</h3>
          <p style={{ color: '#666' }}>
            Feedback can only be edited within <strong>15 minutes</strong> of submission. 
            After this time window, the feedback becomes permanent and cannot be modified.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
