import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { COLORS, SPACING } from '../styles/colors';
import Button from '../components/Button';
import Card from '../components/Card';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  };

  const formContainerStyle = {
    width: '100%',
    maxWidth: '400px',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: SPACING.xl,
  };

  const logoStyle = {
    width: '50px',
    height: '50px',
    backgroundColor: COLORS.primary,
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: COLORS.surface,
    fontWeight: 'bold',
    fontSize: '1.5rem',
    margin: '0 auto',
    marginBottom: SPACING.md,
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  };

  const subtitleStyle = {
    fontSize: '0.95rem',
    color: COLORS.textSecondary,
  };

  const formGroupStyle = {
    marginBottom: SPACING.lg,
  };

  const labelStyle = {
    display: 'block',
    marginBottom: SPACING.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
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
  };

  const selectStyle = {
    ...inputStyle,
    backgroundColor: COLORS.surface,
    cursor: 'pointer',
  };

  const errorStyle = {
    backgroundColor: '#FED7D7',
    color: COLORS.error,
    padding: SPACING.md,
    borderRadius: '8px',
    marginBottom: SPACING.lg,
    fontSize: '0.9rem',
    border: `1px solid ${COLORS.error}`,
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: SPACING.md,
  };

  const demoCredentialsStyle = {
    marginTop: SPACING.xl,
    padding: SPACING.lg,
    backgroundColor: '#F0F4FF',
    borderRadius: '8px',
    fontSize: '0.85rem',
    color: COLORS.textSecondary,
    border: `1px solid ${COLORS.primary}40`,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !password || !role) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    // Simulate authentication (Phase 4 will integrate Supabase)
    setTimeout(() => {
      try {
        const userData = {
          email,
          id: Math.random().toString(36).substr(2, 9),
          loginTime: new Date().toISOString(),
        };

        login(userData, role);

        // Redirect based on role
        if (role === 'admin') {
          navigate('/admin-dashboard');
        } else if (role === 'doctor') {
          navigate('/doctor-dashboard');
        } else if (role === 'receptionist') {
          navigate('/receptionist-dashboard');
        }
      } catch (err) {
        setError('Login failed. Please try again.');
        setLoading(false);
      }
    }, 800);
  };

  const handleDemoLogin = (demoRole) => {
    const demoEmails = {
      admin: 'admin@aetherhospital.com',
      doctor: 'doctor@aetherhospital.com',
      receptionist: 'receptionist@aetherhospital.com',
    };

    setEmail(demoEmails[demoRole]);
    setPassword('demo-password-123');
    setRole(demoRole);
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <div style={headerStyle}>
          <div style={logoStyle}>A</div>
          <h1 style={titleStyle}>Aether Hospital</h1>
          <p style={subtitleStyle}>Staff Portal Login</p>
        </div>

        <Card>
          {error && <div style={errorStyle}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Email Address</label>
              <input
                style={inputStyle}
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Password</label>
              <input
                style={inputStyle}
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Role</label>
              <select
                style={selectStyle}
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={loading}
              >
                <option value="admin">Admin</option>
                <option value="doctor">Doctor</option>
                <option value="receptionist">Receptionist</option>
              </select>
            </div>

            <div style={buttonContainerStyle}>
              <Button
                variant="primary"
                size="md"
                type="submit"
                disabled={loading}
                style={{ flex: 1 }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
              <Button
                variant="secondary"
                size="md"
                type="button"
                onClick={() => navigate('/')}
                disabled={loading}
                style={{ flex: 1 }}
              >
                Back
              </Button>
            </div>
          </form>

          <div style={demoCredentialsStyle}>
            <div style={{ fontWeight: '600', marginBottom: SPACING.sm }}>Demo Credentials</div>
            <div style={{ marginBottom: SPACING.sm }}>
              <button
                onClick={() => handleDemoLogin('admin')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: COLORS.primary,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '0.85rem',
                }}
              >
                Load Admin
              </button>
            </div>
            <div style={{ marginBottom: SPACING.sm }}>
              <button
                onClick={() => handleDemoLogin('doctor')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: COLORS.primary,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '0.85rem',
                }}
              >
                Load Doctor
              </button>
            </div>
            <div>
              <button
                onClick={() => handleDemoLogin('receptionist')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: COLORS.primary,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '0.85rem',
                }}
              >
                Load Receptionist
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
