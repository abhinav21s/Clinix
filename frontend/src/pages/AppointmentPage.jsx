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
    alignItems: 'center',
    justifyContent: 'center',
  };

  const contentStyle = {
    textAlign: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.xxxl,
    borderRadius: '12px',
    border: `1px solid ${COLORS.border}`,
  };

  const headingStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.lg,
  };

  const descStyle = {
    fontSize: '1.1rem',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h1 style={headingStyle}>Appointment Booking</h1>
        <p style={descStyle}>
          Appointment booking features coming soon.
        </p>
        <Button variant="primary" size="lg" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default AppointmentPage;
