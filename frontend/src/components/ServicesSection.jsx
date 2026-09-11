import React from 'react';
import { SPACING } from '../styles/colors';

const ServicesSection = () => {
  const sectionStyle = {
    padding: `${SPACING.xxxl} ${SPACING.xl}`,
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E1E8ED',
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.xxxl,
    color: '#1a1a1a',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: SPACING.xl,
  };

  const serviceCardStyle = {
    backgroundColor: '#FAFBFC',
    padding: SPACING.xl,
    borderRadius: '12px',
    border: '1px solid #E1E8ED',
    transition: 'all 0.3s',
    cursor: 'pointer',
  };

  const iconStyle = {
    fontSize: '2.5rem',
    marginBottom: SPACING.lg,
  };

  const serviceTitleStyle = {
    fontSize: '1.1rem',
    fontWeight: '700',
    marginBottom: SPACING.md,
    color: '#1a1a1a',
  };

  const serviceDescStyle = {
    color: '#666666',
    lineHeight: '1.6',
    fontSize: '0.95rem',
  };

  const services = [
    { icon: '🚑', title: 'Emergency Care', desc: 'Immediate response team available 24/7 for medical emergencies and critical situations.' },
    { icon: '🔬', title: 'Diagnostic Services', desc: 'Advanced laboratory and imaging services with latest technology for accurate diagnosis.' },
    { icon: '💊', title: 'Pharmacy', desc: 'Complete pharmaceutical support with medications and clinical counseling services.' },
    { icon: '🦷', title: 'Dental Care', desc: 'Comprehensive dental treatment and preventive care from experienced specialists.' },
    { icon: '👶', title: 'Pediatrics', desc: 'Specialized care for infants and children with dedicated pediatric specialists.' },
    { icon: '🏃', title: 'Rehabilitation', desc: 'Physical therapy and rehabilitation services to aid patient recovery and mobility.' },
  ];

  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>Our Services</h2>
        <div style={gridStyle}>
          {services.map((service, idx) => (
            <div
              key={idx}
              style={serviceCardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 102, 255, 0.12)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.backgroundColor = '#F0F7FF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.backgroundColor = '#FAFBFC';
              }}
            >
              <div style={iconStyle}>{service.icon}</div>
              <h3 style={serviceTitleStyle}>{service.title}</h3>
              <p style={serviceDescStyle}>{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
