import React from 'react';
import { SPACING } from '../styles/colors';

const Footer = () => {
  const footerStyle = {
    backgroundColor: '#1a1a1a',
    color: '#FFFFFF',
    padding: `${SPACING.xxxl} ${SPACING.xl}`,
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
    fontSize: '1.1rem',
    fontWeight: '700',
    marginBottom: SPACING.md,
    color: '#FFFFFF',
  };

  const linkStyle = {
    color: '#AAAAAA',
    textDecoration: 'none',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'color 0.3s',
  };

  const infoStyle = {
    color: '#AAAAAA',
    fontSize: '0.95rem',
    lineHeight: '1.8',
  };

  const bottomStyle = {
    borderTop: '1px solid #333333',
    paddingTop: SPACING.xl,
    textAlign: 'center',
    color: '#777777',
    fontSize: '0.9rem',
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div style={columnStyle}>
          <h3 style={columnTitleStyle}>🏥 Aether Hospital</h3>
          <p style={infoStyle}>
            Providing world-class healthcare services with compassion and excellence.
          </p>
        </div>

        <div style={columnStyle}>
          <h4 style={columnTitleStyle}>Services</h4>
          <a style={{ ...linkStyle }} onMouseEnter={(e) => e.target.style.color = '#FFFFFF'} onMouseLeave={(e) => e.target.style.color = '#AAAAAA'}>Emergency Care</a>
          <a style={{ ...linkStyle }} onMouseEnter={(e) => e.target.style.color = '#FFFFFF'} onMouseLeave={(e) => e.target.style.color = '#AAAAAA'}>Diagnostics</a>
          <a style={{ ...linkStyle }} onMouseEnter={(e) => e.target.style.color = '#FFFFFF'} onMouseLeave={(e) => e.target.style.color = '#AAAAAA'}>Pediatrics</a>
        </div>

        <div style={columnStyle}>
          <h4 style={columnTitleStyle}>Contact</h4>
          <p style={infoStyle}>
            📍 123 Medical Plaza<br/>
            Healthcare City, HC 12345
          </p>
          <p style={infoStyle}>
            📞 +1 (555) 123-4567<br/>
            📧 contact@aetherhospital.com
          </p>
        </div>

        <div style={columnStyle}>
          <h4 style={columnTitleStyle}>Hours</h4>
          <p style={infoStyle}>
            Monday - Friday<br/>
            8:00 AM - 8:00 PM
          </p>
          <p style={infoStyle}>
            Saturday - Sunday<br/>
            9:00 AM - 6:00 PM
          </p>
        </div>
      </div>

      <div style={bottomStyle}>
        © 2024 Aether Hospital. All rights reserved. | Privacy Policy | Terms of Service
      </div>
    </footer>
  );
};

export default Footer;
