import React from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS, SPACING } from '../styles/colors';
import Button from '../components/Button';

const AppointmentPage = () => {
  const navigate = useNavigate();

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  };

  const contentStyle = {
    backgroundColor: COLORS.surface,
    padding: SPACING.xxxl,
    borderRadius: '12px',
    border: `1px solid ${COLORS.border}`,
    textAlign: 'center',
    maxWidth: '600px',
  };

  const titleStyle = {
    fontSize: '3rem',
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.xl,
  };

  const descStyle = {
    fontSize: '1rem',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    lineHeight: '1.6',
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h1 style={titleStyle}>Appointment</h1>
        <p style={descStyle}>
          Complete appointment booking system will be implemented in Phase 3.
        </p>
        <Button variant="primary" size="lg" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default AppointmentPage;
