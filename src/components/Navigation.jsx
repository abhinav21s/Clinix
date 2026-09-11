import React from 'react';
import { COLORS, SPACING } from '../styles/colors';
import Button from './Button';

const Navigation = () => {
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

  const logoStyle = {
    fontSize: '1.5rem',
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
        <div style={logoStyle}>⚕️ Aether Hospital</div>
        <Button variant="primary" size="md">
          Login
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;
