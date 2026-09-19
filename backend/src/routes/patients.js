import express from 'express';
import { supabase } from '../db.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Helper to format patient record with multi-date visit history
const formatPatientRecord = (row, doctorMap = {}, allRows = []) => {
  let meta = {};
  try {
    meta = typeof row.reason === 'string' ? JSON.parse(row.reason) : (row.reason || {});
  } catch (e) {
    meta = { symptoms: row.reason || '' };
  }

  const doctor = doctorMap[row.doctor_id] || null;
  const doctorName = doctor ? doctor.name : 'Assigned Doctor';

  // Build visits array
  let visits = Array.isArray(meta.visits) ? [...meta.visits] : [];

  // Today's visit entry
  const todayDate = row.appointment_date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  // If this record has doctor notes or is completed, ensure today's visit is at the top of visits list
  if (meta.notes || meta.status === 'completed') {
    const todayVisitIndex = visits.findIndex(v => v.date?.includes('Today') || v.date === todayDate || v.is_current);
    const currentVisitObj = {
      id: row.id,
      date: `${todayDate} (Current Visit)`,
      doctor_name: doctorName,
      diagnosis: meta.diagnosis || 'Clinical OPD Assessment',
      medication: meta.medication || '',
      notes: meta.notes || '',
      is_current: true,
      status: meta.status || 'completed'
    };

    if (todayVisitIndex >= 0) {
      visits[todayVisitIndex] = currentVisitObj;
    } else {
      visits.unshift(currentVisitObj);
    }
  }

  // Cross-reference any other appointment rows for this patient by phone/name
  if (allRows && allRows.length > 0) {
    const otherRows = allRows.filter(r => 
      r.id !== row.id &&
      (
        (r.patient_name && row.patient_name && r.patient_name.trim().toLowerCase() === row.patient_name.trim().toLowerCase()) ||
        (r.phone && row.phone && r.phone.trim() === row.phone.trim())
      )
    );

    for (const other of otherRows) {
      let otherMeta = {};
      try {
        otherMeta = typeof other.reason === 'string' ? JSON.parse(other.reason) : (other.reason || {});
      } catch (e) {}

      if (otherMeta.notes || otherMeta.status === 'completed') {
        const otherDate = other.appointment_date || 'Previous Visit';
        if (!visits.some(v => v.id === other.id)) {
          visits.push({
            id: other.id,
            date: otherDate,
            doctor_name: doctorMap[other.doctor_id]?.name || 'Attending Doctor',
            diagnosis: otherMeta.diagnosis || 'Consultation',
            medication: otherMeta.medication || '',
            notes: otherMeta.notes || '',
            is_current: false
          });
        }
      }
    }
  }

  return {
    id: row.id,
    name: row.patient_name,
    email: row.email,
    phone: row.phone,
    age: meta.age || 30,
    gender: meta.gender || 'Not specified',
    doctor_id: row.doctor_id,
    doctor_name: doctorName,
    symptoms: meta.symptoms || row.reason || 'General checkup',
    status: meta.status || 'waiting', // 'waiting' | 'completed'
    notes: meta.notes || '',
    medication: meta.medication || '',
    diagnosis: meta.diagnosis || '',
    visits: visits,
    created_at: row.created_at,
    completed_at: meta.completed_at || null,
  };
};

// GET /api/patients - fetch patients
router.get('/', verifyToken, async (req, res) => {
  try {
    const { data: doctors } = await supabase
      .from('users')
      .select('id, name, email, role');
    
    const doctorMap = {};
    if (doctors) {
      doctors.forEach(doc => { doctorMap[doc.id] = doc; });
    }

    const { data: allRows, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;

    let rows = allRows || [];
    if (req.user.role === 'doctor') {
      rows = rows.filter(r => r.doctor_id === req.user.id);
    }

    const patients = rows.map(row => formatPatientRecord(row, doctorMap, allRows));
    res.json(patients);
  } catch (error) {
    console.error('Fetch patients error:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

// POST /api/patients - Admin assigns patient to doctor
router.post('/', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'receptionist') {
    return res.status(403).json({ error: 'Access denied' });
  }
  try {
    const { name, phone, age, gender, doctor_id, symptoms, visits } = req.body;

    if (!name || !doctor_id) {
      return res.status(400).json({ error: 'Patient name and assigned doctor are required' });
    }

    const { data: doctor } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('id', doctor_id)
      .single();

    const patientMetadata = {
      age: parseInt(age) || 30,
      gender: gender || 'Male',
      symptoms: symptoms || 'General Checkup',
      status: 'waiting',
      notes: '',
      visits: Array.isArray(visits) ? visits : [],
    };

    const today = new Date().toISOString().split('T')[0];

    const { data: newRow, error } = await supabase
      .from('appointments')
      .insert([
        {
          patient_name: name,
          email: `${name.toLowerCase().replace(/\s+/g, '')}@patient.com`,
          phone: phone || '+1 555-0100',
          appointment_date: today,
          appointment_time: '10:00 AM',
          doctor_id: doctor_id,
          department: 'OPD',
          reason: JSON.stringify(patientMetadata),
          is_active: true,
        },
      ])
      .select();

    if (error) throw error;

    const doctorMap = doctor ? { [doctor.id]: doctor } : {};
    res.status(201).json(formatPatientRecord(newRow[0], doctorMap));
  } catch (error) {
    console.error('Create patient error:', error);
    res.status(500).json({ error: 'Failed to assign patient' });
  }
});

// PUT /api/patients/:id/consultation - Doctor saves notes & medication
router.put('/:id/consultation', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { notes, medication, diagnosis } = req.body;

    const { data: existing, error: fetchErr } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !existing) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    let meta = {};
    try {
      meta = typeof existing.reason === 'string' ? JSON.parse(existing.reason) : (existing.reason || {});
    } catch (e) {
      meta = {};
    }

    const { data: doctor } = existing.doctor_id 
      ? await supabase.from('users').select('id, name, email').eq('id', existing.doctor_id).single()
      : { data: null };

    const todayFormatted = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    
    // Manage visits history list
    let existingVisits = Array.isArray(meta.visits) ? [...meta.visits] : [];
    
    // Remove previous draft for today if any, and add today's finalized record
    existingVisits = existingVisits.filter(v => !v.date?.includes('Today') && !v.date?.includes('Current Visit') && v.date !== todayFormatted);
    
    const newVisitEntry = {
      id: `visit-${Date.now()}`,
      date: `${todayFormatted} (Visit)`,
      doctor_name: doctor ? doctor.name : 'Attending Doctor',
      diagnosis: diagnosis || 'Clinical Consultation',
      medication: medication || '',
      notes: notes || '',
      is_current: true
    };

    existingVisits.unshift(newVisitEntry);

    const updatedMeta = {
      ...meta,
      notes: notes || '',
      medication: medication || '',
      diagnosis: diagnosis || '',
      status: 'completed',
      visits: existingVisits,
      completed_at: new Date().toISOString(),
    };

    const { data: updated, error: updateErr } = await supabase
      .from('appointments')
      .update({
        reason: JSON.stringify(updatedMeta),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select();

    if (updateErr) throw updateErr;

    const doctorMap = doctor ? { [doctor.id]: doctor } : {};
    res.json(formatPatientRecord(updated[0], doctorMap));
  } catch (error) {
    console.error('Save consultation error:', error);
    res.status(500).json({ error: 'Failed to save consultation' });
  }
});

export default router;

