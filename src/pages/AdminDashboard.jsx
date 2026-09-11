import React from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS, SPACING } from '../styles/colors';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';

const AdminDashboard = () => {
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

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: SPACING.xl,
  };

  const cardStyle = {
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
    borderRadius: '12px',
    border: `1px solid ${COLORS.border}`,
    textAlign: 'center',
  };

  const cardNumberStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  };

  const cardLabelStyle = {
    fontSize: '1rem',
    color: COLORS.textSecondary,
    fontWeight: '500',
  };

  return (
    <div style={containerStyle}>
      <nav style={navStyle}>
        <div style={titleStyle}>Admin Dashboard</div>
        <Button variant="danger" size="md" onClick={handleLogout}>
          Logout
        </Button>
      </nav>

      <div style={contentStyle}>
        <div style={welcomeStyle}>
          <h1 style={headingStyle}>Welcome, Admin!</h1>
          <p style={descStyle}>
            Logged in as: <strong>{user?.email}</strong>
          </p>
          <p style={descStyle}>
            Manage your hospital staff and operations from here.
          </p>
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.xl }}>
          Dashboard Overview
        </h2>

        <div style={gridStyle}>
          <div style={cardStyle}>
            <div style={cardNumberStyle}>12</div>
            <div style={cardLabelStyle}>Total Doctors</div>
          </div>
          <div style={cardStyle}>
            <div style={cardNumberStyle}>8</div>
            <div style={cardLabelStyle}>Receptionists</div>
          </div>
          <div style={cardStyle}>
            <div style={cardNumberStyle}>145</div>
            <div style={cardLabelStyle}>Appointments</div>
          </div>
          <div style={cardStyle}>
            <div style={cardNumberStyle}>89</div>
            <div style={cardLabelStyle}>Patients</div>
          </div>
        </div>

        <div style={{ marginTop: SPACING.xxxl }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.xl }}>
            Features Coming Soon
          </h2>
          <div style={{ ...cardStyle, textAlign: 'left' }}>
            <ul style={{ lineHeight: '2', color: COLORS.textSecondary }}>
              <li>✓ View all staff (Doctors + Receptionists)</li>
              <li>✓ Add new doctor or receptionist</li>
              <li>✓ Edit staff details</li>
              <li>✓ Activate / Deactivate users</li>
              <li>✓ Detailed staff management interface</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
