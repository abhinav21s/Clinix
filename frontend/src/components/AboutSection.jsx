import React from 'react';
import { SPACING } from '../styles/colors';

const AboutSection = () => {
  const sectionStyle = {
    padding: `${SPACING.xxxl} ${SPACING.xl}`,
    backgroundColor: '#FAFBFC',
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: SPACING.xl,
  };

  const cardStyle = {
    backgroundColor: '#FFFFFF',
    padding: SPACING.xl,
    borderRadius: '12px',
    border: '1px solid #E1E8ED',
    textAlign: 'center',
    transition: 'all 0.3s',
    cursor: 'pointer',
  };

  const iconStyle = {
    fontSize: '3.5rem',
    marginBottom: SPACING.lg,
  };

  const cardTitleStyle = {
    fontSize: '1.2rem',
    fontWeight: '700',
    marginBottom: SPACING.md,
    color: '#1a1a1a',
  };

  const cardDescStyle = {
    color: '#666666',
    lineHeight: '1.6',
    fontSize: '0.95rem',
  };

  const features = [
    {
      icon: '🏥',
      title: 'Modern Facilities',
      desc: 'State-of-the-art medical equipment and advanced diagnostic technology for accurate care.'
    },
    {
      icon: '👨‍⚕️',
      title: 'Expert Doctors',
      desc: 'Board-certified specialists with years of experience in their respective fields.'
    },
    {
      icon: '❤️',
      title: 'Quality Care',
      desc: 'Patient-centric approach with compassionate and personalized healthcare services.'
    },
    {
      icon: '⏰',
      title: '24/7 Support',
      desc: 'Round-the-clock medical assistance and emergency support whenever you need us.'
    },
  ];

  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>Why Choose Aether Hospital</h2>
        <div style={gridStyle}>
          {features.map((feature, idx) => (
            <div
              key={idx}
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={iconStyle}>{feature.icon}</div>
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
