import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// ── Design tokens — same as DoctorDashboard ───────────────────
const C = {
  bg:'#F8FAFC', white:'#FFFFFF', border:'#E2E8F0', border2:'#CBD5E1',
  text:'#0F172A', text2:'#334155', text3:'#64748B', text4:'#94A3B8',
  primary:'#0F172A', blue:'#3B82F6', blueLt:'#EFF6FF', blueBd:'#BFDBFE',
  green:'#059669', greenLt:'#ECFDF5', greenBd:'#A7F3D0',
  amber:'#92400E', amberLt:'#FEF3C7', amberBd:'#FDE68A',
  red:'#DC2626', redLt:'#FEF2F2',
};

// ── Step pill ─────────────────────────────────────────────────
const StepPill = ({ n, label, active, done }) => (
  <div style={{ display:'flex', alignItems:'center', gap:'0.35rem' }}>
    <div style={{ width:22, height:22, borderRadius:'50%', display:'flex', alignItems:'center',
      justifyContent:'center', fontWeight:700, fontSize:'0.72rem', flexShrink:0,
      backgroundColor: done ? C.green : active ? C.primary : C.border2,
      color: (done||active) ? C.white : C.text3 }}>
      {done ? '✓' : n}
    </div>
    <span style={{ fontSize:'0.82rem', fontWeight: active ? 700 : 500,
      color: active ? C.text : C.text3 }}>{label}</span>
  </div>
);

const StepSep = () => (
  <div style={{ flex:1, height:1, backgroundColor:C.border, maxWidth:40 }} />
);

// ── MAIN ──────────────────────────────────────────────────────
const AppointmentPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [step,        setStep]        = useState(1);
  const [patients,    setPatients]    = useState([]);
  const [doctors,     setDoctors]     = useState([]);
  const [pSearch,     setPSearch]     = useState('');
  const [selPatient,  setSelPatient]  = useState(null);
  const [deptFilter,  setDeptFilter]  = useState('');
  const [selDoctor,   setSelDoctor]   = useState(null);
  const [aptDate,     setAptDate]     = useState(new Date().toISOString().split('T')[0]);
  const [aptTime,     setAptTime]     = useState('');
  const [avail,       setAvail]       = useState({});   // { doctorId: {available,reason,suggested_time} }
  const [checking,    setChecking]    = useState({});   // loading state per doctor
  const [booking,     setBooking]     = useState(false);
  const [result,      setResult]      = useState(null); // { success, appointment, error }
  const [conflictMsg, setConflictMsg] = useState('');
  const [banner,      setBanner]      = useState(null);

  const H = { Authorization:`Bearer ${token}` };

  const flash = useCallback((msg, ok=true) => {
    setBanner({ msg, ok });
    setTimeout(() => setBanner(null), 3500);
  }, []);

  // ── fetch ─────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const [pRes, dRes] = await Promise.all([
          fetch(`${API_URL}/patients`, { headers:H }),
          fetch(`${API_URL}/staff`,    { headers:H }),
        ]);
        const [p, d] = await Promise.all([pRes.json(), dRes.json()]);
        setPatients(Array.isArray(p) ? p : []);
        setDoctors(Array.isArray(d) ? d.filter(u=>u.role==='doctor') : []);
      } catch(e) { console.error(e); }
    })();
  }, [token]);

  // ── check availability per doctor ─────────────────────────────
  const checkOne = useCallback(async (docId) => {
    if (!aptDate || !aptTime) return;
    setChecking(prev => ({ ...prev, [docId]:true }));
    try {
      const res = await fetch(
        `${API_URL}/appointments/availability?doctor_id=${docId}&date=${aptDate}&time=${encodeURIComponent(aptTime)}`,
        { headers:H }
      );
      const data = await res.json();
      setAvail(prev => ({ ...prev, [docId]: data }));
    } catch(e) { console.error(e); }
    setChecking(prev => ({ ...prev, [docId]:false }));
  }, [aptDate, aptTime, token]);

  useEffect(() => {
    if (!aptDate || !aptTime || doctors.length===0) return;
    doctors.forEach(d => checkOne(d.id));
  }, [aptDate, aptTime, doctors, checkOne]);

  // ── book ──────────────────────────────────────────────────────
  const handleBook = async () => {
    if (!selPatient||!selDoctor||!aptDate||!aptTime) {
      flash('Please complete all fields', false); return;
    }
    setBooking(true); setConflictMsg('');
    try {
      const res = await fetch(`${API_URL}/appointments`, {
        method:'POST',
        headers:{ 'Content-Type':'application/json', ...H },
        body: JSON.stringify({ patient_id:selPatient.id, doctor_id:selDoctor.id,
          date:aptDate, time:aptTime, department:deptFilter||'General Medicine',
          reason:selPatient.symptoms||'General checkup' }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.conflict) setConflictMsg(data.error);
        else flash(data.error||'Booking failed', false);
        setResult({ success:false, error:data.error });
      } else {
        setResult({ success:true, appointment:data });
        flash('Appointment booked!');
      }
    } catch(e) { flash(e.message, false); }
    setBooking(false);
  };

  const reset = () => {
    setStep(1); setSelPatient(null); setSelDoctor(null);
    setAptTime(''); setResult(null); setConflictMsg(''); setPSearch('');
  };

  // ── derived ───────────────────────────────────────────────────
  const filtPats = patients.filter(p => {
    if (!pSearch.trim()) return true;
    const q = pSearch.toLowerCase();
    return p.name?.toLowerCase().includes(q)||p.phone?.includes(q)||p.id?.toLowerCase().includes(q);
  });
  const filtDocs = deptFilter
    ? doctors.filter(d=>(d.department||'').toLowerCase().includes(deptFilter.toLowerCase()))
    : doctors;

  // ── input style ───────────────────────────────────────────────
  const inp = (extra={}) => ({
    width:'100%', padding:'0.45rem 0.7rem', border:`1px solid ${C.border2}`, borderRadius:5,
    fontSize:'0.875rem', outline:'none', fontFamily:'inherit',
    backgroundColor:C.white, color:C.text, boxSizing:'border-box', ...extra,
  });
  const lbl = { fontSize:'0.76rem', fontWeight:600, color:C.text3,
    display:'block', marginBottom:3, textTransform:'uppercase', letterSpacing:'0.3px' };

  // ─────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:'100vh', backgroundColor:C.bg, color:C.text,
      fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>

      {/* Header */}
      <header style={{ backgroundColor:C.white, borderBottom:`1px solid ${C.border}`,
        padding:'0.75rem 2rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
          <div style={{ width:28, height:28, borderRadius:4, backgroundColor:C.primary, color:C.white,
            display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'0.8rem' }}>AH</div>
          <div>
            <span style={{ fontSize:'0.95rem', fontWeight:700, color:C.text }}>Aether Hospital</span>
            <span style={{ color:C.text4, margin:'0 0.5rem' }}>|</span>
            <span style={{ fontSize:'0.85rem', color:C.text3 }}>Book Appointment</span>
          </div>
        </div>
        <button onClick={() => navigate(-1)}
          style={{ padding:'0.4rem 0.85rem', backgroundColor:C.white, color:C.text3,
            border:`1px solid ${C.border2}`, borderRadius:5, fontSize:'0.82rem', fontWeight:500, cursor:'pointer' }}>
          ← Back
        </button>
      </header>

      {/* Banner */}
      {banner && (
        <div style={{ backgroundColor:banner.ok?C.greenLt:C.redLt, color:banner.ok?'#065F46':C.red,
          borderBottom:`1px solid ${banner.ok?C.greenBd:'#FECACA'}`,
          padding:'0.5rem 2rem', textAlign:'center', fontWeight:500, fontSize:'0.85rem' }}>
          {banner.msg}
        </div>
      )}

      <div style={{ maxWidth:860, margin:'0 auto', padding:'1.5rem 1.25rem' }}>

        {/* Steps indicator */}
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.5rem',
          backgroundColor:C.white, border:`1px solid ${C.border}`, borderRadius:8, padding:'0.85rem 1.25rem' }}>
          <StepPill n={1} label="Select Patient" active={step===1} done={step>1} />
          <StepSep />
          <StepPill n={2} label="Find Doctor" active={step===2} done={step>2} />
          <StepSep />
          <StepPill n={3} label="Confirm" active={step===3} done={result?.success} />
        </div>

        {/* ════ STEP 1 ════ */}
        {step === 1 && (
          <div style={{ backgroundColor:C.white, border:`1px solid ${C.border}`,
            borderRadius:8, overflow:'hidden' }}>
            <div style={{ padding:'0.85rem 1rem', borderBottom:`1px solid ${C.border}`,
              backgroundColor:C.bg, fontSize:'0.85rem', fontWeight:700, color:C.text2 }}>
              Search Patient
            </div>
            <div style={{ padding:'1rem' }}>
              <input style={inp({ marginBottom:'0.85rem' })}
                placeholder="Search by name, phone, or patient ID…"
                value={pSearch} onChange={e => setPSearch(e.target.value)} autoFocus />

              {pSearch && filtPats.length===0 && (
                <div style={{ textAlign:'center', padding:'1.5rem', color:C.text4 }}>
                  <div style={{ fontSize:'1.5rem', marginBottom:4 }}>🔍</div>
                  <p style={{ fontSize:'0.85rem' }}>No patient found for "<strong>{pSearch}</strong>"</p>
                  <p style={{ fontSize:'0.8rem', marginTop:4 }}>Create the patient first from the Receptionist portal.</p>
                </div>
              )}

              <div style={{ display:'flex', flexDirection:'column', gap:'0.3rem', maxHeight:380, overflowY:'auto' }}>
                {filtPats.map(p => (
                  <div key={p.id} onClick={() => setSelPatient(p)}
                    style={{ padding:'0.7rem 0.85rem', borderRadius:6, cursor:'pointer',
                      border:`1px solid ${selPatient?.id===p.id?C.primary:C.border}`,
                      backgroundColor: selPatient?.id===p.id?C.blueLt:C.bg,
                      transition:'border-color 0.15s, background-color 0.15s',
                      display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div>
                      <div style={{ fontWeight:600, fontSize:'0.9rem', color:C.text, marginBottom:2 }}>{p.name}</div>
                      <div style={{ fontSize:'0.78rem', color:C.text3 }}>
                        {p.phone} · {p.age} yrs · {p.gender}
                      </div>
                    </div>
                    {selPatient?.id===p.id && (
                      <span style={{ fontSize:'0.78rem', fontWeight:700, color:C.blue }}>✓ Selected</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {selPatient && (
              <div style={{ padding:'0.85rem 1rem', borderTop:`1px solid ${C.border}`,
                backgroundColor:C.blueLt, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:'0.85rem', fontWeight:600, color:'#1D4ED8' }}>
                  ✓ {selPatient.name} selected
                </span>
                <div style={{ display:'flex', gap:'0.5rem' }}>
                  <button onClick={() => setSelPatient(null)}
                    style={{ padding:'0.4rem 0.85rem', backgroundColor:C.white, color:C.text2,
                      border:`1px solid ${C.border2}`, borderRadius:5, fontSize:'0.82rem', cursor:'pointer' }}>
                    Change
                  </button>
                  <button onClick={() => setStep(2)}
                    style={{ padding:'0.4rem 0.85rem', backgroundColor:C.primary, color:C.white,
                      border:'none', borderRadius:5, fontSize:'0.82rem', fontWeight:600, cursor:'pointer' }}>
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════ STEP 2 ════ */}
        {step === 2 && (
          <div>
            {/* Selected patient bar */}
            <div style={{ backgroundColor:C.blueLt, border:`1px solid ${C.blueBd}`,
              borderRadius:6, padding:'0.6rem 1rem', marginBottom:'1rem',
              display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:'0.85rem', fontWeight:600, color:'#1D4ED8' }}>
                Patient: {selPatient?.name}
              </span>
              <button onClick={() => setStep(1)}
                style={{ padding:'3px 10px', backgroundColor:C.white, color:C.text2,
                  border:`1px solid ${C.border2}`, borderRadius:4, fontSize:'0.78rem', cursor:'pointer' }}>
                Change
              </button>
            </div>

            <div style={{ backgroundColor:C.white, border:`1px solid ${C.border}`,
              borderRadius:8, overflow:'hidden' }}>
              <div style={{ padding:'0.85rem 1rem', borderBottom:`1px solid ${C.border}`,
                backgroundColor:C.bg, fontSize:'0.85rem', fontWeight:700, color:C.text2 }}>
                Choose Date, Time & Doctor
              </div>
              <div style={{ padding:'1rem' }}>
                {/* Filters */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.75rem', marginBottom:'1rem' }}>
                  <div>
                    <label style={lbl}>Department</label>
                    <select style={inp()} value={deptFilter} onChange={e=>setDeptFilter(e.target.value)}>
                      <option value="">All Departments</option>
                      {['Cardiology','Neurology','Orthopedics','General Medicine','Pediatrics','Dermatology']
                        .map(d=><option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>Date *</label>
                    <input style={inp()} type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={aptDate} onChange={e=>setAptDate(e.target.value)} />
                  </div>
                  <div>
                    <label style={lbl}>Time Slot *</label>
                    <select style={inp()} value={aptTime} onChange={e=>setAptTime(e.target.value)}>
                      <option value="">Select Time</option>
                      {['09:00 AM','10:00 AM','11:00 AM','12:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM']
                        .map(t=><option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                {/* Doctor cards */}
                <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem' }}>
                  {filtDocs.length===0 && <p style={{ color:C.text4, fontSize:'0.85rem' }}>No doctors found.</p>}
                  {filtDocs.map(doc => {
                    const av = avail[doc.id];
                    const isChecking = checking[doc.id];
                    const noInfo = !aptDate||!aptTime;
                    const canBook = av?.available===true;

                    let availEl = null;
                    if (noInfo) {
                      availEl = <span style={{ fontSize:'0.78rem', color:C.text4 }}>Select date & time to check</span>;
                    } else if (isChecking) {
                      availEl = <span style={{ fontSize:'0.78rem', color:C.text3 }}>Checking…</span>;
                    } else if (!av) {
                      availEl = <span style={{ fontSize:'0.78rem', color:C.text3 }}>—</span>;
                    } else if (canBook) {
                      availEl = (
                        <span style={{ fontSize:'0.72rem', padding:'2px 7px', borderRadius:4, fontWeight:600,
                          backgroundColor:C.greenLt, color:C.green, border:`1px solid ${C.greenBd}` }}>
                          ✓ Available at {aptTime}
                        </span>
                      );
                    } else {
                      availEl = (
                        <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', flexWrap:'wrap' }}>
                          <span style={{ fontSize:'0.72rem', padding:'2px 7px', borderRadius:4, fontWeight:600,
                            backgroundColor:C.redLt, color:C.red, border:`1px solid #FECACA` }}>
                            ✗ Unavailable
                          </span>
                          {av.suggested_time && (
                            <span style={{ fontSize:'0.72rem', padding:'2px 7px', borderRadius:4, fontWeight:600,
                              backgroundColor:C.amberLt, color:C.amber, border:`1px solid ${C.amberBd}` }}>
                              💡 Try {av.suggested_time}
                            </span>
                          )}
                        </div>
                      );
                    }

                    return (
                      <div key={doc.id} style={{ padding:'0.75rem 0.85rem', borderRadius:6,
                        border:`1px solid ${selDoctor?.id===doc.id?C.primary:canBook?C.greenBd:C.border}`,
                        backgroundColor: selDoctor?.id===doc.id?C.selected:C.bg,
                        display:'flex', justifyContent:'space-between', alignItems:'center',
                        transition:'border-color 0.15s' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.7rem' }}>
                          <div style={{ width:34, height:34, borderRadius:6, backgroundColor:C.greenLt,
                            color:C.green, display:'flex', alignItems:'center', justifyContent:'center',
                            fontWeight:700, fontSize:'1rem', flexShrink:0 }}>
                            {doc.name?.[4]||'D'}
                          </div>
                          <div>
                            <div style={{ fontWeight:600, fontSize:'0.88rem', color:C.text }}>{doc.name}</div>
                            <div style={{ fontSize:'0.76rem', color:C.text3 }}>{doc.department||'General'}</div>
                          </div>
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.65rem' }}>
                          {availEl}
                          <button
                            disabled={noInfo||!canBook}
                            onClick={() => { setSelDoctor(doc); setStep(3); setResult(null); setConflictMsg(''); }}
                            style={{ padding:'0.35rem 0.85rem', fontSize:'0.78rem', fontWeight:600, cursor:canBook?'pointer':'default',
                              border:'none', borderRadius:4, flexShrink:0,
                              backgroundColor: canBook?C.primary:C.border2,
                              color: canBook?C.white:C.text3 }}>
                            {canBook ? 'Select →' : 'Unavailable'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ STEP 3 ════ */}
        {step === 3 && (
          <div style={{ backgroundColor:C.white, border:`1px solid ${C.border}`, borderRadius:8, overflow:'hidden' }}>
            <div style={{ padding:'0.85rem 1rem', borderBottom:`1px solid ${C.border}`,
              backgroundColor:C.bg, fontSize:'0.85rem', fontWeight:700, color:C.text2 }}>
              Confirm Appointment
            </div>

            {/* Success */}
            {result?.success ? (
              <div style={{ textAlign:'center', padding:'3rem 2rem' }}>
                <div style={{ width:64, height:64, borderRadius:'50%', backgroundColor:C.greenLt,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'1.8rem', margin:'0 auto 1rem' }}>✓</div>
                <h2 style={{ margin:'0 0 0.5rem', color:C.text, fontWeight:700 }}>Appointment Confirmed!</h2>
                <p style={{ color:C.text3, marginBottom:'1.5rem', fontSize:'0.9rem' }}>
                  {selPatient?.name} → {selDoctor?.name} · {aptDate} at {aptTime}
                </p>
                <div style={{ display:'flex', gap:'0.6rem', justifyContent:'center' }}>
                  <button onClick={reset}
                    style={{ padding:'0.5rem 1.25rem', backgroundColor:C.primary, color:C.white,
                      border:'none', borderRadius:5, fontWeight:600, cursor:'pointer', fontSize:'0.88rem' }}>
                    Book Another
                  </button>
                  <button onClick={() => navigate(-1)}
                    style={{ padding:'0.5rem 1.25rem', backgroundColor:C.white, color:C.text2,
                      border:`1px solid ${C.border2}`, borderRadius:5, cursor:'pointer', fontSize:'0.88rem' }}>
                    Back
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ padding:'1.25rem' }}>
                {/* Summary grid */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.65rem', marginBottom:'1.25rem' }}>
                  {[
                    ['Patient', selPatient?.name||'—'],
                    ['Patient ID', selPatient?.id||'—'],
                    ['Doctor', selDoctor?.name||'—'],
                    ['Department', selDoctor?.department||deptFilter||'General Medicine'],
                    ['Date', aptDate],
                    ['Time', aptTime],
                  ].map(([k,v]) => (
                    <div key={k} style={{ padding:'0.65rem 0.8rem', backgroundColor:C.bg,
                      borderRadius:5, border:`1px solid ${C.border}` }}>
                      <div style={{ fontSize:'0.72rem', fontWeight:600, color:C.text3,
                        textTransform:'uppercase', letterSpacing:'0.3px', marginBottom:3 }}>{k}</div>
                      <div style={{ fontWeight:700, fontSize:'0.9rem', color:C.text }}>{v}</div>
                    </div>
                  ))}
                </div>

                {/* Conflict banner */}
                {conflictMsg && (
                  <div style={{ display:'flex', alignItems:'center', gap:'0.6rem',
                    backgroundColor:C.redLt, border:`1px solid #FECACA`,
                    borderRadius:6, padding:'0.65rem 0.85rem', marginBottom:'1rem', color:C.red }}>
                    <span style={{ fontSize:'1rem' }}>⚠️</span>
                    <span style={{ fontSize:'0.85rem', fontWeight:500 }}>{conflictMsg}</span>
                  </div>
                )}

                <div style={{ display:'flex', gap:'0.6rem' }}>
                  <button onClick={() => setStep(2)}
                    style={{ padding:'0.5rem 1.1rem', backgroundColor:C.white, color:C.text2,
                      border:`1px solid ${C.border2}`, borderRadius:5, cursor:'pointer', fontSize:'0.88rem' }}>
                    ← Back
                  </button>
                  <button onClick={handleBook} disabled={booking}
                    style={{ padding:'0.5rem 1.25rem', backgroundColor:C.primary, color:C.white,
                      border:'none', borderRadius:5, fontWeight:600, cursor:'pointer', fontSize:'0.88rem' }}>
                    {booking ? 'Confirming…' : '✓ Confirm Appointment'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentPage;
