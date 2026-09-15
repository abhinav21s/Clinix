import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('dr.jenkins@aetherhospital.com');
  const [password, setPassword] = useState('doctor123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  const demoAccounts = [
    { label: 'Dr. Sarah Jenkins (Cardiology)', email: 'dr.jenkins@aetherhospital.com', pass: 'doctor123', role: 'Doctor' },
    { label: 'Dr. Rajesh Sharma (Neurology)', email: 'dr.sharma@aetherhospital.com', pass: 'doctor123', role: 'Doctor' },
    { label: 'Dr. Emily Chen (Pediatrics)', email: 'dr.chen@aetherhospital.com', pass: 'doctor123', role: 'Doctor' },
    { label: 'Dr. Michael Brown (Orthopedics)', email: 'dr.brown@aetherhospital.com', pass: 'doctor123', role: 'Doctor' },
    { label: 'Dr. Priya Patel (General Medicine)', email: 'dr.patel@aetherhospital.com', pass: 'doctor123', role: 'Doctor' },
    { label: 'Hospital Administrator', email: 'admin@aetherhospital.com', pass: 'admin123', role: 'Admin' },
  ];

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
      else navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (acc) => {
    setEmail(acc.email);
    setPassword(acc.pass);
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F8FAFC',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        padding: '2.5rem',
        borderRadius: '8px',
        border: '1px solid #E2E8F0',
        width: '100%',
        maxWidth: '460px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
      }}>
        {/* Clean Clinical Header */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '38px',
            height: '38px',
            borderRadius: '6px',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            fontWeight: '700',
            fontSize: '1rem',
            marginBottom: '0.75rem',
            letterSpacing: '-0.02em'
          }}>
            AH
          </div>
          <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#0F172A', letterSpacing: '-0.01em' }}>
            Aether Hospital
          </h1>
          <p style={{ margin: '0.35rem 0 0', color: '#64748B', fontSize: '0.85rem' }}>
            Clinical & Administrative Management Portal
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#FEF2F2',
            color: '#991B1B',
            border: '1px solid #FCA5A5',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            fontSize: '0.85rem',
            marginBottom: '1.25rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#334155', marginBottom: '0.35rem' }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. dr.jenkins@aetherhospital.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.7rem 0.85rem',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box',
                color: '#0F172A'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#334155', marginBottom: '0.35rem' }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.7rem 0.85rem',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box',
                color: '#0F172A'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '0.9rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem',
              transition: 'background-color 0.15s'
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Login Switcher */}
        <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', textAlign: 'center' }}>
            Quick Sign-In Selection
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {demoAccounts.map((acc, i) => {
              const isSelected = email === acc.email;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => fillCredentials(acc)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: isSelected ? '#F1F5F9' : '#FFFFFF',
                    border: `1px solid ${isSelected ? '#94A3B8' : '#E2E8F0'}`,
                    borderRadius: '5px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.78rem',
                    color: isSelected ? '#0F172A' : '#334155',
                    fontWeight: isSelected ? '600' : '400'
                  }}
                >
                  <span>{acc.label}</span>
                  <span style={{
                    fontSize: '0.7rem',
                    color: '#64748B',
                    backgroundColor: '#F8FAFC',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid #E2E8F0'
                  }}>
                    {acc.role}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
