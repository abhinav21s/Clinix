import express from 'express';
import { supabase } from '../db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// ─── Verify receptionist or admin ─────────────────────────────
const verifyReceptionistOrAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== 'receptionist' && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Receptionist or admin access required'
      });
    }

    next();
  });
};

// ─── Helper: parse metadata from reason field ─────────────────
const parseMeta = (row) => {
  try {
    return typeof row.reason === 'string'
      ? JSON.parse(row.reason)
      : (row.reason || {});
  } catch {
    return {};
  }
};

// ─── GET /api/appointments/doctors ────────────────────────────
// Return active doctors for the public appointment booking page.
//
// Patients do NOT need to log in or register before booking,
// so this endpoint is intentionally public.
router.get('/doctors', async (req, res) => {
  try {
    const { data: doctors, error } = await supabase
      .from('users')
      .select('id, name, email, role, is_active')
      .eq('role', 'doctor')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    res.json(doctors || []);
  } catch (err) {
    console.error('Get doctors error:', err);

    res.status(500).json({
      error: 'Failed to fetch doctors'
    });
  }
});

// ─── GET /api/appointments/availability ──────────────────────
// Check whether a doctor is available on a particular
// date and time.
//
// Query params:
// doctor_id
// date
// time
//
// This endpoint is public because anyone visiting the
// appointment page must be able to check availability.
router.get('/availability', async (req, res) => {
  try {
    const { doctor_id, date, time } = req.query;

    if (!doctor_id || !date || !time) {
      return res.status(400).json({
        error: 'doctor_id, date and time are required'
      });
    }

    // Make sure the doctor exists and is active.
    const { data: doctor, error: doctorError } = await supabase
      .from('users')
      .select('id, name, role, is_active')
      .eq('id', doctor_id)
      .eq('role', 'doctor')
      .eq('is_active', true)
      .single();

    if (doctorError || !doctor) {
      return res.status(404).json({
        error: 'Doctor not found or inactive'
      });
    }

    // Get all appointments for this doctor on the selected date.
    const { data: rows, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('doctor_id', doctor_id)
      .eq('appointment_date', date);

    if (error) {
      throw error;
    }

    // Check whether the exact time is already booked.
    const conflict = (rows || []).some((row) => {
      const meta = parseMeta(row);

      return (
        row.appointment_time === time &&
        meta.status !== 'cancelled'
      );
    });

    if (conflict) {
      const SLOTS = [
        '09:00 AM',
        '10:00 AM',
        '11:00 AM',
        '12:00 PM',
        '02:00 PM',
        '03:00 PM',
        '04:00 PM',
        '05:00 PM'
      ];

      const bookedSlots = (rows || [])
        .filter((row) => parseMeta(row).status !== 'cancelled')
        .map((row) => row.appointment_time);

      const suggested =
        SLOTS.find((slot) => !bookedSlots.includes(slot)) || null;

      return res.json({
        available: false,
        reason: `Doctor already has an appointment at ${time}`,
        suggested_time: suggested
      });
    }

    // No appointment conflict.
    res.json({
      available: true,
      reason: 'Doctor is free at this time',
      suggested_time: null
    });

  } catch (err) {
    console.error('Availability check error:', err);

    res.status(500).json({
      error: 'Failed to check availability'
    });
  }
});

// ─── POST /api/appointments ───────────────────────────────────
// PUBLIC appointment booking.
//
// A patient does NOT need:
// - an account
// - a patient login
// - an existing patient record
//
// The appointment itself creates the initial patient record
// using the patient's name and phone number.
router.post('/', async (req, res) => {
  try {
    const {
      patient_name,
      phone,
      email,
      doctor_id,
      date,
      time,
      department,
      reason
    } = req.body;

    const patientName = String(patient_name || '').trim();
    const patientPhone = String(phone || '').trim();

    // Required fields.
    if (
      !patientName ||
      !patientPhone ||
      !doctor_id ||
      !date ||
      !time
    ) {
      return res.status(400).json({
        error: 'Patient name, phone, doctor, date and time are required'
      });
    }

    // ── Verify doctor ──────────────────────────────────────────
    const {
      data: doctor,
      error: doctorErr
    } = await supabase
      .from('users')
      .select('id, name, email, role, is_active')
      .eq('id', doctor_id)
      .eq('role', 'doctor')
      .eq('is_active', true)
      .single();

    if (doctorErr || !doctor) {
      return res.status(404).json({
        error: 'Selected doctor was not found or is inactive'
      });
    }

    // ── Conflict check ────────────────────────────────────────
    const {
      data: existing,
      error: checkErr
    } = await supabase
      .from('appointments')
      .select('*')
      .eq('doctor_id', doctor_id)
      .eq('appointment_date', date);

    if (checkErr) {
      throw checkErr;
    }

    const hasConflict = (existing || []).some((row) => {
      const meta = parseMeta(row);

      return (
        row.appointment_time === time &&
        meta.status !== 'cancelled'
      );
    });

    if (hasConflict) {
      const SLOTS = [
        '09:00 AM',
        '10:00 AM',
        '11:00 AM',
        '12:00 PM',
        '02:00 PM',
        '03:00 PM',
        '04:00 PM',
        '05:00 PM'
      ];

      const bookedSlots = (existing || [])
        .filter(
          (row) => parseMeta(row).status !== 'cancelled'
        )
        .map((row) => row.appointment_time);

      const suggested =
        SLOTS.find(
          (slot) => !bookedSlots.includes(slot)
        ) || null;

      return res.status(409).json({
        error: `Doctor already has an appointment at ${time}. Please choose a different time slot.`,
        conflict: true,
        suggested_time: suggested
      });
    }

    // ── Build patient email ───────────────────────────────────
    // Email is optional on the public appointment page.
    // If the user does not provide one, create a placeholder.
    const cleanName = patientName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '.')
      .replace(/^\.|\.$/g, '');

    const patientEmail =
      String(email || '').trim() ||
      `${cleanName || 'patient'}@patient.com`;

    // ── Create appointment metadata ───────────────────────────
    const meta = {
      status: 'confirmed',
      symptoms:
        String(reason || '').trim() ||
        'General checkup',
      visits: [],
      booked_at: new Date().toISOString(),
      source: 'public_booking'
    };

    // ── Insert appointment ─────────────────────────────────────
    const {
      data: newRow,
      error: insertErr
    } = await supabase
      .from('appointments')
      .insert([
        {
          patient_name: patientName,
          email: patientEmail,
          phone: patientPhone,
          appointment_date: date,
          appointment_time: time,
          doctor_id: doctor_id,
          department:
            department || 'General Medicine',
          reason: JSON.stringify(meta),
          is_active: true
        }
      ])
      .select()
      .single();

    if (insertErr) {
      throw insertErr;
    }

    // ── Return booking information ─────────────────────────────
    res.status(201).json({
      id: newRow.id,
      patient_name: newRow.patient_name,
      phone: newRow.phone,
      doctor_id: newRow.doctor_id,
      doctor_name:
        doctor.name || 'Assigned Doctor',
      date: newRow.appointment_date,
      time: newRow.appointment_time,
      department: newRow.department,
      status: 'confirmed',
      created_at: newRow.created_at,

      // Indicates that this booking was made directly
      // through the public appointment page.
      new_patient: true
    });

  } catch (err) {
    console.error('Book appointment error:', err);

    res.status(500).json({
      error: 'Failed to book appointment'
    });
  }
});

// ─── GET /api/appointments ────────────────────────────────────
// List all appointments.
//
// Protected because this is used by authenticated
// receptionist/doctor/admin dashboards.
//
// Optional filters:
// ?date=YYYY-MM-DD
// ?doctor_id=UUID
// ?status=confirmed
router.get('/', verifyToken, async (req, res) => {
  try {
    const {
      date,
      doctor_id,
      status
    } = req.query;

    let query = supabase
      .from('appointments')
      .select('*')
      .order('created_at', {
        ascending: false
      });

    if (date) {
      query = query.eq(
        'appointment_date',
        date
      );
    }

    if (doctor_id) {
      query = query.eq(
        'doctor_id',
        doctor_id
      );
    }

    const {
      data: rows,
      error
    } = await query;

    if (error) {
      throw error;
    }

    // Fetch doctors to map doctor IDs to names.
    const { data: doctors } = await supabase
      .from('users')
      .select('id, name');

    const doctorMap = {};

    (doctors || []).forEach((doctor) => {
      doctorMap[doctor.id] = doctor;
    });

    let appointments = (rows || []).map((row) => {
      const meta = parseMeta(row);

      return {
        id: row.id,
        patient_name: row.patient_name,
        phone: row.phone,
        doctor_id: row.doctor_id,
        doctor_name:
          doctorMap[row.doctor_id]?.name ||
          'Assigned Doctor',
        date: row.appointment_date,
        time: row.appointment_time,
        department: row.department,
        status:
          meta.status || 'confirmed',
        reason:
          meta.symptoms || '',
        created_at: row.created_at
      };
    });

    // Optional status filter.
    if (status) {
      appointments =
        appointments.filter(
          (appointment) =>
            appointment.status === status
        );
    }

    res.json(appointments);

  } catch (err) {
    console.error(
      'Get appointments error:',
      err
    );

    res.status(500).json({
      error: 'Failed to fetch appointments'
    });
  }
});

// ─── DELETE /api/appointments/:id ─────────────────────────────
// Cancel an appointment.
//
// Only receptionist/admin can cancel.
router.delete(
  '/:id',
  verifyReceptionistOrAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Find appointment.
      const {
        data: row,
        error: fetchErr
      } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchErr || !row) {
        return res.status(404).json({
          error: 'Appointment not found'
        });
      }

      // Parse existing metadata.
      const meta = parseMeta(row);

      // Mark appointment as cancelled.
      meta.status = 'cancelled';

      const {
        error: updateErr
      } = await supabase
        .from('appointments')
        .update({
          reason: JSON.stringify(meta),
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateErr) {
        throw updateErr;
      }

      res.json({
        success: true,
        message: 'Appointment cancelled'
      });

    } catch (err) {
      console.error(
        'Cancel appointment error:',
        err
      );

      res.status(500).json({
        error: 'Failed to cancel appointment'
      });
    }
  }
);

export default router;
