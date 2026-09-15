import React from 'react';
import { SPACING } from '../styles/colors';

const Footer = () => {
  const footerStyle = {
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
    padding: `${SPACING.xxxl} ${SPACING.xl} ${SPACING.xl}`,
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: SPACING.xxxl,
    marginBottom: SPACING.xxxl,
  };

  const columnStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.lg,
  };

  const columnTitleStyle = {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: SPACING.md,
    margin: 0,
    letterSpacing: '0.5px',
  };

  const logoStyle = {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#0066FF',
    marginBottom: SPACING.lg,
  };

  const descStyle = {
    color: '#9CA3AF',
    fontSize: '0.95rem',
    lineHeight: '1.6',
  };

  const linkStyle = {
    color: '#D1D5DB',
    textDecoration: 'none',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'color 0.3s ease',
  };

  const infoStyle = {
    color: '#D1D5DB',
    fontSize: '0.95rem',
    lineHeight: '1.8',
  };

  const dividerStyle = {
    borderTop: '1px solid #374151',
    paddingTop: SPACING.xl,
    marginTop: SPACING.xl,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: SPACING.lg,
  };

  const bottomTextStyle = {
    color: '#6B7280',
    fontSize: '0.9rem',
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div style={columnStyle}>
          <div style={logoStyle}>Aether</div>
          <p style={descStyle}>
            Delivering premium healthcare with modern technology and compassionate care. Your health is our priority.
          </p>
        </div>

        <div style={columnStyle}>
          <h4 style={columnTitleStyle}>Services</h4>
          <a
            style={linkStyle}
            onMouseEnter={(e) => (e.target.style.color = '#FFFFFF')}
            onMouseLeave={(e) => (e.target.style.color = '#D1D5DB')}
          >
            Emergency Care
          </a>
          <a
            style={linkStyle}
            onMouseEnter={(e) => (e.target.style.color = '#FFFFFF')}
            onMouseLeave={(e) => (e.target.style.color = '#D1D5DB')}
          >
            Cardiology
          </a>
          <a
            style={linkStyle}
            onMouseEnter={(e) => (e.target.style.color = '#FFFFFF')}
            onMouseLeave={(e) => (e.target.style.color = '#D1D5DB')}
          >
            Diagnostics
          </a>
          <a
            style={linkStyle}
            onMouseEnter={(e) => (e.target.style.color = '#FFFFFF')}
            onMouseLeave={(e) => (e.target.style.color = '#D1D5DB')}
          >
            Pediatrics
          </a>
        </div>

        <div style={columnStyle}>
          <h4 style={columnTitleStyle}>Contact</h4>
          <p style={infoStyle}>
            123 Medical Center
            <br />
            Healthcare District, HC 12345
          </p>
          <p style={infoStyle}>
            +1 (555) 123-4567
            <br />
            contact@aetherhospital.com
          </p>
        </div>

        <div style={columnStyle}>
          <h4 style={columnTitleStyle}>Hours</h4>
          <p style={infoStyle}>
            <strong>Monday - Friday</strong>
            <br />
            8:00 AM - 8:00 PM
          </p>
          <p style={infoStyle}>
            <strong>Weekend</strong>
            <br />
            9:00 AM - 6:00 PM
          </p>
        </div>
      </div>

      <div style={dividerStyle}>
        <p style={bottomTextStyle}>© 2024 Aether Hospital. All rights reserved.</p>
        <div style={{ display: 'flex', gap: SPACING.xl }}>
          <a
            style={{ ...bottomTextStyle, textDecoration: 'none', cursor: 'pointer' }}
            onMouseEnter={(e) => (e.target.style.color = '#D1D5DB')}
            onMouseLeave={(e) => (e.target.style.color = '#6B7280')}
          >
            Privacy Policy
          </a>
          <a
            style={{ ...bottomTextStyle, textDecoration: 'none', cursor: 'pointer' }}
            onMouseEnter={(e) => (e.target.style.color = '#D1D5DB')}
            onMouseLeave={(e) => (e.target.style.color = '#6B7280')}
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
