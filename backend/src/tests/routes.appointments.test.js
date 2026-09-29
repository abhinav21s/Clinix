/**
 * Tests for: src/routes/appointments.js
 */

import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';

const TEST_SECRET = 'test-jwt-secret';
process.env.JWT_SECRET = TEST_SECRET;

const mockAppointmentsSelectEq = jest.fn();
const mockAppointmentsSelect = jest.fn();
const mockAppointmentsInsert = jest.fn();
const mockAppointmentsUpdate = jest.fn();

const mockSupabase = {
  from: jest.fn((table) => {
    if (table === 'appointments') {
      return {
        select: jest.fn(() => ({
          order: jest.fn().mockResolvedValue({ data: [], error: null }),
          eq: jest.fn(() => ({
            eq: jest.fn().mockResolvedValue({ data: [], error: null }),
            single: jest.fn().mockResolvedValue({
              data: {
                id: 'appt1',
                patient_name: 'John',
                doctor_id: 'd1',
                appointment_date: '2026-10-01',
                appointment_time: '10:00 AM',
                reason: JSON.stringify({ status: 'confirmed' })
              },
              error: null,
            }),
          })),
        })),
        insert: jest.fn(() => ({
          select: jest.fn().mockResolvedValue({
            data: [{
              id: 'appt1',
              patient_name: 'Unknown Patient',
              appointment_date: '2026-10-01',
              appointment_time: '09:00 AM',
              department: 'General',
              doctor_id: 'd1',
              created_at: new Date().toISOString()
            }],
            error: null,
          }),
        })),
        update: jest.fn(() => ({
          eq: jest.fn().mockResolvedValue({ error: null }),
        })),
      };
    }
    // users table
    return {
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({ data: { id: 'd1', name: 'Dr House' }, error: null }),
        })),
      })),
    };
  }),
};

jest.unstable_mockModule('../db.js', () => ({
  supabase: mockSupabase,
}));

const { default: appointmentRoutes } = await import('../routes/appointments.js');

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/appointments', appointmentRoutes);
  return app;
};

const token = (role = 'receptionist') =>
  `Bearer ${jwt.sign({ id: 'u1', role }, TEST_SECRET, { expiresIn: '1h' })}`;

describe('GET /api/appointments/availability', () => {
  it('returns 400 when doctor_id is missing', async () => {
    const app = buildApp();
    const res = await request(app)
      .get('/api/appointments/availability?date=2026-10-01&time=10:00 AM')
      .set('Authorization', token());
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/required/i);
  });

  it('returns 400 when date is missing', async () => {
    const app = buildApp();
    const res = await request(app)
      .get('/api/appointments/availability?doctor_id=d1&time=10:00 AM')
      .set('Authorization', token());
    expect(res.status).toBe(400);
  });

  it('returns available:true when no conflicting appointment exists', async () => {
    const app = buildApp();
    const res = await request(app)
      .get('/api/appointments/availability?doctor_id=d1&date=2026-10-01&time=10:00 AM')
      .set('Authorization', token());
    expect(res.status).toBe(200);
    expect(res.body.available).toBe(true);
  });
});

describe('POST /api/appointments', () => {
  it('returns 400 when doctor_id is missing', async () => {
    const app = buildApp();
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', token('receptionist'))
      .send({ date: '2026-10-01', time: '10:00 AM' });
    expect(res.status).toBe(400);
  });

  it('returns 403 when called by a doctor (insufficient role)', async () => {
    const app = buildApp();
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', token('doctor'))
      .send({ doctor_id: 'd1', date: '2026-10-01', time: '10:00 AM' });
    expect(res.status).toBe(403);
  });

  it('returns 201 on successful booking (no conflict)', async () => {
    const app = buildApp();
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', token('receptionist'))
      .send({ doctor_id: 'd1', date: '2026-10-01', time: '09:00 AM', department: 'General' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('returns 401 when called without any token', async () => {
    const app = buildApp();
    const res = await request(app)
      .post('/api/appointments')
      .send({ doctor_id: 'd1', date: '2026-10-01', time: '09:00 AM' });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/appointments', () => {
  it('returns 401 without token', async () => {
    const app = buildApp();
    const res = await request(app).get('/api/appointments');
    expect(res.status).toBe(401);
  });

  it('returns 200 with array for authenticated user', async () => {
    const app = buildApp();
    const res = await request(app)
      .get('/api/appointments')
      .set('Authorization', token('admin'));
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('DELETE /api/appointments/:id', () => {
  it('returns 403 for doctor role', async () => {
    const app = buildApp();
    const res = await request(app)
      .delete('/api/appointments/appt1')
      .set('Authorization', token('doctor'));
    expect(res.status).toBe(403);
  });

  it('returns 200 on successful cancellation (receptionist)', async () => {
    const app = buildApp();
    const res = await request(app)
      .delete('/api/appointments/appt1')
      .set('Authorization', token('receptionist'));
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
