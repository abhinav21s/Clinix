import React from 'react';
import { SPACING } from '../styles/colors';

const AboutSection = () => {
  const sectionStyle = {
    padding: `${SPACING.xxxl * 1.5} ${SPACING.xl}`,
    backgroundColor: '#F8FAFC',
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: SPACING.xl,
  };

  const cardStyle = {
    backgroundColor: '#FFFFFF',
    padding: `${SPACING.xl} ${SPACING.xl}`,
    borderRadius: '12px',
    border: '1px solid #F0F4F8',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  };

  const iconContainerStyle = {
    width: '56px',
    height: '56px',
    backgroundColor: '#F0F7FF',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  };

  const cardTitleStyle = {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#0A0E27',
    marginBottom: SPACING.md,
    margin: 0,
  };

  const cardDescStyle = {
    color: '#6B7280',
    lineHeight: '1.6',
    fontSize: '0.95rem',
    margin: 0,
  };

  const features = [
    {
      title: 'Expert Doctors',
      desc: 'Board-certified specialists with years of experience in their respective medical fields.',
    },
    {
      title: 'Modern Facilities',
      desc: 'State-of-the-art equipment and advanced diagnostic technology for precise care.',
    },
    {
      title: '24/7 Support',
      desc: 'Round-the-clock medical assistance and emergency support whenever you need us.',
    },
    {
      title: 'Quality Care',
      desc: 'Patient-centric approach with compassionate and personalized healthcare services.',
    },
  ];

  const renderIcon = (index) => {
    const icons = [
      // Stethoscope icon
      (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="1.5">
          <path d="M4.6 11c0 4.08 3.37 7.4 7.52 7.4 4.15 0 7.52-3.32 7.52-7.4M11 13v6M11 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
        </svg>
      ),
      // Hospital building icon
      (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="1.5">
          <path d="M12 2L2 7v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7l-10-5z" />
          <path d="M9 13h6M12 10v6M7 13h2M15 13h2" />
        </svg>
      ),
      // Clock/24-7 icon
      (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
      // Heart/Care icon
      (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    ];
    return icons[index];
  };

  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Why Choose Aether</h2>
          <p style={subtitleStyle}>
            We're committed to providing exceptional healthcare through innovation, expertise, and genuine care for our patients.
          </p>
        </div>

        <div style={gridStyle}>
          {features.map((feature, idx) => (
            <div
              key={idx}
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 102, 255, 0.08)';
                e.currentTarget.style.borderColor = '#E0EEFF';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#F0F4F8';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={iconContainerStyle}>
                {renderIcon(idx)}
              </div>
              <h3 style={cardTitleStyle}>{feature.title}</h3>
              <p style={cardDescStyle}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

