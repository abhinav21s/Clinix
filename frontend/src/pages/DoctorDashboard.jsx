import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [showMedicationToggle, setShowMedicationToggle] = useState(false);
  const [medicationText, setMedicationText] = useState('');
  const [viewingPastVisitIndex, setViewingPastVisitIndex] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const selectedPatientIdRef = useRef(selectedPatientId);
  selectedPatientIdRef.current = selectedPatientId;

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    fetchPatients(true);

    const interval = setInterval(() => {
      fetchPatients(false);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const fetchPatients = async (isInitial = false) => {
    try {
      const res = await fetch(`${API_URL}/patients`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setPatients(list);

      if (isInitial && list.length > 0) {
        const first = list.find(p => p.status === 'waiting') || list[0];
        if (first) {
          setSelectedPatientId(first.id);
          setDoctorNotes(first.notes || '');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || null;

  const handleSelectPatient = (patient) => {
    setSelectedPatientId(patient.id);
    setDoctorNotes(patient.notes || '');
    setMedicationText(patient.medication || '');
    setShowMedicationToggle(Boolean(patient.medication));
    setViewingPastVisitIndex(null);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!selectedPatient) return;

    if (!doctorNotes.trim() && !medicationText.trim()) {
      alert('Please enter consultation notes or medication details before saving.');
      return;
    }

    const medicationVal = showMedicationToggle ? medicationText.trim() : '';
    const notesVal = doctorNotes.trim();

    try {
      setSaving(true);
      const res = await fetch(`${API_URL}/patients/${selectedPatient.id}/consultation`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          notes: notesVal,
          medication: medicationVal,
          diagnosis: 'OPD Clinical Assessment',
          status: 'completed'
        })
      });

      if (!res.ok) throw new Error('Failed to save consultation');

      setMessage(`Record saved for ${selectedPatient.name}`);
      setTimeout(() => setMessage(null), 3000);

      const updatedRes = await fetch(`${API_URL}/patients`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedList = await updatedRes.json();
      setPatients(Array.isArray(updatedList) ? updatedList : []);

      // Auto-advance to next waiting patient
      const nextWaiting = (Array.isArray(updatedList) ? updatedList : []).find(
        p => p.status === 'waiting' && p.id !== selectedPatient.id
      );

      if (nextWaiting) {
        setSelectedPatientId(nextWaiting.id);
        setDoctorNotes(nextWaiting.notes || '');
        setMedicationText(nextWaiting.medication || '');
        setShowMedicationToggle(Boolean(nextWaiting.medication));
        setViewingPastVisitIndex(null);
      }
    } catch (err) {
      alert('Error saving record: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const waitingCount = patients.filter(p => p.status === 'waiting').length;
  const pastVisits = selectedPatient?.visits || [];

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
              Doctor Consultation
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', color: '#475569' }}>
            Attending: <strong style={{ color: '#0F172A' }}>{user?.name || 'Physician'}</strong>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.4rem 0.85rem',
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

      {/* Notification Banner */}
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

      {/* Main 2-Column Interface */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '1.25rem',
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        gap: '1.25rem',
        boxSizing: 'border-box'
      }}>
        {/* LEFT: Patient Queue */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 105px)'
        }}>
          <div style={{
            padding: '0.85rem 1rem',
            borderBottom: '1px solid #E2E8F0',
            backgroundColor: '#F8FAFC',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155' }}>
              Patient Queue ({patients.length})
            </span>
            <span style={{
              fontSize: '0.72rem',
              color: '#64748B',
              backgroundColor: '#FFFFFF',
              padding: '2px 7px',
              borderRadius: '4px',
              border: '1px solid #E2E8F0',
              fontWeight: '500'
            }}>
              {waitingCount} waiting
            </span>
          </div>

          <div style={{ overflowY: 'auto', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
            {patients.map((p) => {
              const isSelected = selectedPatient?.id === p.id;
              const isDone = p.status === 'completed';

              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectPatient(p)}
                  style={{
                    padding: '0.75rem 0.85rem',
                    borderRadius: '6px',
                    backgroundColor: isSelected ? '#F1F5F9' : '#FFFFFF',
                    border: `1px solid ${isSelected ? '#94A3B8' : '#E2E8F0'}`,
                    cursor: 'pointer',
                    transition: 'border-color 0.15s, background-color 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.9rem', color: '#0F172A' }}>
                      {p.name}
                    </span>
                    <span style={{
                      fontSize: '0.7rem',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: '500',
                      backgroundColor: isDone ? '#ECFDF5' : '#FEF3C7',
                      color: isDone ? '#065F46' : '#92400E',
                      border: `1px solid ${isDone ? '#A7F3D0' : '#FDE68A'}`
                    }}>
                      {isDone ? 'Treated' : 'Waiting'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.76rem', color: '#64748B', marginBottom: '0.3rem' }}>
                    {p.age} yrs • {p.gender}
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.symptoms}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Selected Patient Workspace */}
        {selectedPatient ? (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '1.5rem',
            overflowY: 'auto',
            height: 'calc(100vh - 105px)',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Header / Demographics */}
            <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#0F172A' }}>
                    {selectedPatient.name}
                  </h2>
                  <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '0.25rem' }}>
                    Age: {selectedPatient.age} yrs &bull; Gender: {selectedPatient.gender} &bull; Contact: {selectedPatient.phone}
                  </div>
                </div>

                <span style={{
                  fontSize: '0.72rem',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontWeight: '600',
                  backgroundColor: selectedPatient.status === 'completed' ? '#ECFDF5' : '#FEF3C7',
                  color: selectedPatient.status === 'completed' ? '#065F46' : '#92400E',
                  border: `1px solid ${selectedPatient.status === 'completed' ? '#A7F3D0' : '#FDE68A'}`
                }}>
                  {selectedPatient.status === 'completed' ? 'Treated' : 'Waiting in Queue'}
                </span>
              </div>

              <div style={{
                fontSize: '0.84rem',
                color: '#334155',
                backgroundColor: '#F8FAFC',
                padding: '0.6rem 0.85rem',
                borderRadius: '6px',
                border: '1px solid #E2E8F0',
                marginTop: '0.75rem'
              }}>
                <span style={{ fontWeight: '600', color: '#475569' }}>Chief Complaint: </span>
                {selectedPatient.symptoms}
              </div>
            </div>

            {/* Past Hospital Visits (Clean Minimal Bar) */}
            {pastVisits.length > 0 && (
              <div style={{ marginBottom: '1.25rem', backgroundColor: '#F8FAFC', padding: '0.85rem', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Past Visit History ({pastVisits.length} recorded dates)
                  </span>
                  {viewingPastVisitIndex !== null && (
                    <button
                      type="button"
                      onClick={() => setViewingPastVisitIndex(null)}
                      style={{ fontSize: '0.72rem', color: '#64748B', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Hide visit details
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {pastVisits.map((v, idx) => {
                    const isActive = viewingPastVisitIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setViewingPastVisitIndex(isActive ? null : idx)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: '4px',
                          border: `1px solid ${isActive ? '#0F172A' : '#CBD5E1'}`,
                          backgroundColor: isActive ? '#0F172A' : '#FFFFFF',
                          color: isActive ? '#FFFFFF' : '#334155',
                          fontSize: '0.78rem',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        {v.date}
                      </button>
                    );
                  })}
                </div>

                {/* Expanded Past Visit Details */}
                {viewingPastVisitIndex !== null && pastVisits[viewingPastVisitIndex] && (
                  <div style={{
                    marginTop: '0.75rem',
                    padding: '0.85rem',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '6px',
                    border: '1px solid #E2E8F0',
                    fontSize: '0.82rem',
                    color: '#334155'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.4rem' }}>
                      <span><strong>Doctor:</strong> {pastVisits[viewingPastVisitIndex].doctor_name}</span>
                      <span><strong>Diagnosis:</strong> {pastVisits[viewingPastVisitIndex].diagnosis || 'Consultation'}</span>
                    </div>

                    {pastVisits[viewingPastVisitIndex].medication && (
                      <div style={{ marginBottom: '0.5rem', color: '#1E40AF', backgroundColor: '#EFF6FF', padding: '0.5rem', borderRadius: '4px', border: '1px solid #DBEAFE' }}>
                        <strong>Prescription:</strong> {pastVisits[viewingPastVisitIndex].medication}
                      </div>
                    )}

                    {pastVisits[viewingPastVisitIndex].notes && (
                      <div style={{ whiteSpace: 'pre-line', color: '#475569' }}>
                        <strong>Notes:</strong> {pastVisits[viewingPastVisitIndex].notes}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Consultation Editor */}
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ marginBottom: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                  <label style={{ fontWeight: '600', fontSize: '0.85rem', color: '#0F172A' }}>
                    Consultation Notes & Clinical Assessment
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowMedicationToggle(!showMedicationToggle)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '5px',
                      border: `1px solid ${showMedicationToggle ? '#94A3B8' : '#CBD5E1'}`,
                      backgroundColor: showMedicationToggle ? '#F1F5F9' : '#FFFFFF',
                      color: '#334155',
                      fontSize: '0.78rem',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    {showMedicationToggle ? 'Remove Medication Field' : '+ Add Medication Details'}
                  </button>
                </div>

                <textarea
                  rows={showMedicationToggle ? "7" : "12"}
                  placeholder="Enter diagnosis, clinical findings, examination notes, and patient advice..."
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  required={!showMedicationToggle || !medicationText}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    minHeight: showMedicationToggle ? '140px' : '220px',
                    resize: 'vertical',
                    color: '#0F172A'
                  }}
                />
              </div>

              {/* Toggled Medication Field */}
              {showMedicationToggle && (
                <div style={{
                  marginBottom: '1.25rem',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '6px',
                  padding: '0.85rem'
                }}>
                  <div style={{ marginBottom: '0.4rem', fontSize: '0.82rem', fontWeight: '600', color: '#334155' }}>
                    Prescribed Medication & Dosage
                  </div>
                  <textarea
                    rows="4"
                    placeholder="e.g.&#10;1. Amlodipine 5mg - 1 tab daily (morning)&#10;2. Paracetamol 650mg - 1 tab SOS for fever"
                    value={medicationText}
                    onChange={(e) => setMedicationText(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #CBD5E1',
                      borderRadius: '5px',
                      fontSize: '0.88rem',
                      lineHeight: '1.45',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      backgroundColor: '#FFFFFF',
                      color: '#0F172A',
                      minHeight: '90px'
                    }}
                  />
                </div>
              )}

              {/* Submit Action */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', paddingTop: '0.75rem' }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: '0.65rem 1.4rem',
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: '600',
                    fontSize: '0.88rem',
                    cursor: saving ? 'not-allowed' : 'pointer'
                  }}
                >
                  {saving ? 'Saving...' : 'Save & Next Patient'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '3rem',
            textAlign: 'center',
            color: '#64748B',
            fontSize: '0.9rem'
          }}>
            Select a patient from the queue to start consultation.
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
