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
    marginBottom: SPACING.xl,
    textAlign: 'center',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: SPACING.xl,
    marginTop: SPACING.xl,
  };

  const services = [
    { name: 'General Consultation', icon: '📋' },
    { name: 'Emergency Care', icon: '🚑' },
    { name: 'Surgery', icon: '🔬' },
    { name: 'Pediatrics', icon: '👶' },
    { name: 'Cardiology', icon: '❤️' },
    { name: 'Orthopedics', icon: '🦴' },
  ];

  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>Our Services</h2>
        <div style={gridStyle}>
          {services.map((service, index) => (
            <Card key={index}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: SPACING.md }}>
                  {service.icon}
                </div>
                <h3 style={{ 
                  color: COLORS.textPrimary,
                  fontWeight: '600',
                }}>
                  {service.name}
                </h3>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
