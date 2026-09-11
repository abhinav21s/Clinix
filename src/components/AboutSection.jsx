import React from 'react';
import { COLORS, SPACING } from '../styles/colors';
import Card from './Card';

const AboutSection = () => {
  const sectionStyle = {
    padding: `${SPACING.xxxl} ${SPACING.xl}`,
    backgroundColor: COLORS.surface,
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: SPACING.xl,
    marginTop: SPACING.xl,
  };

  const iconContainerStyle = {
    width: '70px',
    height: '70px',
    backgroundColor: COLORS.primary,
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    marginBottom: SPACING.md,
    fontSize: '2rem',
  };

  const reasons = [
    {
      symbol: '🏢',
      title: 'Modern Facilities',
      description: 'State-of-the-art medical equipment and technology.',
    },
    {
      symbol: '👨',
      title: 'Expert Doctors',
      description: 'Highly qualified and experienced healthcare professionals.',
    },
    {
      symbol: '✓',
      title: 'Patient Care',
      description: 'Compassionate care with personalized treatment plans.',
    },
    {
      symbol: '⏱️',
      title: '24/7 Service',
      description: 'Round-the-clock emergency and medical services.',
    },
  ];

  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>Why Choose Aether Hospital?</h2>
        <div style={gridStyle}>
          {reasons.map((reason, index) => (
            <Card key={index}>
              <div style={{ textAlign: 'center' }}>
                <div style={iconContainerStyle}>
                  {reason.symbol}
                </div>
                <h3 style={{ 
                  color: COLORS.textPrimary, 
                  marginBottom: SPACING.md,
                  fontWeight: '600',
                }}>
                  {reason.title}
                </h3>
                <p style={{ color: COLORS.textSecondary, lineHeight: '1.6' }}>
                  {reason.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
