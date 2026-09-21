import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SPACING } from '../styles/colors';

const Navigation = () => {
  const navigate = useNavigate();

  const navStyle = {
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #F0F4F8',
    padding: `${SPACING.md} ${SPACING.xl}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  };

  const logoStyle = {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#0066FF',
    cursor: 'pointer',
    letterSpacing: '-0.5px',
    fontFamily: '"Segoe UI", Roboto, sans-serif',
  };

  const buttonStyle = {
    backgroundColor: '#0066FF',
    color: 'white',
    border: 'none',
    padding: `${SPACING.sm} ${SPACING.lg}`,
    fontSize: '0.95rem',
    fontWeight: '600',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  return (
    <nav style={navStyle}>
      <div style={logoStyle} onClick={() => navigate('/')}>
        Aether
      </div>
      <button
        style={buttonStyle}
        onClick={() => navigate('/login')}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#0052CC';
          e.target.style.boxShadow = '0 4px 12px rgba(0, 102, 255, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#0066FF';
          e.target.style.boxShadow = 'none';
        }}
      >
        Sign In
      </button>
    </nav>
  );
};

export default Navigation;
