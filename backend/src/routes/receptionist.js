import express from 'express';
import { supabase } from '../db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// ─── Verify receptionist role ─────────────────────────────────
const verifyReceptionist = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== 'receptionist' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Receptionist access required' });
    }
    next();
  });
};

// ─── GET /api/receptionist/patients ──────────────────────────
// Search patients by name, phone, or ID
router.get('/patients', verifyReceptionist, async (req, res) => {
  try {
    const { search } = req.query;

    let query = supabase.from('appointments').select('*').order('created_at', { ascending: true });

    const { data: rows, error } = await query;
    if (error) throw error;

    const { data: doctors } = await supabase.from('users').select('id, name, email, role');
    const doctorMap = {};
    (doctors || []).forEach(d => { doctorMap[d.id] = d; });

    let patients = (rows || []).map(row => {
      let meta = {};
      try { meta = typeof row.reason === 'string' ? JSON.parse(row.reason) : (row.reason || {}); } catch (e) {}
      return {
        id:          row.id,
        name:        row.patient_name,
        phone:       row.phone,
        age:         meta.age || '—',
        gender:      meta.gender || '—',
        symptoms:    meta.symptoms || row.reason || '',
        status:      meta.status || 'waiting',
        doctor_id:   row.doctor_id,
        doctor_name: doctorMap[row.doctor_id]?.name || 'Assigned Doctor',
        visits:      meta.visits || [],
        created_at:  row.created_at,
      };
    });

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      patients = patients.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.phone?.includes(q) ||
        p.id?.toLowerCase().includes(q)
      );
    }

    res.json(patients);
  } catch (err) {
    console.error('Receptionist patients error:', err);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

// ─── POST /api/receptionist/checkin/:patientId ────────────────
// Check in a patient: update status → 'checked-in', add to queue view
router.post('/checkin/:patientId', verifyReceptionist, async (req, res) => {
  try {
    const { patientId } = req.params;

    const { data: existing, error: fetchErr } = await supabase
      .from('appointments').select('*').eq('id', patientId).single();

    if (fetchErr || !existing) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    let meta = {};
    try { meta = typeof existing.reason === 'string' ? JSON.parse(existing.reason) : (existing.reason || {}); } catch (e) {}

    if (meta.status === 'checked-in') {
      return res.status(400).json({ error: 'Patient is already checked in' });
    }
    if (meta.status === 'completed') {
      return res.status(400).json({ error: 'Appointment is already completed' });
    }

    const updatedMeta = {
      ...meta,
      status: 'checked-in',
      checked_in_at: new Date().toISOString(),
    };

    const { error: updateErr } = await supabase
      .from('appointments')
      .update({ reason: JSON.stringify(updatedMeta), updated_at: new Date().toISOString() })
      .eq('id', patientId);

    if (updateErr) throw updateErr;

    res.json({ success: true, message: 'Patient checked in successfully' });
  } catch (err) {
    console.error('Check-in error:', err);
    res.status(500).json({ error: 'Check-in failed' });
  }
});

// ─── GET /api/receptionist/queue ─────────────────────────────
// Get today's checked-in patients grouped for queue view
router.get('/queue', verifyReceptionist, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data: rows, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('appointment_date', today)
      .order('created_at', { ascending: true });

    if (error) throw error;

    const { data: doctors } = await supabase.from('users').select('id, name, role');
    const doctorMap = {};
    (doctors || []).forEach(d => { doctorMap[d.id] = d; });

    const queue = (rows || [])
      .filter(row => {
        let meta = {};
        try { meta = typeof row.reason === 'string' ? JSON.parse(row.reason) : (row.reason || {}); } catch (e) {}
        return meta.status === 'checked-in';
      })
      .map((row, idx) => {
        let meta = {};
        try { meta = typeof row.reason === 'string' ? JSON.parse(row.reason) : (row.reason || {}); } catch (e) {}
        return {
          id:           row.id,
          patient_name: row.patient_name,
          phone:        row.phone,
          doctor_id:    row.doctor_id,
          doctor_name:  doctorMap[row.doctor_id]?.name || 'Assigned Doctor',
          symptoms:     meta.symptoms || '',
          checked_in_at: meta.checked_in_at || row.created_at,
          queue_number: idx + 1,
        };
      });

    res.json(queue);
  } catch (err) {
    console.error('Queue error:', err);
    res.status(500).json({ error: 'Failed to fetch queue' });
  }
});

// ─── GET /api/receptionist/doctors ───────────────────────────
// Get list of all doctors (for search/filter)
router.get('/doctors', verifyReceptionist, async (req, res) => {
  try {
    const { dept, name } = req.query;

    let query = supabase.from('users').select('id, name, email, role, is_active').eq('role', 'doctor').eq('is_active', true);

    const { data, error } = await query;
    if (error) throw error;

    let doctors = data || [];
    if (name && name.trim()) {
      doctors = doctors.filter(d => d.name.toLowerCase().includes(name.toLowerCase()));
    }

    res.json(doctors);
  } catch (err) {
    console.error('Doctors fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

export default router;
