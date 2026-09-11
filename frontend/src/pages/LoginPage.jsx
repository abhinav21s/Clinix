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
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      login(data.user, data.token);

      if (data.user.role === 'admin') navigate('/admin');
      else if (data.user.role === 'doctor') navigate('/doctor');
      else if (data.user.role === 'receptionist') navigate('/receptionist');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  };

  const cardStyle = {
    backgroundColor: COLORS.surface,
    padding: SPACING.xxxl,
    borderRadius: '12px',
    border: `1px solid ${COLORS.border}`,
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
  };

  const titleStyle = {
    fontSize: '1.8rem',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.lg,
    color: COLORS.primary,
  };

  const descStyle = {
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.lg,
  };

  const inputStyle = {
    padding: `${SPACING.md} ${SPACING.lg}`,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  };

  const errorStyle = {
    backgroundColor: '#FEE',
    color: COLORS.error,
    padding: SPACING.md,
    borderRadius: '8px',
    fontSize: '0.9rem',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>🏥 Aether Hospital</h1>
        <p style={descStyle}>Login to your account</p>

        {error && <div style={errorStyle}>{error}</div>}

        <form style={formStyle} onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            style={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            style={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            style={inputStyle}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="receptionist">Receptionist</option>
          </select>
          <Button 
            variant="primary" 
            size="md" 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <p style={{ textAlign: 'center', marginTop: SPACING.xl, color: COLORS.textSecondary, fontSize: '0.9rem' }}>
          Demo: admin@aetherhospital.com / admin123
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
