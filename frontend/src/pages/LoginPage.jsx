import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const googleBtnRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '348193188972-t5qvur3v4c1uhfqft0hgj140dr23ca98.apps.googleusercontent.com';

  // Real Google Identity Services Callback
  const handleGoogleCredentialResponse = async (response) => {
    if (!response || !response.credential) {
      setError('No credential received from Google sign-in.');
      return;
    }

    setOauthLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Google authentication failed');

      login(data.user, data.token);

      if (data.user.role === 'admin') navigate('/admin');
      else if (data.user.role === 'doctor') navigate('/doctor');
      else if (data.user.role === 'receptionist') navigate('/receptionist');
      else navigate('/');
    } catch (err) {
      console.error('OAuth error:', err);
      setError(err.message || 'Failed to authenticate with Google');
    } finally {
      setOauthLoading(false);
    }
  };

  // Initialize official Google Identity Services button
  useEffect(() => {
    const initGIS = () => {
      if (window.google?.accounts?.id && GOOGLE_CLIENT_ID) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          if (googleBtnRef.current) {
            googleBtnRef.current.innerHTML = '';
            window.google.accounts.id.renderButton(googleBtnRef.current, {
              type: 'standard',
              theme: 'outline',
              size: 'large',
              text: 'continue_with',
              shape: 'rectangular',
              logo_alignment: 'center',
              width: 390,
            });
          }
        } catch (e) {
          console.warn('Google Identity initialization:', e);
        }
      }
    };

    if (window.google?.accounts?.id) {
      initGIS();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          initGIS();
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, [GOOGLE_CLIENT_ID]);

  // Standard Email & Password Submit
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid email or password.');

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

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F8FAFC',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      padding: '1.5rem'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        padding: '2.5rem 2.25rem',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)'
      }}>
        {/* Hospital Branding Header */}
        <div style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            fontWeight: '700',
            fontSize: '1.15rem',
            marginBottom: '0.85rem',
            boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.2)'
          }}>
            AH
          </div>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700', color: '#0F172A', letterSpacing: '-0.02em' }}>
            Aether Hospital
          </h1>
          <p style={{ margin: '0.35rem 0 0', color: '#64748B', fontSize: '0.88rem' }}>
            Sign in to access your portal
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#FEF2F2',
            color: '#991B1B',
            border: '1px solid #FCA5A5',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '1.25rem'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* ── 1. EMAIL & PASSWORD FORM (AT THE TOP) ── */}
        <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#334155', marginBottom: '0.4rem' }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@aetherhospital.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={{
                width: '100%',
                padding: '0.75rem 0.9rem',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box',
                color: '#0F172A',
                backgroundColor: '#FFFFFF',
                transition: 'border-color 0.15s, box-shadow 0.15s'
              }}
              onFocus={(e) => { e.target.style.borderColor = '#0F172A'; e.target.style.boxShadow = '0 0 0 1px #0F172A'; }}
              onBlur={(e) => { e.target.style.borderColor = '#CBD5E1'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#334155', marginBottom: '0.4rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{
                  width: '100%',
                  padding: '0.75rem 2.75rem 0.75rem 0.9rem',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  color: '#0F172A',
                  backgroundColor: '#FFFFFF',
                  transition: 'border-color 0.15s, box-shadow 0.15s'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#0F172A'; e.target.style.boxShadow = '0 0 0 1px #0F172A'; }}
                onBlur={(e) => { e.target.style.borderColor = '#CBD5E1'; e.target.style.boxShadow = 'none'; }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: '4px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || oauthLoading}
            style={{
              padding: '0.8rem',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.92rem',
              cursor: (loading || oauthLoading) ? 'not-allowed' : 'pointer',
              marginTop: '0.3rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'background-color 0.15s, opacity 0.15s',
              opacity: (loading || oauthLoading) ? 0.7 : 1
            }}
          >
            {loading ? (
              <>
                <svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                </svg>
                <span>Signing In...</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* ── 2. DIVIDER ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          textAlign: 'center',
          margin: '1.5rem 0',
          color: '#94A3B8'
        }}>
          <div style={{ flex: 1, borderBottom: '1px solid #E2E8F0' }}></div>
          <span style={{ padding: '0 0.75rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            or continue with
          </span>
          <div style={{ flex: 1, borderBottom: '1px solid #E2E8F0' }}></div>
        </div>

        {/* ── 3. GOOGLE SIGN-IN BUTTON CONTAINER (BELOW) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <div
            ref={googleBtnRef}
            id="google-btn-container"
            style={{ width: '100%', minHeight: '44px', display: 'flex', justifyContent: 'center' }}
          ></div>
          {oauthLoading && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg style={{ animation: 'spin 1s linear infinite' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
              </svg>
              <span>Verifying Google account...</span>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.8rem', color: '#94A3B8' }}>
          Authorized hospital personnel only. For credentials, contact IT Administration.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
