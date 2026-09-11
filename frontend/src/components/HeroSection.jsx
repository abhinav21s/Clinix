import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SPACING } from '../styles/colors';

const HeroSection = () => {
  const navigate = useNavigate();

  const sectionStyle = {
    backgroundColor: '#F8FAFB',
    padding: `${SPACING.xxxl} ${SPACING.xl}`,
    borderBottom: '1px solid #E1E8ED',
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    alignItems: 'center',
    gap: SPACING.xxxl,
  };

  const textStyle = {
    flex: 1,
  };

  const headingStyle = {
    fontSize: '3.5rem',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: SPACING.lg,
    lineHeight: '1.2',
  };

  const subheadingStyle = {
    fontSize: '1.1rem',
    color: '#666666',
    marginBottom: SPACING.xl,
    lineHeight: '1.6',
  };

  const buttonStyle = {
    backgroundColor: '#0066FF',
    color: 'white',
    border: 'none',
    padding: `${SPACING.md} ${SPACING.xl}`,
    fontSize: '1rem',
    fontWeight: '600',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  const imageStyle = {
    width: '100%',
    height: '450px',
    backgroundColor: '#F0F7FF',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  };

  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        <div style={textStyle}>
          <h1 style={headingStyle}>Your Health, Our Priority</h1>
          <p style={subheadingStyle}>
            Experience excellence in healthcare. Our world-class medical team provides comprehensive care with cutting-edge technology and compassionate service.
          </p>
          <button
            style={buttonStyle}
            onClick={() => navigate('/appointment')}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#0052CC'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#0066FF'}
          >
            Book Appointment
          </button>
        </div>

        <div style={imageStyle}>
          <svg width="100%" height="100%" viewBox="0 0 500 450" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#F4A460', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#D2B48C', stopOpacity: 1 }} />
              </linearGradient>
              <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#E3F2FD', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#F0F7FF', stopOpacity: 1 }} />
              </linearGradient>
            </defs>

            {/* Background */}
            <rect width="500" height="450" fill="url(#bgGrad)" />

            {/* Decorative circles */}
            <circle cx="420" cy="80" r="60" fill="#FFE4E1" opacity="0.6" />
            <circle cx="80" cy="380" r="50" fill="#E0F2F1" opacity="0.6" />
            <circle cx="450" cy="350" r="40" fill="#FFF9E6" opacity="0.6" />

            {/* Doctor figure - woman */}
            <g transform="translate(180, 100)">
              {/* Head */}
              <circle cx="0" cy="0" r="30" fill="url(#skinGrad)" />
              {/* Hair */}
              <path d="M -30 -5 Q -40 -20 -25 -35 Q 0 -45 25 -35 Q 40 -20 30 -5" fill="#2C1810" />
              {/* Eyes */}
              <circle cx="-10" cy="-5" r="3" fill="#000" />
              <circle cx="10" cy="-5" r="3" fill="#000" />
              {/* Smile */}
              <path d="M -10 8 Q 0 12 10 8" stroke="#8B4513" strokeWidth="2" fill="none" />
              
              {/* Body - Doctor coat */}
              <rect x="-35" y="35" width="70" height="80" fill="#FFFFFF" stroke="#0066FF" strokeWidth="2" rx="5" />
              {/* Stethoscope */}
              <path d="M -20 50 Q -25 70 -15 75" stroke="#FF6B6B" strokeWidth="3" fill="none" />
              <path d="M 20 50 Q 25 70 15 75" stroke="#FF6B6B" strokeWidth="3" fill="none" />
              <circle cx="0" cy="82" r="8" fill="#FF6B6B" />
              
              {/* Arms */}
              <rect x="-50" y="40" width="15" height="60" fill="url(#skinGrad)" rx="7" />
              <rect x="35" y="40" width="15" height="60" fill="url(#skinGrad)" rx="7" />
            </g>

            {/* Clipboard/Medical chart */}
            <g transform="translate(320, 150)">
              <rect x="0" y="0" width="80" height="120" fill="#FFFFFF" stroke="#0066FF" strokeWidth="2" rx="4" />
              <rect x="5" y="5" width="70" height="15" fill="#0066FF" />
              <line x1="10" y1="30" x2="65" y2="30" stroke="#CCCCCC" strokeWidth="1" />
              <line x1="10" y1="40" x2="55" y2="40" stroke="#CCCCCC" strokeWidth="1" />
              <line x1="10" y1="50" x2="60" y2="50" stroke="#CCCCCC" strokeWidth="1" />
              <line x1="10" y1="60" x2="50" y2="60" stroke="#CCCCCC" strokeWidth="1" />
              <circle cx="35" cy="85" r="8" fill="#FF6B6B" />
            </g>

            {/* Heart icon */}
            <g transform="translate(120, 300)">
              <path d="M 0 -8 C -8 -16 -20 -16 -20 -8 C -20 0 0 16 0 16 C 0 16 20 0 20 -8 C 20 -16 8 -16 0 -8" fill="#FF6B6B" />
            </g>

            {/* Plus/Medical cross */}
            <g transform="translate(380, 280)">
              <rect x="-8" y="-20" width="16" height="40" fill="#0066FF" rx="2" />
              <rect x="-20" y="-8" width="40" height="16" fill="#0066FF" rx="2" />
            </g>

            {/* Pill/Capsule */}
            <g transform="translate(250, 380)">
              <ellipse cx="-8" cy="0" rx="8" ry="12" fill="#FF9999" />
              <ellipse cx="8" cy="0" rx="8" ry="12" fill="#6699FF" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
