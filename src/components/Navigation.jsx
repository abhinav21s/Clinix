import React from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS, SPACING } from '../styles/colors';
import Button from './Button';

const Navigation = ({ onLoginClick }) => {
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
  };

  const logoContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.md,
  };

  const logoIconStyle = {
    width: '32px',
    height: '32px',
    backgroundColor: COLORS.primary,
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: COLORS.surface,
    fontWeight: 'bold',
    fontSize: '1.2rem',
  };

  const logoTextStyle = {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: COLORS.primary,
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
        <div style={logoContainerStyle}>
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
