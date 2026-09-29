import React from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS, SPACING } from '../styles/colors';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
  };

  const navStyle = {
    backgroundColor: COLORS.surface,
    borderBottom: `1px solid ${COLORS.border}`,
    padding: `${SPACING.lg} ${SPACING.xl}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: COLORS.primary,
  };

  const contentStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: SPACING.xl,
  };

  const welcomeStyle = {
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
    borderRadius: '12px',
    marginBottom: SPACING.xl,
    border: `1px solid ${COLORS.border}`,
  };

  const headingStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  };

  const descStyle = {
    fontSize: '1rem',
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  };

  return (
    <div style={containerStyle}>
      <nav style={navStyle}>
        <div style={titleStyle}>Doctor Portal</div>
        <Button variant="danger" size="md" onClick={handleLogout}>
          Logout
        </Button>
      </nav>

      <div style={contentStyle}>
        <div style={welcomeStyle}>
          <h1 style={headingStyle}>Doctor here</h1>
          <p style={descStyle}>
            Logged in as: <strong>{user?.email}</strong>
          </p>
          <p style={descStyle}>
            Features for doctors will be available in Phase 4.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
