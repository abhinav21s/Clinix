import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS, SPACING } from '../styles/colors';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [staff, setStaff] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'doctor',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/staff`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStaff(data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch staff');
      setLoading(false);
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.email || !formData.role) {
      setError('All fields required');
      return;
    }

    if (!editingId && !formData.password) {
      setError('Password required for new staff');
      return;
    }

    try {
      if (editingId) {
        const res = await fetch(`${API_URL}/staff/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            role: formData.role,
            is_active: true,
          }),
        });
        if (!res.ok) throw new Error('Failed to update');
        setSuccess('Staff updated successfully');
      } else {
        const res = await fetch(`${API_URL}/staff`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to add');
        setSuccess('Staff added successfully');
      }
      setFormData({ name: '', email: '', password: '', role: 'doctor' });
      setEditingId(null);
      setShowAddForm(false);
      fetchStaff();
    } catch (err) {
      setError(err.message || 'Failed to save staff');
    }
  };

  const handleDeleteStaff = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        const res = await fetch(`${API_URL}/staff/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to delete');
        setSuccess('Staff deleted successfully');
        fetchStaff();
      } catch (err) {
        setError('Failed to delete staff');
      }
    }
  };

  const doctorCount = staff.filter(s => s.role === 'doctor').length;
  const receptionistCount = staff.filter(s => s.role === 'receptionist').length;

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#F7F8FA',
  };

  const navStyle = {
    backgroundColor: COLORS.surface,
    borderBottom: `1px solid ${COLORS.border}`,
    padding: `${SPACING.lg} ${SPACING.xl}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  };

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: COLORS.primary,
  };

  const contentStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: SPACING.xl,
  };

  const statsContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: SPACING.lg,
    marginBottom: SPACING.xl,
  };

  const statCardStyle = {
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
    borderRadius: '12px',
    border: `1px solid ${COLORS.border}`,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    textAlign: 'center',
  };

  const statNumberStyle = (color) => ({
    fontSize: '3rem',
    fontWeight: '700',
    color: color,
    marginBottom: SPACING.md,
  });

  const statLabelStyle = {
    fontSize: '1rem',
    color: COLORS.textSecondary,
    fontWeight: '500',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  };

  const formStyle = {
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
    borderRadius: '12px',
    border: `1px solid ${COLORS.border}`,
    marginBottom: SPACING.xl,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  };

  const gridFormStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: SPACING.lg,
    marginBottom: SPACING.lg,
  };

  const inputStyle = {
    padding: `${SPACING.md} ${SPACING.lg}`,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: COLORS.surface,
    borderRadius: '12px',
    overflow: 'hidden',
    border: `1px solid ${COLORS.border}`,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  };

  const thStyle = {
    backgroundColor: COLORS.primary,
    color: COLORS.surface,
    padding: SPACING.md,
    textAlign: 'left',
    fontWeight: '600',
  };

  const tdStyle = {
    padding: SPACING.md,
    borderBottom: `1px solid ${COLORS.border}`,
  };

  const alertStyle = (type) => ({
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: '8px',
    backgroundColor: type === 'error' ? '#FEE' : '#EFE',
    color: type === 'error' ? COLORS.error : COLORS.success,
    fontWeight: '500',
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={containerStyle}>
      <nav style={navStyle}>
        <div style={titleStyle}>🏥 Aether Hospital Admin</div>
        <Button variant="danger" size="md" onClick={handleLogout}>
          Logout
        </Button>
      </nav>

      <div style={contentStyle}>
        {error && <div style={alertStyle('error')}>{error}</div>}
        {success && <div style={alertStyle('success')}>{success}</div>}

        {/* Stats Section */}
        <div style={statsContainerStyle}>
          <div style={statCardStyle}>
            <div style={statNumberStyle('#0066FF')}>{doctorCount}</div>
            <div style={statLabelStyle}>Total Doctors</div>
          </div>
          <div style={statCardStyle}>
            <div style={statNumberStyle('#FF6B35')}>{receptionistCount}</div>
            <div style={statLabelStyle}>Total Receptionists</div>
          </div>
          <div style={statCardStyle}>
            <div style={statNumberStyle('#00AA55')}>{staff.length}</div>
            <div style={statLabelStyle}>Total Staff</div>
          </div>
        </div>

        {/* Header with Add Button */}
        <div style={headerStyle}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: COLORS.textPrimary }}>
            Staff Management
          </h2>
          {!showAddForm && (
            <Button variant="primary" size="md" onClick={() => setShowAddForm(true)}>
              + Add Staff
            </Button>
          )}
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <form style={formStyle} onSubmit={handleAddStaff}>
            <h3 style={{ marginBottom: SPACING.lg, color: COLORS.textPrimary, fontSize: '1.3rem' }}>
              {editingId ? '✏️ Edit Staff' : '➕ Add New Staff'}
            </h3>
            <div style={gridFormStyle}>
              <input
                type="text"
                placeholder="Full Name"
                style={inputStyle}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                style={inputStyle}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              {!editingId && (
                <input
                  type="password"
                  placeholder="Password"
                  style={inputStyle}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              )}
              <select
                style={inputStyle}
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="doctor">Doctor</option>
                <option value="receptionist">Receptionist</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: SPACING.lg }}>
              <Button variant="primary" size="md" type="submit">
                {editingId ? 'Update' : 'Add'} Staff
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingId(null);
                  setFormData({ name: '', email: '', password: '', role: 'doctor' });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* Staff Table */}
        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: SPACING.xl, color: COLORS.textSecondary }}>
              Loading staff...
            </div>
          ) : (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>👤 Name</th>
                  <th style={thStyle}>📧 Email</th>
                  <th style={thStyle}>👨‍⚕️ Role</th>
                  <th style={thStyle}>✅ Status</th>
                  <th style={thStyle}>⚙️ Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ ...tdStyle, textAlign: 'center', padding: SPACING.xl, color: COLORS.textSecondary }}>
                      No staff members yet. Click "+ Add Staff" to get started.
                    </td>
                  </tr>
                ) : (
                  staff.map((member) => (
                    <tr key={member.id} style={{ transition: 'background-color 0.2s' }}>
                      <td style={tdStyle}>
                        <span style={{ fontWeight: '500' }}>{member.name}</span>
                      </td>
                      <td style={tdStyle}>{member.email}</td>
                      <td style={tdStyle}>
                        <span style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          backgroundColor: member.role === 'doctor' ? '#E3F2FD' : '#FFF3E0',
                          color: member.role === 'doctor' ? '#1976D2' : '#F57C00',
                          fontWeight: '600',
                          fontSize: '0.9rem',
                        }}>
                          {member.role === 'doctor' ? '👨‍⚕️ Doctor' : '📞 Receptionist'}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          backgroundColor: member.is_active ? '#E8F5E9' : '#FFEBEE',
                          color: member.is_active ? '#2E7D32' : '#C62828',
                          fontWeight: '500',
                          fontSize: '0.9rem',
                        }}>
                          {member.is_active ? '🟢 Active' : '🔴 Inactive'}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => {
                            setEditingId(member.id);
                            setFormData({
                              name: member.name,
                              email: member.email,
                              password: '',
                              role: member.role,
                            });
                            setShowAddForm(true);
                          }}
                          style={{
                            padding: '6px 14px',
                            marginRight: SPACING.sm,
                            backgroundColor: '#2196F3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '500',
                            fontSize: '0.9rem',
                            transition: 'background-color 0.2s',
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#1976D2'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#2196F3'}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteStaff(member.id)}
                          style={{
                            padding: '6px 14px',
                            backgroundColor: '#F44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '500',
                            fontSize: '0.9rem',
                            transition: 'background-color 0.2s',
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#D32F2F'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#F44336'}
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
