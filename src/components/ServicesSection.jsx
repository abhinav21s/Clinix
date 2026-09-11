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

  const iconStyle = {
    width: '60px',
    height: '60px',
    backgroundColor: COLORS.primary,
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: COLORS.surface,
    fontSize: '1.8rem',
    margin: '0 auto',
    marginBottom: SPACING.md,
  };

  const services = [
    { name: 'General Consultation', symbol: '📝' },
    { name: 'Emergency Care', symbol: '⚡' },
    { name: 'Surgery', symbol: '🔧' },
    { name: 'Pediatrics', symbol: '🎒' },
    { name: 'Cardiology', symbol: '💼' },
    { name: 'Orthopedics', symbol: '🦵' },
  ];

  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>Our Services</h2>
        <div style={gridStyle}>
          {services.map((service, index) => (
            <Card key={index}>
              <div style={{ textAlign: 'center' }}>
                <div style={iconStyle}>
                  {service.symbol}
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
