import React from 'react';
import { SPACING } from '../styles/colors';

const ServicesSection = () => {
  const sectionStyle = {
    padding: `${SPACING.xxxl * 1.5} ${SPACING.xl}`,
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #F0F4F8',
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: SPACING.xxxl * 1.5,
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#0A0E27',
    marginBottom: SPACING.lg,
    margin: 0,
    fontFamily: '"Segoe UI", Roboto, sans-serif',
  };

  const subtitleStyle = {
    fontSize: '1.1rem',
    color: '#6B7280',
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: '1.6',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: SPACING.xl,
  };

  const serviceCardStyle = {
    backgroundColor: '#F8FAFC',
    padding: `${SPACING.xl} ${SPACING.xl}`,
    borderRadius: '12px',
    border: '1px solid #F0F4F8',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  };

  const iconContainerStyle = {
    width: '48px',
    height: '48px',
    backgroundColor: '#E0EEFF',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  };

  const serviceTitleStyle = {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#0A0E27',
    marginBottom: SPACING.md,
    margin: 0,
  };

  const serviceDescStyle = {
    color: '#6B7280',
    lineHeight: '1.6',
    fontSize: '0.9rem',
    margin: 0,
  };

  const services = [
    { title: 'Emergency Care', desc: 'Immediate response team available 24/7 for medical emergencies.' },
    { title: 'Cardiology', desc: 'Comprehensive heart and cardiovascular disease treatment.' },
    { title: 'Orthopedics', desc: 'Specialized care for bones, joints, and orthopedic conditions.' },
    { title: 'Pediatrics', desc: 'Specialized healthcare for infants and children.' },
    { title: 'Diagnostics', desc: 'Advanced laboratory and imaging services.' },
    { title: 'Rehabilitation', desc: 'Physical therapy and recovery services.' },
  ];

  const renderIcon = (index) => {
    const icons = [
      // Ambulance/Emergency
      (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="1.5">
          <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM17 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          <path d="M20 8H2l2 8h14l2-8z" />
          <path d="M6 8V4h2v4h4V4h2v4h4" />
        </svg>
      ),
      // Heart
      (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
      // Bones/Joint
      (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="1.5">
          <circle cx="6" cy="6" r="2.5" />
          <circle cx="18" cy="6" r="2.5" />
          <circle cx="6" cy="18" r="2.5" />
          <circle cx="18" cy="18" r="2.5" />
          <path d="M8.5 7.5L15.5 16.5M7.5 8.5L16.5 15.5" />
        </svg>
      ),
      // Child/Baby
      (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="1.5">
          <circle cx="12" cy="8" r="4" />
          <path d="M12 12c-3.3 0-6 1.8-6 4v4h12v-4c0-2.2-2.7-4-6-4z" />
        </svg>
      ),
      // Microscope/Lab
      (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="1.5">
          <path d="M6 9l1.5-3h9l1.5 3M8 9v8c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V9M12 9L9 19h6l-3-10z" />
          <circle cx="12" cy="4" r="1.5" />
        </svg>
      ),
      // Physical Therapy
      (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="1.5">
          <circle cx="12" cy="6" r="3" />
          <path d="M9 12h6v8H9zM6 12L3 16M18 12l3 4" />
        </svg>
      ),
    ];
    return icons[index];
  };

  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Our Services</h2>
          <p style={subtitleStyle}>
            Comprehensive medical services designed to meet all your healthcare needs with excellence and care.
          </p>
        </div>

        <div style={gridStyle}>
          {services.map((service, idx) => (
            <div
              key={idx}
              style={serviceCardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 102, 255, 0.08)';
                e.currentTarget.style.borderColor = '#E0EEFF';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F8FAFC';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#F0F4F8';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={iconContainerStyle}>
                {renderIcon(idx)}
              </div>
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
