import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('staff'); // 'staff' | 'records'
  const [staff, setStaff] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [showAssignPatient, setShowAssignPatient] = useState(false);
  
  // Selected Patient Modal & Selected Visit Date Tab
  const [selectedPatientRecord, setSelectedPatientRecord] = useState(null);
  const [selectedVisitIndex, setSelectedVisitIndex] = useState(0);

  // Add staff form
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [staffRole, setStaffRole] = useState('doctor');

  // Assign patient form
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientAge, setPatientAge] = useState('40');
  const [patientGender, setPatientGender] = useState('Male');
  const [patientDoctorId, setPatientDoctorId] = useState('');
  const [patientSymptoms, setPatientSymptoms] = useState('');

  const [message, setMessage] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    fetchStaff();
    fetchPatients();

    const interval = setInterval(() => {
      fetchPatients();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const showMsg = (txt) => {
    setMessage(txt);
    setTimeout(() => setMessage(null), 3000);
  };

  const fetchStaff = async () => {
    try {
      const res = await fetch(`${API_URL}/staff`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setStaff(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await fetch(`${API_URL}/patients`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPatients(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenPatientRecord = (p) => {
    setSelectedPatientRecord(p);
    setSelectedVisitIndex(0);
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!staffName || !staffEmail || !staffPassword) {
      alert('All fields required');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: staffName,
          email: staffEmail,
          password: staffPassword,
          role: staffRole
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to add user');
      }

      showMsg('Staff account created successfully');
      setStaffName('');
      setStaffEmail('');
      setStaffPassword('');
      setShowAddStaff(false);
      fetchStaff();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAssignPatient = async (e) => {
    e.preventDefault();
    if (!patientName || !patientDoctorId) {
      alert('Patient name and assigned doctor are required');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/patients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: patientName,
          phone: patientPhone || '+1 555-0100',
          age: patientAge,
          gender: patientGender,
          doctor_id: patientDoctorId,
          symptoms: patientSymptoms || 'General Checkup'
        })
      });

      if (!res.ok) throw new Error('Failed to assign patient');

      showMsg('Patient assigned successfully');
      setPatientName('');
      setPatientPhone('');
      setPatientSymptoms('');
      setShowAssignPatient(false);
      fetchPatients();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteStaff = async (id) => {
    if (window.confirm('Delete this staff member?')) {
      try {
        await fetch(`${API_URL}/staff/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        showMsg('Staff member removed');
        fetchStaff();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const doctorsList = staff.filter(s => s.role === 'doctor');

  // Compute visits list for modal
  const patientVisits = selectedPatientRecord ? (
    selectedPatientRecord.visits && selectedPatientRecord.visits.length > 0
      ? selectedPatientRecord.visits
      : (
        selectedPatientRecord.notes
          ? [{
              date: 'Current Visit',
              doctor_name: selectedPatientRecord.doctor_name,
              diagnosis: 'Consultation',
              medication: selectedPatientRecord.medication || '',
              notes: selectedPatientRecord.notes
            }]
          : []
      )
  ) : [];

  const activeVisit = patientVisits[selectedVisitIndex] || null;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      color: '#0F172A',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      
      {/* Top Header */}
      <header style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '0.75rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '4px',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '0.8rem'
            }}>
              AH
            </div>
            <div>
              <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0F172A' }}>
                Aether Hospital
              </span>
              <span style={{ color: '#94A3B8', margin: '0 0.5rem' }}>|</span>
              <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                Administration
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              onClick={() => setActiveTab('staff')}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '5px',
                border: '1px solid #CBD5E1',
                backgroundColor: activeTab === 'staff' ? '#0F172A' : '#FFFFFF',
                color: activeTab === 'staff' ? '#FFFFFF' : '#475569',
                fontSize: '0.82rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Doctors & Staff ({staff.length})
            </button>
            <button
              onClick={() => setActiveTab('records')}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '5px',
                border: '1px solid #CBD5E1',
                backgroundColor: activeTab === 'records' ? '#0F172A' : '#FFFFFF',
                color: activeTab === 'records' ? '#FFFFFF' : '#475569',
                fontSize: '0.82rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Patient Records ({patients.length})
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setShowAssignPatient(true)}
            style={{
              padding: '0.45rem 0.9rem',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '5px',
              fontSize: '0.82rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            + Assign Patient
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.45rem 0.85rem',
              backgroundColor: '#FFFFFF',
              color: '#475569',
              border: '1px solid #CBD5E1',
              borderRadius: '5px',
              fontSize: '0.82rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Message */}
      {message && (
        <div style={{
          backgroundColor: '#ECFDF5',
          color: '#065F46',
          borderBottom: '1px solid #A7F3D0',
          padding: '0.5rem 2rem',
          textAlign: 'center',
          fontWeight: '500',
          fontSize: '0.85rem'
        }}>
          {message}
        </div>
      )}

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem' }}>
        
        {/* TAB 1: STAFF DIRECTORY */}
        {activeTab === 'staff' && (
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '700', color: '#0F172A' }}>Staff Directory</h2>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>Authorized physicians and hospital administration staff</div>
              </div>
              <button
                onClick={() => setShowAddStaff(true)}
                style={{
                  padding: '0.45rem 0.9rem',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '5px',
                  fontWeight: '600',
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                + Add Staff Member
              </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: '600' }}>Name</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: '600' }}>Email Address</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: '600' }}>Role</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((s) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '600', color: '#0F172A' }}>{s.name}</td>
                    <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>{s.email}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        fontSize: '0.72rem',
                        padding: '2px 7px',
                        borderRadius: '4px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em',
                        backgroundColor: s.role === 'admin' ? '#EDE9FE' : '#EFF6FF',
                        color: s.role === 'admin' ? '#5B21B6' : '#1E40AF',
                        border: `1px solid ${s.role === 'admin' ? '#DDD6FE' : '#DBEAFE'}`
                      }}>
                        {s.role}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteStaff(s.id)}
                        style={{
                          padding: '0.3rem 0.65rem',
                          backgroundColor: '#FFFFFF',
                          color: '#DC2626',
                          border: '1px solid #FECACA',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: PATIENT RECORDS TABLE */}
        {activeTab === 'records' && (
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '700', color: '#0F172A' }}>Patient Records</h2>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>Click on any record to inspect historical hospital visit dates, diagnoses, and prescriptions</div>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: '600' }}>Patient Name</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: '600' }}>Assigned Physician</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: '600' }}>Chief Complaint</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: '600' }}>Visit History</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => {
                  const visitCount = (p.visits?.length || 0) + (p.notes && !p.visits?.length ? 1 : 0);
                  const isDone = p.status === 'completed';

                  return (
                    <tr
                      key={p.id}
                      onClick={() => handleOpenPatientRecord(p)}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        cursor: 'pointer',
                        transition: 'background-color 0.12s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '0.85rem 1rem', fontWeight: '600' }}>
                        <div style={{ color: '#0F172A', fontSize: '0.9rem' }}>{p.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '400', marginTop: '2px' }}>
                          {p.age} yrs &bull; {p.gender} &bull; {p.phone}
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#334155' }}>{p.doctor_name}</td>
                      <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>{p.symptoms}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          backgroundColor: '#F1F5F9',
                          color: '#334155',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          border: '1px solid #E2E8F0',
                          fontWeight: '500'
                        }}>
                          {visitCount} {visitCount === 1 ? 'Visit Date' : 'Visit Dates'}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          fontSize: '0.72rem',
                          padding: '2px 7px',
                          borderRadius: '4px',
                          fontWeight: '600',
                          backgroundColor: isDone ? '#ECFDF5' : '#FEF3C7',
                          color: isDone ? '#065F46' : '#92400E',
                          border: `1px solid ${isDone ? '#A7F3D0' : '#FDE68A'}`
                        }}>
                          {isDone ? 'Treated' : 'Waiting'}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenPatientRecord(p);
                          }}
                          style={{
                            padding: '0.35rem 0.75rem',
                            backgroundColor: '#FFFFFF',
                            color: '#0F172A',
                            border: '1px solid #CBD5E1',
                            borderRadius: '4px',
                            fontSize: '0.78rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MULTI-DATE PATIENT RECORD MODAL */}
      {selectedPatientRecord && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 60,
          padding: '1.5rem'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.05)',
            border: '1px solid #E2E8F0'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0F172A', fontWeight: '700' }}>
                  {selectedPatientRecord.name}
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '3px' }}>
                  Age: {selectedPatientRecord.age} yrs &bull; Gender: {selectedPatientRecord.gender} &bull; Contact: {selectedPatientRecord.phone}
                </div>
              </div>
              <button
                onClick={() => setSelectedPatientRecord(null)}
                style={{
                  border: '1px solid #E2E8F0',
                  background: '#FFFFFF',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  color: '#64748B'
                }}
              >
                Close
              </button>
            </div>

            {/* Visit Dates Selector */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                Select Visit Date ({patientVisits.length} Recorded Dates)
              </div>

              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {patientVisits.length > 0 ? (
                  patientVisits.map((visit, index) => {
                    const isSelected = selectedVisitIndex === index;
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedVisitIndex(index)}
                        style={{
                          padding: '0.45rem 0.85rem',
                          borderRadius: '5px',
                          border: isSelected ? '1px solid #0F172A' : '1px solid #CBD5E1',
                          backgroundColor: isSelected ? '#0F172A' : '#F8FAFC',
                          color: isSelected ? '#FFFFFF' : '#334155',
                          fontSize: '0.82rem',
                          fontWeight: isSelected ? '600' : '400',
                          cursor: 'pointer',
                          transition: 'all 0.12s'
                        }}
                      >
                        {visit.date}
                      </button>
                    );
                  })
                ) : (
                  <div style={{ fontSize: '0.82rem', color: '#64748B', fontStyle: 'italic' }}>
                    No recorded visits found for this patient yet.
                  </div>
                )}
              </div>
            </div>

            {/* Selected Date's Details */}
            {activeVisit ? (
              <div style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '6px',
                padding: '1.25rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.65rem', marginBottom: '0.85rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', fontWeight: '600' }}>Visit Date: </span>
                    <strong style={{ fontSize: '0.9rem', color: '#0F172A' }}>{activeVisit.date}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', fontWeight: '600' }}>Attending Physician: </span>
                    <strong style={{ fontSize: '0.9rem', color: '#0F172A' }}>{activeVisit.doctor_name}</strong>
                  </div>
                </div>

                {/* Diagnosis */}
                {activeVisit.diagnosis && (
                  <div style={{ marginBottom: '0.85rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '0.2rem' }}>
                      Clinical Diagnosis
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#0F172A' }}>
                      {activeVisit.diagnosis}
                    </div>
                  </div>
                )}

                {/* Medication / Prescription */}
                {activeVisit.medication && (
                  <div style={{ marginBottom: '0.85rem', backgroundColor: '#EFF6FF', padding: '0.75rem', borderRadius: '5px', border: '1px solid #DBEAFE' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#1E40AF', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '0.25rem' }}>
                      Prescribed Medication & Dosage
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#1E3A8A', whiteSpace: 'pre-line', lineHeight: '1.5' }}>
                      {activeVisit.medication}
                    </div>
                  </div>
                )}

                {/* Doctor's Notes */}
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '0.25rem' }}>
                    Clinical Examination & Observations
                  </div>
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '5px',
                    padding: '0.85rem',
                    fontSize: '0.86rem',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-line',
                    color: '#0F172A'
                  }}>
                    {activeVisit.notes || 'No extra clinical notes recorded.'}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748B', backgroundColor: '#F8FAFC', borderRadius: '6px', fontSize: '0.85rem' }}>
                Doctor has not submitted consultation notes for this visit yet.
              </div>
            )}

            {/* Modal Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button
                onClick={() => setSelectedPatientRecord(null)}
                style={{
                  padding: '0.55rem 1.25rem',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.85rem'
                }}
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD STAFF */}
      {showAddStaff && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50
        }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '1.75rem', width: '100%', maxWidth: '420px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', color: '#0F172A', fontWeight: '700' }}>Add Staff Member</h3>
            <form onSubmit={handleAddStaff} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <input
                type="text"
                placeholder="Full Name (e.g. Dr. John Watson)"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                required
                style={{ padding: '0.65rem', border: '1px solid #CBD5E1', borderRadius: '5px', fontSize: '0.88rem' }}
              />
              <input
                type="email"
                placeholder="Email Address"
                value={staffEmail}
                onChange={(e) => setStaffEmail(e.target.value)}
                required
                style={{ padding: '0.65rem', border: '1px solid #CBD5E1', borderRadius: '5px', fontSize: '0.88rem' }}
              />
              <input
                type="password"
                placeholder="Password"
                value={staffPassword}
                onChange={(e) => setStaffPassword(e.target.value)}
                required
                style={{ padding: '0.65rem', border: '1px solid #CBD5E1', borderRadius: '5px', fontSize: '0.88rem' }}
              />
              <select
                value={staffRole}
                onChange={(e) => setStaffRole(e.target.value)}
                style={{ padding: '0.65rem', border: '1px solid #CBD5E1', borderRadius: '5px', fontSize: '0.88rem', backgroundColor: '#FFFFFF' }}
              >
                <option value="doctor">Doctor</option>
                <option value="receptionist">Receptionist</option>
                <option value="admin">Administrator</option>
              </select>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddStaff(false)}
                  style={{ padding: '0.55rem 1rem', backgroundColor: '#FFFFFF', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '5px', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.55rem 1rem', backgroundColor: '#0F172A', color: '#FFFFFF', border: 'none', borderRadius: '5px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ASSIGN PATIENT */}
      {showAssignPatient && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50
        }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '1.75rem', width: '100%', maxWidth: '440px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', color: '#0F172A', fontWeight: '700' }}>Assign Patient to Doctor</h3>
            <form onSubmit={handleAssignPatient} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <input
                type="text"
                placeholder="Patient Full Name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
                style={{ padding: '0.65rem', border: '1px solid #CBD5E1', borderRadius: '5px', fontSize: '0.88rem' }}
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                style={{ padding: '0.65rem', border: '1px solid #CBD5E1', borderRadius: '5px', fontSize: '0.88rem' }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <input
                  type="number"
                  placeholder="Age"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  style={{ padding: '0.65rem', border: '1px solid #CBD5E1', borderRadius: '5px', fontSize: '0.88rem' }}
                />
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  style={{ padding: '0.65rem', border: '1px solid #CBD5E1', borderRadius: '5px', fontSize: '0.88rem', backgroundColor: '#FFFFFF' }}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <select
                value={patientDoctorId}
                onChange={(e) => setPatientDoctorId(e.target.value)}
                required
                style={{ padding: '0.65rem', border: '1px solid #CBD5E1', borderRadius: '5px', fontSize: '0.88rem', backgroundColor: '#FFFFFF' }}
              >
                <option value="">-- Select Assigned Doctor --</option>
                {doctorsList.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))}
              </select>

              <textarea
                rows="3"
                placeholder="Reason for Visit / Symptoms"
                value={patientSymptoms}
                onChange={(e) => setPatientSymptoms(e.target.value)}
                style={{ padding: '0.65rem', border: '1px solid #CBD5E1', borderRadius: '5px', fontSize: '0.88rem', fontFamily: 'inherit' }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAssignPatient(false)}
                  style={{ padding: '0.55rem 1rem', backgroundColor: '#FFFFFF', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '5px', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.55rem 1rem', backgroundColor: '#0F172A', color: '#FFFFFF', border: 'none', borderRadius: '5px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}
                >
                  Assign to Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
