import React from 'react';
import { COLORS, SPACING } from '../styles/colors';

const Footer = () => {
  const footerStyle = {
    backgroundColor: COLORS.secondary,
    color: COLORS.surface,
    padding: `${SPACING.xl}`,
    textAlign: 'center',
    borderTop: `1px solid ${COLORS.border}`,
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const contentStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: SPACING.xl,
    marginBottom: SPACING.xl,
    textAlign: 'left',
  };

  const sectionStyle = {
    fontSize: '0.95rem',
    lineHeight: '1.8',
  };

  const titleStyle = {
    fontSize: '1.125rem',
    fontWeight: '600',
    marginBottom: SPACING.md,
    color: COLORS.accent,
  };

  const dividerStyle = {
    borderTop: `1px solid rgba(255, 255, 255, 0.1)`,
    paddingTop: SPACING.lg,
    marginTop: SPACING.lg,
    textAlign: 'center',
    fontSize: '0.875rem',
    color: 'rgba(255, 255, 255, 0.7)',
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div style={contentStyle}>
          <div style={sectionStyle}>
            <h4 style={titleStyle}>⚕️ Aether Hospital</h4>
            <p>Delivering excellence in healthcare and compassionate patient care.</p>
          </div>
          <div style={sectionStyle}>
            <h4 style={titleStyle}>Contact</h4>
            <p>📞 Phone: (555) 123-4567</p>
            <p>📧 Email: info@aetherhospital.com</p>
            <p>📍 Address: 123 Healthcare Ave, City, State 12345</p>
          </div>
          <div style={sectionStyle}>
            <h4 style={titleStyle}>Quick Links</h4>
            <p>About Us</p>
            <p>Services</p>
            <p>Privacy Policy</p>
          </div>
        </div>
        <div style={dividerStyle}>
          <p>&copy; 2024 Aether Hospital. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
