import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

//  Design tokens (matching DoctorDashboard exactly) 
const C = {
  bg:       '#F8FAFC',
  white:    '#FFFFFF',
  border:   '#E2E8F0',
  border2:  '#CBD5E1',
  text:     '#0F172A',
  text2:    '#334155',
  text3:    '#64748B',
  text4:    '#94A3B8',
  primary:  '#0F172A',
  blue:     '#3B82F6',
  blueLt:   '#EFF6FF',
  green:    '#059669',
  greenLt:  '#ECFDF5',
  greenBd:  '#A7F3D0',
  amber:    '#92400E',
  amberLt:  '#FEF3C7',
  amberBd:  '#FDE68A',
  red:      '#DC2626',
  redLt:    '#FEF2F2',
  purple:   '#7C3AED',
  purpleLt: '#F5F3FF',
  hover:    '#F1F5F9',
  selected: '#F1F5F9',
};

//  Small reusable pieces 
const StatusPill = ({ status }) => {
  const map = {
    waiting:    { bg: C.amberLt, color: C.amber,  bd: C.amberBd,  label: 'Waiting'    },
    confirmed:  { bg: C.blueLt,  color: '#1D4ED8', bd: '#BFDBFE', label: 'Confirmed'  },
    'checked-in':{ bg: C.greenLt,color: '#065F46', bd: C.greenBd,  label: 'Checked In'},
    completed:  { bg: C.greenLt, color: '#065F46', bd: C.greenBd,  label: 'Treated'   },
    cancelled:  { bg: C.redLt,   color: C.red,     bd: '#FECACA',  label: 'Cancelled' },
  };
  const s = map[status] || { bg: '#F1F5F9', color: C.text3, bd: C.border, label: status };
  return (
    <span style={{ fontSize:'0.72rem', padding:'2px 7px', borderRadius:4, fontWeight:600,
      backgroundColor:s.bg, color:s.color, border:`1px solid ${s.bd}` }}>
      {s.label}
    </span>
  );
};

const SectionHeader = ({ title, right }) => (
  <div style={{ padding:'0.85rem 1rem', borderBottom:`1px solid ${C.border}`,
    backgroundColor:C.bg, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
    <span style={{ fontSize:'0.85rem', fontWeight:700, color:C.text2 }}>{title}</span>
    {right}
  </div>
);

const Pill = ({ text, color='#3B82F6', bg='#EFF6FF', bd='#BFDBFE' }) => (
  <span style={{ fontSize:'0.72rem', padding:'2px 8px', borderRadius:4, fontWeight:600,
    backgroundColor:bg, color, border:`1px solid ${bd}` }}>{text}</span>
);

const StatCard = ({ value, label, color='#0F172A' }) => (
  <div style={{ backgroundColor:C.white, border:`1px solid ${C.border}`, borderRadius:6,
    padding:'1rem 1.25rem', textAlign:'center' }}>
    <div style={{ fontSize:'1.8rem', fontWeight:700, color, lineHeight:1 }}>{value}</div>
    <div style={{ fontSize:'0.78rem', color:C.text3, marginTop:4 }}>{label}</div>
  </div>
);

//  MAIN COMPONENT 
const ReceptionistDashboard = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  const [tab,             setTab]             = useState('patients');   // patients | checkin | queue
  const [patients,        setPatients]        = useState([]);
  const [doctors,         setDoctors]         = useState([]);
  const [queue,           setQueue]           = useState([]);
  const [selectedId,      setSelectedId]      = useState(null);
  const [search,          setSearch]          = useState('');
  const [showCreate,      setShowCreate]      = useState(false);
  const [deptFilter,      setDeptFilter]      = useState('');
  const [docSearch,       setDocSearch]       = useState('');
  const [banner,          setBanner]          = useState(null);
  const [loading,         setLoading]         = useState(false);
  const [newP,            setNewP]            = useState({ name:'', phone:'', age:'', gender:'Male', symptoms:'', doctor_id:'' });

  const H = { Authorization:`Bearer ${token}` };

  const flash = useCallback((msg, ok=true) => {
    setBanner({ msg, ok });
    setTimeout(() => setBanner(null), 3500);
  }, []);

  const load = useCallback(async () => {
    try {
      const [pRes, dRes, qRes] = await Promise.all([
        fetch(`${API_URL}/patients`,           { headers:H }),
        fetch(`${API_URL}/receptionist/doctors`, { headers:H }),
        fetch(`${API_URL}/receptionist/queue`, { headers:H }),
      ]);
      const [p, d, q] = await Promise.all([pRes.json(), dRes.json(), qRes.ok ? qRes.json() : []]);
      setPatients(Array.isArray(p) ? p : []);
      setDoctors(Array.isArray(d) ? d.filter(u => u.role==='doctor') : []);
      setQueue(Array.isArray(q) ? q : []);
    } catch(e) { console.error(e); }
  }, [token]);

  useEffect(() => {
    load();
    const iv = setInterval(load, 5000);
    return () => clearInterval(iv);
  }, [load]);

  //  derived 
  const filtered = patients.filter(p => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return p.name?.toLowerCase().includes(q) || p.phone?.includes(q) || p.id?.toLowerCase().includes(q);
  });

  const filteredDocs = doctors.filter(d => {
    const mD = !deptFilter || (d.department||'').toLowerCase().includes(deptFilter.toLowerCase());
    const mN = !docSearch.trim() || d.name?.toLowerCase().includes(docSearch.toLowerCase());
    return mD && mN;
  });

  const selected  = patients.find(p => p.id === selectedId) || null;
  const waiting   = patients.filter(p => p.status==='waiting' || p.status==='confirmed').length;
  const checkedIn = patients.filter(p => p.status==='checked-in').length;
  const done      = patients.filter(p => p.status==='completed').length;

  //  actions 
  const handleCheckin = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/receptionist/checkin/${id}`, { method:'POST', headers:H });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      flash('Patient checked in and added to queue!');
      await load();
    } catch(e) { flash(e.message, false); }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!newP.name.trim() || !newP.doctor_id) { flash('Name and doctor are required', false); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/patients`, {
        method:'POST', headers:{ 'Content-Type':'application/json', ...H },
        body: JSON.stringify(newP),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      flash(`Patient "${data.name}" created!`);
      setShowCreate(false);
      setNewP({ name:'', phone:'', age:'', gender:'Male', symptoms:'', doctor_id:'' });
      await load();
    } catch(e) { flash(e.message, false); }
    setLoading(false);
  };

  //  shared layout pieces 
  const inputStyle = {
    width:'100%', padding:'0.45rem 0.7rem',
    border:`1px solid ${C.border2}`, borderRadius:5,
    fontSize:'0.875rem', outline:'none', fontFamily:'inherit',
    backgroundColor:C.white, color:C.text, boxSizing:'border-box',
  };

  const labelStyle = { fontSize:'0.76rem', fontWeight:600, color:C.text3,
    display:'block', marginBottom:3, textTransform:'uppercase', letterSpacing:'0.3px' };

  //  PANELS 

  /* Left panel: patient list */
  const LeftPanel = () => (
    <div style={{ backgroundColor:C.white, border:`1px solid ${C.border}`, borderRadius:8,
      overflow:'hidden', display:'flex', flexDirection:'column', height:'calc(100vh - 105px)' }}>
      <SectionHeader
        title={`Patients (${filtered.length})`}
        right={
          <button onClick={() => { setShowCreate(true); setSelectedId(null); }}
            style={{ padding:'3px 10px', backgroundColor:C.primary, color:C.white,
              border:'none', borderRadius:4, fontSize:'0.78rem', fontWeight:600, cursor:'pointer' }}>
            + New
          </button>
        }
      />
      {/* Search */}
      <div style={{ padding:'0.6rem 0.75rem', borderBottom:`1px solid ${C.border}` }}>
        <input style={{ ...inputStyle, padding:'0.4rem 0.65rem' }}
          placeholder="Search name, phone, ID..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {/* List */}
      <div style={{ overflowY:'auto', flex:1, padding:'0.4rem', display:'flex', flexDirection:'column', gap:'0.3rem' }}>
        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'2rem', color:C.text4, fontSize:'0.85rem' }}>
            {search ? 'No results found' : 'No patients yet'}
          </div>
        )}
        {filtered.map(p => (
          <div key={p.id} onClick={() => { setSelectedId(p.id); setShowCreate(false); }}
            style={{ padding:'0.7rem 0.85rem', borderRadius:6, cursor:'pointer',
              backgroundColor: selectedId===p.id ? C.selected : C.white,
              border:`1px solid ${selectedId===p.id ? C.border2 : C.border}`,
              transition:'border-color 0.15s, background-color 0.15s' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:2 }}>
              <span style={{ fontWeight:600, fontSize:'0.9rem', color:C.text }}>{p.name}</span>
              <StatusPill status={p.status} />
            </div>
            <div style={{ fontSize:'0.76rem', color:C.text3, marginBottom:2 }}>{p.age} yrs - {p.gender}</div>
            <div style={{ fontSize:'0.78rem', color:C.text2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {p.symptoms || 'General checkup'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* Right panel: detail or create form */
  const RightPanel = () => {
    if (showCreate) return (
      <div style={{ backgroundColor:C.white, border:`1px solid ${C.border}`, borderRadius:8, overflow:'hidden' }}>
        <SectionHeader title="Create New Patient"
          right={<button onClick={() => setShowCreate(false)}
            style={{ background:'none', border:'none', cursor:'pointer', color:C.text3, fontSize:'1.1rem' }}>X</button>}
        />
        <div style={{ padding:'1.25rem' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.85rem', marginBottom:'0.85rem' }}>
            {[['Full Name *', 'name', 'text', 'Patient name'],
              ['Phone', 'phone', 'tel', '10-digit number'],
              ['Age', 'age', 'number', 'Age in years'],
            ].map(([lbl, key, type, ph]) => (
              <div key={key}>
                <label style={labelStyle}>{lbl}</label>
                <input style={inputStyle} type={type} placeholder={ph}
                  value={newP[key]} onChange={e => setNewP(v => ({ ...v, [key]:e.target.value }))} />
              </div>
            ))}
            <div>
              <label style={labelStyle}>Gender</label>
              <select style={inputStyle} value={newP.gender} onChange={e => setNewP(v => ({ ...v, gender:e.target.value }))}>
                {['Male','Female','Other'].map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom:'0.85rem' }}>
            <label style={labelStyle}>Symptoms / Reason</label>
            <textarea style={{ ...inputStyle, minHeight:70, resize:'vertical' }}
              placeholder="Describe symptoms or reason for visit"
              value={newP.symptoms} onChange={e => setNewP(v => ({ ...v, symptoms:e.target.value }))} />
          </div>
          <div style={{ marginBottom:'1.25rem' }}>
            <label style={labelStyle}>Assign Doctor *</label>
            <select style={inputStyle} value={newP.doctor_id} onChange={e => setNewP(v => ({ ...v, doctor_id:e.target.value }))}>
              <option value="">- Select Doctor -</option>
              {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div style={{ display:'flex', gap:'0.6rem' }}>
            <button onClick={handleCreate} disabled={loading}
              style={{ padding:'0.5rem 1.25rem', backgroundColor:C.primary, color:C.white,
                border:'none', borderRadius:5, fontWeight:600, cursor:'pointer', fontSize:'0.88rem' }}>
              {loading ? 'Creating...' : 'Create Patient'}
            </button>
            <button onClick={() => setShowCreate(false)}
              style={{ padding:'0.5rem 1.25rem', backgroundColor:C.white, color:C.text2,
                border:`1px solid ${C.border2}`, borderRadius:5, cursor:'pointer', fontSize:'0.88rem' }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );

    if (!selected) return (
      <div style={{ backgroundColor:C.white, border:`1px solid ${C.border}`, borderRadius:8,
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        height:'calc(100vh - 105px)', color:C.text4, textAlign:'center', padding:'2rem' }}>
        <div style={{ fontSize:'3rem', marginBottom:'0.75rem' }}></div>
        <p style={{ marginBottom:'0.3rem', fontWeight:500 }}>Select a patient to view their record</p>
        <p style={{ fontSize:'0.82rem' }}>or create a new one</p>
      </div>
    );

    const p = selected;
    return (
      <div style={{ backgroundColor:C.white, border:`1px solid ${C.border}`, borderRadius:8,
        overflow:'hidden', height:'calc(100vh - 105px)', display:'flex', flexDirection:'column' }}>
        {/* Header */}
        <div style={{ padding:'1rem 1.25rem', borderBottom:`1px solid ${C.border}`,
          backgroundColor:C.bg, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
            <div style={{ width:38, height:38, borderRadius:'50%', backgroundColor:C.primary,
              color:C.white, display:'flex', alignItems:'center', justifyContent:'center',
              fontWeight:700, fontSize:'1rem', flexShrink:0 }}>
              {p.name?.[0] || '?'}
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:'1rem', color:C.text }}>{p.name}</div>
              <div style={{ fontSize:'0.78rem', color:C.text3 }}>
                {p.gender} - {p.age} yrs - {p.phone}
              </div>
            </div>
          </div>
          <StatusPill status={p.status} />
        </div>

        <div style={{ overflowY:'auto', flex:1 }}>
          {/* Info rows */}
          <div style={{ padding:'1rem 1.25rem', borderBottom:`1px solid ${C.border}` }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.6rem' }}>
              {[['Doctor', p.doctor_name||'-'], ['Symptoms', p.symptoms||'-'], ['Phone', p.phone||'-'], ['Status', p.status||'-']].map(([k,v]) => (
                <div key={k} style={{ padding:'0.6rem 0.75rem', backgroundColor:C.bg,
                  borderRadius:5, border:`1px solid ${C.border}` }}>
                  <div style={{ fontSize:'0.72rem', color:C.text3, fontWeight:600, textTransform:'uppercase',
                    letterSpacing:'0.3px', marginBottom:3 }}>{k}</div>
                  <div style={{ fontSize:'0.88rem', fontWeight:600, color:C.text, overflow:'hidden',
                    textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Medical History */}
          <div style={{ padding:'1rem 1.25rem' }}>
            <div style={{ fontSize:'0.85rem', fontWeight:700, color:C.text2, marginBottom:'0.65rem' }}>
              Medical History ({p.visits?.length || 0} visits)
            </div>
            {(!p.visits || p.visits.length === 0) && (
              <p style={{ fontSize:'0.82rem', color:C.text4 }}>No previous visits on record.</p>
            )}
            {(p.visits||[]).map((v,i) => (
              <div key={i} style={{ padding:'0.75rem', borderRadius:5, border:`1px solid ${C.border}`,
                backgroundColor:C.bg, marginBottom:'0.5rem' }}>
                <div style={{ fontSize:'0.72rem', fontWeight:700, color:C.blue, marginBottom:5,
                  textTransform:'uppercase', letterSpacing:'0.3px' }}>{v.date}</div>
                <div style={{ fontSize:'0.82rem', color:C.text, marginBottom:3 }}>
                  <strong>Doctor:</strong> {v.doctor_name}
                </div>
                {v.diagnosis && <div style={{ fontSize:'0.82rem', color:C.text2 }}><strong>Diagnosis:</strong> {v.diagnosis}</div>}
                {v.medication && <div style={{ fontSize:'0.82rem', color:C.text2 }}><strong>Medication:</strong> {v.medication}</div>}
                {v.notes && <div style={{ fontSize:'0.82rem', color:C.text3, marginTop:4, fontStyle:'italic' }}>{v.notes}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Action footer */}
        <div style={{ padding:'0.85rem 1.25rem', borderTop:`1px solid ${C.border}`, backgroundColor:C.bg }}>
          {(p.status==='waiting'||p.status==='confirmed') && (
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
              <button onClick={() => handleCheckin(p.id)} disabled={loading}
                style={{ padding:'0.5rem 1.1rem', backgroundColor:C.green, color:C.white,
                  border:'none', borderRadius:5, fontWeight:600, cursor:'pointer', fontSize:'0.88rem' }}>
                {loading ? 'Checking in...' : ' Check-in Patient'}
              </button>
              <span style={{ fontSize:'0.8rem', color:C.text3 }}>Adds patient to doctor queue</span>
            </div>
          )}
          {p.status==='checked-in' && (
            <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
              <span style={{ fontSize:'0.85rem', color:C.green, fontWeight:600 }}> Already checked in</span>
              <span style={{ fontSize:'0.82rem', color:C.text3 }}>- In queue for {p.doctor_name}</span>
            </div>
          )}
          {p.status==='completed' && (
            <span style={{ fontSize:'0.85rem', color:C.text3, fontWeight:500 }}>
              Consultation completed by {p.doctor_name}
            </span>
          )}
        </div>
      </div>
    );
  };

  //  Check-in tab 
  const CheckInTab = () => {
    const pending    = patients.filter(p => p.status==='waiting'||p.status==='confirmed');
    const checkedInP = patients.filter(p => p.status==='checked-in');
    return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }}>
        {[
          { title:'Pending Arrival', items:pending,    showBtn:true  },
          { title:'Checked In',      items:checkedInP, showBtn:false },
        ].map(({ title, items, showBtn }) => (
          <div key={title} style={{ backgroundColor:C.white, border:`1px solid ${C.border}`,
            borderRadius:8, overflow:'hidden' }}>
            <SectionHeader title={`${title} (${items.length})`} />
            <div style={{ padding:'0.5rem', display:'flex', flexDirection:'column', gap:'0.35rem' }}>
              {items.length === 0 && (
                <div style={{ textAlign:'center', padding:'2rem', color:C.text4, fontSize:'0.85rem' }}>None</div>
              )}
              {items.map(p => (
                <div key={p.id} style={{ padding:'0.75rem 0.85rem', borderRadius:6,
                  border:`1px solid ${C.border}`, backgroundColor:C.bg }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
                    <div>
                      <div style={{ fontWeight:600, fontSize:'0.88rem', color:C.text, marginBottom:2 }}>{p.name}</div>
                      <div style={{ fontSize:'0.78rem', color:C.text3 }}>{p.doctor_name}</div>
                    </div>
                    <StatusPill status={p.status} />
                  </div>
                  {showBtn && (
                    <button onClick={() => handleCheckin(p.id)} disabled={loading}
                      style={{ marginTop:4, padding:'4px 12px', backgroundColor:C.primary, color:C.white,
                        border:'none', borderRadius:4, fontSize:'0.78rem', fontWeight:600, cursor:'pointer' }}>
                       Check-in
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  //  Queue tab 
  const QueueTab = () => {
    const byDoc = {};
    queue.forEach(e => {
      const k = e.doctor_name || 'Unknown';
      if (!byDoc[k]) byDoc[k] = [];
      byDoc[k].push(e);
    });
    return (
      <div>
        {queue.length === 0 && (
          <div style={{ backgroundColor:C.white, border:`1px solid ${C.border}`, borderRadius:8,
            padding:'3rem', textAlign:'center', color:C.text4 }}>
            <div style={{ fontSize:'2rem', marginBottom:'0.5rem' }}></div>
            No patients in queue today
          </div>
        )}
        {Object.entries(byDoc).map(([docName, entries]) => (
          <div key={docName} style={{ backgroundColor:C.white, border:`1px solid ${C.border}`,
            borderRadius:8, overflow:'hidden', marginBottom:'1rem' }}>
            <SectionHeader
              title={docName}
              right={<Pill text={`${entries.length} waiting`} />}
            />
            <div style={{ padding:'0.5rem' }}>
              {entries.map((e,i) => (
                <div key={e.id||i} style={{ display:'flex', alignItems:'center', gap:'0.75rem',
                  padding:'0.65rem 0.75rem', borderRadius:5,
                  borderBottom: i < entries.length-1 ? `1px solid ${C.border}` : 'none' }}>
                  <div style={{ width:28, height:28, borderRadius:'50%', backgroundColor:C.primary,
                    color:C.white, display:'flex', alignItems:'center', justifyContent:'center',
                    fontWeight:700, fontSize:'0.82rem', flexShrink:0 }}>
                    {i+1}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, fontSize:'0.88rem', color:C.text }}>{e.patient_name}</div>
                    <div style={{ fontSize:'0.78rem', color:C.text3 }}>{e.symptoms||'General checkup'}</div>
                  </div>
                  <StatusPill status="checked-in" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  //  Doctor search (below left panel) 
  const DoctorSearch = () => (
    <div style={{ backgroundColor:C.white, border:`1px solid ${C.border}`, borderRadius:8,
      overflow:'hidden', marginTop:'1rem' }}>
      <SectionHeader title="Find Doctor" />
      <div style={{ padding:'0.75rem' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem', marginBottom:'0.65rem' }}>
          <select style={{ ...inputStyle, padding:'0.4rem 0.65rem' }} value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}>
            <option value="">All Departments</option>
            {['Cardiology','Neurology','Orthopedics','General Medicine','Pediatrics','Dermatology']
              .map(d => <option key={d}>{d}</option>)}
          </select>
          <input style={{ ...inputStyle, padding:'0.4rem 0.65rem' }} placeholder="Doctor name..."
            value={docSearch} onChange={e => setDocSearch(e.target.value)} />
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'0.35rem' }}>
          {filteredDocs.map(d => (
            <div key={d.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
              padding:'0.5rem 0.65rem', backgroundColor:C.bg, borderRadius:5, border:`1px solid ${C.border}` }}>
              <div>
                <div style={{ fontWeight:600, fontSize:'0.85rem', color:C.text }}>{d.name}</div>
                <div style={{ fontSize:'0.75rem', color:C.text3 }}>{d.department||'General'}</div>
              </div>
              <Pill text="Available" color={C.green} bg={C.greenLt} bd={C.greenBd} />
            </div>
          ))}
          {filteredDocs.length===0 && <p style={{ color:C.text4, fontSize:'0.82rem', textAlign:'center', padding:'0.5rem' }}>No doctors found</p>}
        </div>
      </div>
    </div>
  );

  // 
  return (
    <div style={{ minHeight:'100vh', backgroundColor:C.bg, color:C.text,
      fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>

      {/* Header */}
      <header style={{ backgroundColor:C.white, borderBottom:`1px solid ${C.border}`,
        padding:'0.75rem 2rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
          <div style={{ width:28, height:28, borderRadius:4, backgroundColor:C.primary, color:C.white,
            display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'0.8rem' }}>
            AH
          </div>
          <div>
            <span style={{ fontSize:'0.95rem', fontWeight:700, color:C.text }}>Aether Hospital</span>
            <span style={{ color:C.text4, margin:'0 0.5rem' }}>|</span>
            <span style={{ fontSize:'0.85rem', color:C.text3 }}>Receptionist</span>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'1.25rem' }}>
          {/* Stats */}
          <div style={{ display:'flex', gap:'0.5rem' }}>
            {[[waiting,'Waiting'],[checkedIn,'In Queue'],[done,'Done']].map(([n,l]) => (
              <div key={l} style={{ textAlign:'center', padding:'0 0.6rem', borderLeft:`1px solid ${C.border}` }}>
                <div style={{ fontWeight:700, fontSize:'0.95rem', color:C.text }}>{n}</div>
                <div style={{ fontSize:'0.7rem', color:C.text3 }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize:'0.85rem', color:C.text2 }}>
            <strong style={{ color:C.text }}>{user?.name||'Receptionist'}</strong>
          </div>
          <button onClick={() => { logout(); navigate('/'); }}
            style={{ padding:'0.4rem 0.85rem', backgroundColor:C.white, color:C.text3,
              border:`1px solid ${C.border2}`, borderRadius:5, fontSize:'0.82rem', fontWeight:500, cursor:'pointer' }}>
            Sign Out
          </button>
        </div>
      </header>

      {/* Banner */}
      {banner && (
        <div style={{ backgroundColor: banner.ok ? C.greenLt : C.redLt,
          color: banner.ok ? '#065F46' : C.red,
          borderBottom:`1px solid ${banner.ok ? C.greenBd : '#FECACA'}`,
          padding:'0.5rem 2rem', textAlign:'center', fontWeight:500, fontSize:'0.85rem' }}>
          {banner.msg}
        </div>
      )}

      {/* Tab bar */}
      <div style={{ backgroundColor:C.white, borderBottom:`1px solid ${C.border}`,
        padding:'0 2rem', display:'flex', gap:0 }}>
        {[['patients','Patients'],['checkin','Check-in'],['queue','Queue']].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)}
            style={{ padding:'0.7rem 1.1rem', border:'none', background:'none',
              borderBottom: tab===k ? `2px solid ${C.primary}` : '2px solid transparent',
              fontSize:'0.88rem', fontWeight: tab===k ? 700 : 500,
              color: tab===k ? C.text : C.text3, cursor:'pointer',
              marginBottom:-1, fontFamily:'inherit', transition:'all 0.15s' }}>
            {l}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth:1400, margin:'0 auto', padding:'1.25rem', boxSizing:'border-box' }}>

        {tab === 'patients' && (
          <div style={{ display:'grid', gridTemplateColumns:'300px 1fr', gap:'1.25rem' }}>
            <div>
              {LeftPanel()}
              {DoctorSearch()}
            </div>
            {RightPanel()}
          </div>
        )}

        {tab === 'checkin' && (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.75rem', marginBottom:'1.25rem' }}>
              <StatCard value={patients.length} label="Total Patients" />
              <StatCard value={waiting}  label="Pending Arrival"  color="#92400E" />
              <StatCard value={checkedIn} label="In Queue"        color="#065F46" />
              <StatCard value={done}      label="Completed"       color="#1D4ED8" />
            </div>
            {CheckInTab()}
          </div>
        )}

        {tab === 'queue' && QueueTab()}
      </div>
    </div>
  );
};

export default ReceptionistDashboard;




