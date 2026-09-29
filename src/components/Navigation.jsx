import React from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS, SPACING } from '../styles/colors';
import Button from './Button';

const Navigation = ({ onLoginClick }) => {
  const navigate = useNavigate();

  const navStyle = {
    backgroundColor: COLORS.surface,
    borderBottom: `1px solid ${COLORS.border}`,
    padding: `${SPACING.lg} ${SPACING.xl}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  };

  const logoContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.md,
    cursor: 'pointer',
  };

  const logoIconStyle = {
    width: '40px',
    height: '40px',
    backgroundColor: COLORS.primary,
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: COLORS.surface,
    fontWeight: 'bold',
    fontSize: '1.5rem',
    boxShadow: '0 4px 12px rgba(43, 108, 176, 0.3)',
  };

  const logoTextStyle = {
    fontSize: '1.35rem',
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: '-0.5px',
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: '1400px',
    margin: '0 auto',
  };

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        <div style={logoContainerStyle} onClick={() => navigate('/')}>
          <div style={logoIconStyle}>A</div>
          <div style={logoTextStyle}>Aether Hospital</div>
        </div>
        <Button variant="primary" size="md" onClick={onLoginClick}>
          Login
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;
