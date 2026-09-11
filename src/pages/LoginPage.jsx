import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS, SPACING } from '../styles/colors';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      login(email, password, role);
      
      // Redirect based on role
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'doctor') {
        navigate('/doctor');
      } else if (role === 'receptionist') {
        navigate('/receptionist');
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  };

  const formContainerStyle = {
    backgroundColor: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '12px',
    padding: SPACING.xl,
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  };

  const subtitleStyle = {
    fontSize: '0.95rem',
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  };

  const formGroupStyle = {
    marginBottom: SPACING.lg,
  };

  const labelStyle = {
    display: 'block',
    marginBottom: SPACING.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
    fontSize: '0.95rem',
  };

  const inputStyle = {
    width: '100%',
    padding: `${SPACING.md} ${SPACING.lg}`,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    transition: 'border-color 0.3s ease',
    boxSizing: 'border-box',
    outline: 'none',
  };

  const selectStyle = {
    ...inputStyle,
    backgroundColor: COLORS.surface,
    cursor: 'pointer',
  };

  const errorStyle = {
    color: COLORS.error,
    fontSize: '0.875rem',
    marginTop: SPACING.sm,
  };

  const buttonContainerStyle = {
    marginTop: SPACING.xl,
  };

  const linkStyle = {
    textAlign: 'center',
    marginTop: SPACING.lg,
    fontSize: '0.95rem',
    color: COLORS.textSecondary,
  };

  const backLinkStyle = {
    color: COLORS.primary,
    cursor: 'pointer',
    textDecoration: 'underline',
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h1 style={titleStyle}>Aether Hospital</h1>
        <p style={subtitleStyle}>Admin Portal Login</p>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            style={inputStyle}
            placeholder="admin@aetherhospital.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Password</label>
          <input
            type="password"
            style={inputStyle}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Role</label>
          <select
            style={selectStyle}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="receptionist">Receptionist</option>
          </select>
        </div>

        {error && <div style={errorStyle}>{error}</div>}

        <div style={buttonContainerStyle}>
          <Button variant="primary" size="lg" onClick={handleLogin}>
            Login
          </Button>
        </div>

        <div style={linkStyle}>
          <span 
            style={backLinkStyle}
            onClick={() => navigate('/')}
          >
            Back to Home
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
