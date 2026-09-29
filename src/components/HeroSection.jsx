import React from 'react';
import { COLORS, SPACING } from '../styles/colors';
import Button from './Button';

const HeroSection = ({ onBookAppointment }) => {
  const heroStyle = {
    background: 'linear-gradient(135deg, #F7FAFC 0%, #E6F0FF 50%, #F0F8FF 100%)',
    padding: `${SPACING.xxxl} ${SPACING.xl}`,
    minHeight: '600px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: SPACING.xxxl,
    alignItems: 'center',
    width: '100%',
  };

  const contentStyle = {
    textAlign: 'left',
  };

  const titleStyle = {
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
    lineHeight: '1.2',
  };

  const taglineStyle = {
    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    lineHeight: '1.8',
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: SPACING.lg,
    flexWrap: 'wrap',
  };

  const imageStyle = {
    width: '100%',
    maxWidth: '500px',
    height: 'auto',
    borderRadius: '16px',
    boxShadow: '0 15px 40px rgba(43, 108, 176, 0.2)',
    objectFit: 'cover',
  };

  return (
    <section style={heroStyle}>
      <div style={containerStyle}>
        <div style={contentStyle}>
          <h1 style={titleStyle}>Your Health, Our Priority</h1>
          <p style={taglineStyle}>
            Experience world-class healthcare with compassionate professionals dedicated to your wellness journey. Trust Aether Hospital for comprehensive medical care.
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
        <div>
          <img 
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=500&fit=crop" 
            alt="Healthcare Professional" 
            style={imageStyle}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
