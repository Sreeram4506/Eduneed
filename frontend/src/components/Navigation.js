import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navigation() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <nav style={{ 
        backgroundColor: '#007bff', // BLUE
        padding: '15px 20px',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0 }}>Student File Sharing</h1>
        <div>
          <Link to="/login" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>
            Login
          </Link>
          <Link to="/signup" style={{ color: 'white', textDecoration: 'none' }}>
            Sign Up
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav style={{ 
      backgroundColor: '#007bff', // BLUE
      padding: '15px 20px',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h1 style={{ margin: 0 }}>Student File Sharing</h1>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/browse" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>
          Browse Files
        </Link>
        <Link to="/upload" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>
          Upload File
        </Link>
        {user?.role === 'admin' && (
          <Link to="/admin" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>
            Admin Panel
          </Link>
        )}
        <span style={{ marginRight: '20px' }}>
          Welcome, {user?.email}
        </span>
        <button 
          onClick={handleLogout}
          style={{ 
            backgroundColor: 'transparent', 
            color: 'white', // White 
            border: '1px solid white',
            padding: '5px 15px',// white padding should be done so that it will be good fir the watching 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navigation; 