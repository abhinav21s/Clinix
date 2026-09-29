import React from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS, SPACING } from '../styles/colors';
import Button from '../components/Button';

const AppointmentBooking = () => {
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

  const titleStyle = {
    fontSize: '3rem',
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xl,
  };

  const textStyle = {
    fontSize: '1rem',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <div style={titleStyle}>Appointment</div>
        <p style={textStyle}>
          Full appointment booking system coming soon in Phase 3
        </p>
        <Button variant="primary" size="lg" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default AppointmentBooking;
