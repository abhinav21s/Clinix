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
    marginBottom: SPACING.lg,
    textAlign: 'center',
  };

  const subtitleStyle = {
    fontSize: '1rem',
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xxxl,
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: SPACING.xl,
    marginTop: SPACING.xl,
  };

  const reasons = [
    {
      icon: '🏥',
      title: 'Modern Facilities',
      description: 'Cutting-edge medical equipment and advanced healthcare technology.',
    },
    {
      icon: '👨‍⚕️',
      title: 'Expert Doctors',
      description: 'Highly qualified specialists with years of medical experience.',
    },
    {
      icon: '💙',
      title: 'Patient Care',
      description: 'Personalized treatment plans focused on your recovery.',
    },
    {
      icon: '⏰',
      title: '24/7 Service',
      description: 'Round-the-clock medical support whenever you need us.',
    },
  ];

  const iconContainerStyle = {
    width: '80px',
    height: '80px',
    borderRadius: '16px',
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryHover} 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    marginBottom: SPACING.lg,
    boxShadow: '0 4px 12px rgba(43, 108, 176, 0.25)',
    fontSize: '2.5rem',
  };

  const titleCardStyle = {
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    fontWeight: '600',
    fontSize: '1.1rem',
  };

  const descriptionStyle = {
    color: COLORS.textSecondary,
    lineHeight: '1.7',
    fontSize: '0.95rem',
  };

  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>Why Choose Aether Hospital?</h2>
        <p style={subtitleStyle}>Excellence in healthcare delivery with a focus on your wellness</p>
        <div style={gridStyle}>
          {reasons.map((reason, index) => (
            <Card key={index}>
              <div style={{ textAlign: 'center' }}>
                <div style={iconContainerStyle}>
                  {reason.icon}
                </div>
                <h3 style={titleCardStyle}>
                  {reason.title}
                </h3>
                <p style={descriptionStyle}>
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
