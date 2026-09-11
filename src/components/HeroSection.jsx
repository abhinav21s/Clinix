import React from 'react';
import { COLORS, SPACING } from '../styles/colors';
import Button from './Button';

const HeroSection = ({ onBookAppointment }) => {
  const heroStyle = {
    backgroundColor: COLORS.background,
    padding: `${SPACING.xxxl} ${SPACING.xl}`,
    textAlign: 'center',
    minHeight: '500px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
  };

  const titleStyle = {
    fontSize: '3.5rem',
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
    lineHeight: '1.2',
  };

  const taglineStyle = {
    fontSize: '1.25rem',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    lineHeight: '1.6',
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: SPACING.lg,
    justifyContent: 'center',
    flexWrap: 'wrap',
  };

  return (
    <section style={heroStyle}>
      <div style={containerStyle}>
        <h1 style={titleStyle}>Welcome to Aether Hospital</h1>
        <p style={taglineStyle}>
          Excellence in Healthcare. Compassion in Every Care. Your wellness is our mission.
        </p>
        <div style={buttonContainerStyle}>
          <Button variant="primary" size="lg" onClick={onBookAppointment}>
            Book Appointment
          </Button>
          <Button variant="secondary" size="lg">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
