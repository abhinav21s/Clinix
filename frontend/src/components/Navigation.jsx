import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SPACING } from '../styles/colors';

const Navigation = () => {
  const navigate = useNavigate();

  const navStyle = {
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E1E8ED',
    padding: `${SPACING.lg} ${SPACING.xl}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  };

  const logoStyle = {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#0066FF',
    cursor: 'pointer',
    letterSpacing: '-0.5px',
  };

  const buttonStyle = {
    backgroundColor: '#0066FF',
    color: 'white',
    border: 'none',
    padding: `${SPACING.md} ${SPACING.lg}`,
    fontSize: '0.95rem',
    fontWeight: '600',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  return (
    <nav style={navStyle}>
      <div style={logoStyle} onClick={() => navigate('/')}>
        Aether Hospital
      </div>
      <button
        style={buttonStyle}
        onClick={() => navigate('/login')}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#0052CC'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#0066FF'}
      >
        Login
      </button>
    </nav>
  );
};

export default Navigation;
