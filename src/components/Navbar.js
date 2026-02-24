import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        📝 Feedback System
      </Link>
      <div className="navbar-nav">
        {isAuthenticated() ? (
          <>
            <span className="nav-user-info">
              Welcome, {user?.name} ({user?.role})
            </span>
            {isAdmin() ? (
              <Link to="/admin/dashboard">Dashboard</Link>
            ) : (
              <>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/feedback/new">Submit Feedback</Link>
              </>
            )}
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
