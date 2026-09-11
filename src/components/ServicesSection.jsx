import React from 'react';
import { COLORS, SPACING } from '../styles/colors';
import Card from './Card';

const ServicesSection = () => {
  const sectionStyle = {
    padding: `${SPACING.xxxl} ${SPACING.xl}`,
    backgroundColor: COLORS.background,
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: SPACING.xl,
    marginTop: SPACING.xl,
  };

  const services = [
    { 
      icon: '📋',
      name: 'General Consultation', 
      description: 'Expert medical consultations with our experienced healthcare professionals'
    },
    { 
      icon: '🚑',
      name: 'Emergency Care', 
      description: '24/7 emergency medical services for immediate care'
    },
    { 
      icon: '⚕️',
      name: 'Surgery', 
      description: 'State-of-the-art surgical procedures with expert surgeons'
    },
    { 
      icon: '👶',
      name: 'Pediatrics', 
      description: 'Specialized care and treatment for children and infants'
    },
    { 
      icon: '❤️',
      name: 'Cardiology', 
      description: 'Heart and cardiovascular disease treatment and prevention'
    },
    { 
      icon: '🦴',
      name: 'Orthopedics', 
      description: 'Bone, joint and muscle disorder diagnosis and treatment'
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

  const serviceNameStyle = {
    color: COLORS.textPrimary,
    fontWeight: '600',
    fontSize: '1.1rem',
    marginBottom: SPACING.sm,
  };

  const descriptionStyle = {
    color: COLORS.textSecondary,
    fontSize: '0.9rem',
    lineHeight: '1.5',
  };

  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>Our Services</h2>
        <p style={subtitleStyle}>Comprehensive healthcare services designed for your wellbeing</p>
        <div style={gridStyle}>
          {services.map((service, index) => (
            <Card key={index}>
              <div style={{ textAlign: 'center' }}>
                <div style={iconContainerStyle}>
                  {service.icon}
                </div>
                <h3 style={serviceNameStyle}>
                  {service.name}
                </h3>
                <p style={descriptionStyle}>
                  {service.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
