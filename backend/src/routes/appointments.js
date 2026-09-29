import express from 'express';
import { supabase } from '../db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// ─── Verify receptionist or admin ─────────────────────────────
const verifyReceptionistOrAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== 'receptionist' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Receptionist or admin access required' });
    }
    next();
  });
};

// ─── Helper: parse metadata from reason field ─────────────────
const parseMeta = (row) => {
  try {
    return typeof row.reason === 'string' ? JSON.parse(row.reason) : (row.reason || {});
  } catch { return {}; }
};

// ─── GET /api/appointments/availability ──────────────────────
// Check if a doctor is available at a given date + time
// Query params: doctor_id, date, time
router.get('/availability', verifyToken, async (req, res) => {
  try {
    const { doctor_id, date, time } = req.query;
    if (!doctor_id || !date || !time) {
      return res.status(400).json({ error: 'doctor_id, date and time are required' });
    }

    // Fetch all appointments for this doctor on this date
    const { data: rows, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('doctor_id', doctor_id)
      .eq('appointment_date', date);

    if (error) throw error;

    // Check if any non-cancelled appointment exists at this exact time
    const conflict = (rows || []).some(row => {
      const meta = parseMeta(row);
      return row.appointment_time === time && meta.status !== 'cancelled';
    });

    if (conflict) {
      // Suggest the next free slot from common time slots
      const SLOTS = ['09:00 AM','10:00 AM','11:00 AM','12:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM'];
      const bookedSlots = (rows || [])
        .filter(r => parseMeta(r).status !== 'cancelled')
        .map(r => r.appointment_time);
      const suggested = SLOTS.find(s => !bookedSlots.includes(s)) || null;

      return res.json({
        available:      false,
        reason:         `Doctor already has an appointment at ${time}`,
        suggested_time: suggested,
      });
    }

    res.json({ available: true, reason: 'Doctor is free at this time', suggested_time: null });
  } catch (err) {
    console.error('Availability check error:', err);
    res.status(500).json({ error: 'Failed to check availability' });
  }
});

// ─── POST /api/appointments ───────────────────────────────────
// Book a new appointment. Performs conflict check before saving.
router.post('/', verifyReceptionistOrAdmin, async (req, res) => {
  try {
    const { patient_id, doctor_id, date, time, department, reason } = req.body;

    if (!doctor_id || !date || !time) {
      return res.status(400).json({ error: 'doctor_id, date and time are required' });
    }

    // ── Conflict check ────────────────────────────────────────
    const { data: existing, error: checkErr } = await supabase
      .from('appointments')
      .select('*')
      .eq('doctor_id', doctor_id)
      .eq('appointment_date', date);

    if (checkErr) throw checkErr;

    const hasConflict = (existing || []).some(row => {
      const meta = parseMeta(row);
      return row.appointment_time === time && meta.status !== 'cancelled';
    });

    if (hasConflict) {
      const SLOTS = ['09:00 AM','10:00 AM','11:00 AM','12:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM'];
      const bookedSlots = (existing || [])
        .filter(r => parseMeta(r).status !== 'cancelled')
        .map(r => r.appointment_time);
      const suggested = SLOTS.find(s => !bookedSlots.includes(s)) || null;

      return res.status(409).json({
        error:    `Doctor already has an appointment at ${time}. Please choose a different time slot.`,
        conflict: true,
        suggested_time: suggested,
      });
    }

    // ── Fetch patient info if patient_id provided ─────────────
    let patientName = 'Unknown Patient';
    let patientPhone = '';
    let patientEmail = '';

    if (patient_id) {
      const { data: patientRow } = await supabase
        .from('appointments')
        .select('patient_name, phone, email')
        .eq('id', patient_id)
        .single();
      if (patientRow) {
        patientName  = patientRow.patient_name;
        patientPhone = patientRow.phone || '';
        patientEmail = patientRow.email || '';
      }
    }

    // ── Save appointment ──────────────────────────────────────
    const meta = {
      status:     'confirmed',
      symptoms:   reason || 'General checkup',
      visits:     [],
      booked_at:  new Date().toISOString(),
    };

    const { data: newRow, error: insertErr } = await supabase
      .from('appointments')
      .insert([{
        patient_name:     patientName,
        email:            patientEmail || `${patientName.toLowerCase().replace(/\s+/g, '')}@patient.com`,
        phone:            patientPhone || 'N/A',
        appointment_date: date,
        appointment_time: time,
        doctor_id:        doctor_id,
        department:       department || 'General Medicine',
        reason:           JSON.stringify(meta),
        is_active:        true,
      }])
      .select();

    if (insertErr) throw insertErr;

    const saved = newRow[0];

    // ── Fetch doctor name for response ────────────────────────
    const { data: doctor } = await supabase.from('users').select('id, name').eq('id', doctor_id).single();

    res.status(201).json({
      id:           saved.id,
      patient_name: saved.patient_name,
      doctor_id:    saved.doctor_id,
      doctor_name:  doctor?.name || 'Assigned Doctor',
      date:         saved.appointment_date,
      time:         saved.appointment_time,
      department:   saved.department,
      status:       'confirmed',
      created_at:   saved.created_at,
    });
  } catch (err) {
    console.error('Book appointment error:', err);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

// ─── GET /api/appointments ────────────────────────────────────
// List all appointments (filter by date, doctor, status)
router.get('/', verifyToken, async (req, res) => {
  try {
    const { date, doctor_id, status } = req.query;

    let query = supabase.from('appointments').select('*').order('created_at', { ascending: false });

    if (date)      query = query.eq('appointment_date', date);
    if (doctor_id) query = query.eq('doctor_id', doctor_id);

    const { data: rows, error } = await query;
    if (error) throw error;

    const { data: doctors } = await supabase.from('users').select('id, name');
    const doctorMap = {};
    (doctors || []).forEach(d => { doctorMap[d.id] = d; });

    let appointments = (rows || []).map(row => {
      const meta = parseMeta(row);
      return {
        id:           row.id,
        patient_name: row.patient_name,
        phone:        row.phone,
        doctor_id:    row.doctor_id,
        doctor_name:  doctorMap[row.doctor_id]?.name || 'Assigned Doctor',
        date:         row.appointment_date,
        time:         row.appointment_time,
        department:   row.department,
        status:       meta.status || 'confirmed',
        reason:       meta.symptoms || '',
        created_at:   row.created_at,
      };
    });

    if (status) appointments = appointments.filter(a => a.status === status);

    res.json(appointments);
  } catch (err) {
    console.error('Get appointments error:', err);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// ─── DELETE /api/appointments/:id ────────────────────────────
// Cancel an appointment
router.delete('/:id', verifyReceptionistOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: row, error: fetchErr } = await supabase
      .from('appointments').select('*').eq('id', id).single();

    if (fetchErr || !row) return res.status(404).json({ error: 'Appointment not found' });

    const meta = parseMeta(row);
    meta.status = 'cancelled';

    const { error: updateErr } = await supabase
      .from('appointments')
      .update({ reason: JSON.stringify(meta), updated_at: new Date().toISOString() })
      .eq('id', id);

    if (updateErr) throw updateErr;

    res.json({ success: true, message: 'Appointment cancelled' });
  } catch (err) {
    console.error('Cancel appointment error:', err);
    res.status(500).json({ error: 'Failed to cancel appointment' });
  }
});

export default router;
