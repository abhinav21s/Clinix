import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SPACING } from '../styles/colors';

const HeroSection = () => {
  const navigate = useNavigate();

  const sectionStyle = {
    backgroundColor: '#FFFFFF',
    padding: `${SPACING.xxxl * 1.5} ${SPACING.xl}`,
    borderBottom: '1px solid #F0F4F8',
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    alignItems: 'center',
    gap: SPACING.xxxl * 1.5,
  };

  const contentStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.xl,
  };

  const headingStyle = {
    fontSize: '3.8rem',
    fontWeight: '800',
    color: '#0A0E27',
    lineHeight: '1.15',
    margin: 0,
    fontFamily: '"Segoe UI", Roboto, sans-serif',
  };

  const subheadingStyle = {
    fontSize: '1.15rem',
    color: '#6B7280',
    lineHeight: '1.7',
    margin: 0,
    fontWeight: '400',
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.lg,
  };

  const primaryButtonStyle = {
    backgroundColor: '#0066FF',
    color: 'white',
    border: 'none',
    padding: `${SPACING.md} ${SPACING.xxl}`,
    fontSize: '1rem',
    fontWeight: '600',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 102, 255, 0.2)',
  };

  const secondaryButtonStyle = {
    backgroundColor: 'transparent',
    color: '#0066FF',
    border: '1.5px solid #0066FF',
    padding: `${SPACING.md} ${SPACING.xxl}`,
    fontSize: '1rem',
    fontWeight: '600',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  const visualStyle = {
    width: '100%',
    height: '500px',
    backgroundColor: '#F8FAFC',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid #F0F4F8',
  };

  const gradientOverlay = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.05) 0%, rgba(0, 102, 255, 0.02) 100%)',
  };

  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        <div style={contentStyle}>
          <h1 style={headingStyle}>
            Premium Healthcare,
            <br />
            Simply Delivered
          </h1>
          <p style={subheadingStyle}>
            Experience world-class medical care with our team of expert specialists. We combine cutting-edge technology with compassionate service to ensure your wellbeing.
          </p>
          <div style={buttonContainerStyle}>
            <button
              style={primaryButtonStyle}
              onClick={() => navigate('/appointment')}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#0052CC';
                e.target.style.boxShadow = '0 8px 25px rgba(0, 102, 255, 0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#0066FF';
                e.target.style.boxShadow = '0 4px 15px rgba(0, 102, 255, 0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Book Appointment
            </button>
            <button
              style={secondaryButtonStyle}
              onClick={() => navigate('/')}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#F0F7FF';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              Learn More
            </button>
          </div>
        </div>

        <div style={visualStyle}>
          <div style={gradientOverlay}></div>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 500 500"
            xmlns="http://www.w3.org/2000/svg"
            style={{ position: 'relative', zIndex: 1 }}
          >
            <defs>
              <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#0066FF', stopOpacity: 0.1 }} />
                <stop offset="100%" style={{ stopColor: '#0066FF', stopOpacity: 0.05 }} />
              </linearGradient>
              <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#0066FF', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#0052CC', stopOpacity: 1 }} />
              </linearGradient>
            </defs>

            {/* Abstract medical shapes */}
            <circle cx="250" cy="250" r="180" fill="url(#blueGrad)" />
            <circle cx="250" cy="250" r="160" fill="none" stroke="#0066FF" strokeWidth="1" opacity="0.2" />
            <circle cx="250" cy="250" r="140" fill="none" stroke="#0066FF" strokeWidth="1" opacity="0.15" />

            {/* Central medical icon - Heartbeat */}
            <g transform="translate(250, 250)">
              {/* Heart shape */}
              <path
                d="M 0 -8 C -10 -18 -25 -18 -25 -8 C -25 5 0 25 0 25 C 0 25 25 5 25 -8 C 25 -18 10 -18 0 -8"
                fill="#0066FF"
                opacity="0.8"
              />
            </g>

            {/* Top right accent */}
            <rect x="350" y="80" width="120" height="120" fill="none" stroke="#0066FF" strokeWidth="2" opacity="0.1" rx="12" />

            {/* Bottom left accent */}
            <circle cx="100" cy="380" r="60" fill="none" stroke="#0066FF" strokeWidth="2" opacity="0.1" />

            {/* Pulse dots */}
            <g opacity="0.6">
              <circle cx="200" cy="150" r="6" fill="#0066FF" />
              <circle cx="320" cy="200" r="4" fill="#0066FF" />
              <circle cx="280" cy="350" r="5" fill="#0066FF" />
            </g>

            {/* Medical cross */}
            <g transform="translate(400, 120)" opacity="0.15">
              <rect x="-12" y="-30" width="24" height="60" fill="#0066FF" />
              <rect x="-30" y="-12" width="60" height="24" fill="#0066FF" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
