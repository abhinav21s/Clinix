import React from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS, SPACING } from '../styles/colors';
import Button from '../components/Button';

const Unauthorized = () => {
  const navigate = useNavigate();

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  };

  const contentStyle = {
    textAlign: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.xxxl,
    borderRadius: '12px',
    border: `1px solid ${COLORS.border}`,
    maxWidth: '500px',
  };

  const statusStyle = {
    fontSize: '4rem',
    fontWeight: '700',
    color: COLORS.error,
    marginBottom: SPACING.lg,
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  };

  const textStyle = {
    fontSize: '1rem',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <div style={statusStyle}>403</div>
        <h1 style={titleStyle}>Access Denied</h1>
        <p style={textStyle}>
          You do not have permission to access this page. Please log in with the correct role.
        </p>
        <Button variant="primary" size="lg" onClick={() => navigate('/login')}>
          Back to Login
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
