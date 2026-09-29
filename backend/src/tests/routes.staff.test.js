/**
 * Tests for: src/routes/staff.js
 */

import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';

const TEST_SECRET = 'test-jwt-secret';
process.env.JWT_SECRET = TEST_SECRET;

const mockNeq = jest.fn(() => ({ order: jest.fn().mockResolvedValue({ data: [], error: null }) }));
const mockSelect = jest.fn(() => ({
  neq: mockNeq,
  order: jest.fn().mockResolvedValue({ data: [], error: null }),
}));
const mockInsert = jest.fn(() => ({
  select: jest.fn().mockResolvedValue({
    data: [{ id: 'new1', name: 'Test Doc', email: 'doc@h.com', role: 'doctor', is_active: true }],
    error: null,
  }),
}));
const mockUpdate = jest.fn(() => ({
  eq: jest.fn(() => ({
    select: jest.fn().mockResolvedValue({
      data: [{ id: 's1', name: 'Updated', email: 'up@h.com', role: 'doctor', is_active: true }],
      error: null,
    }),
  })),
}));
const mockDelete = jest.fn(() => ({
  eq: jest.fn().mockResolvedValue({ error: null }),
}));

const mockSupabase = {
  from: jest.fn(() => ({
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
  })),
};

jest.unstable_mockModule('../db.js', () => ({
  supabase: mockSupabase,
}));

const { default: staffRoutes } = await import('../routes/staff.js');

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/staff', staffRoutes);
  return app;
};

const adminToken = () => `Bearer ${jwt.sign({ id: 'admin1', role: 'admin' }, TEST_SECRET, { expiresIn: '1h' })}`;
const doctorToken = () => `Bearer ${jwt.sign({ id: 'doc1', role: 'doctor' }, TEST_SECRET, { expiresIn: '1h' })}`;

describe('GET /api/staff', () => {
  it('returns 403 when called by a non-admin (doctor)', async () => {
    const app = buildApp();
    const res = await request(app).get('/api/staff').set('Authorization', doctorToken());
    expect(res.status).toBe(403);
  });

  it('returns 401 when called without a token', async () => {
    const app = buildApp();
    const res = await request(app).get('/api/staff');
    expect(res.status).toBe(401);
  });

  it('returns 200 with staff list for admin', async () => {
    const app = buildApp();
    const res = await request(app).get('/api/staff').set('Authorization', adminToken());
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('POST /api/staff', () => {
  it('returns 400 when name is missing', async () => {
    const app = buildApp();
    const res = await request(app)
      .post('/api/staff')
      .set('Authorization', adminToken())
      .send({ email: 'doc@h.com', password: 'pass123', role: 'doctor' });
    expect(res.status).toBe(400);
  });

  it('returns 400 when role is invalid', async () => {
    const app = buildApp();
    const res = await request(app)
      .post('/api/staff')
      .set('Authorization', adminToken())
      .send({ name: 'Dr X', email: 'x@h.com', password: 'pass123', role: 'superuser' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/invalid role/i);
  });

  it('returns 201 when staff is added successfully', async () => {
    const app = buildApp();
    const res = await request(app)
      .post('/api/staff')
      .set('Authorization', adminToken())
      .send({ name: 'Test Doc', email: 'doc@h.com', password: 'pass123', role: 'doctor' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('returns 403 when non-admin tries to add staff', async () => {
    const app = buildApp();
    const res = await request(app)
      .post('/api/staff')
      .set('Authorization', doctorToken())
      .send({ name: 'Hack', email: 'h@h.com', password: 'p', role: 'doctor' });
    expect(res.status).toBe(403);
  });
});

describe('PUT /api/staff/:id', () => {
  it('returns 400 when required fields are missing', async () => {
    const app = buildApp();
    const res = await request(app)
      .put('/api/staff/s1')
      .set('Authorization', adminToken())
      .send({ email: 'up@h.com' });
    expect(res.status).toBe(400);
  });

  it('returns 200 on successful update', async () => {
    const app = buildApp();
    const res = await request(app)
      .put('/api/staff/s1')
      .set('Authorization', adminToken())
      .send({ name: 'Updated', email: 'up@h.com', role: 'doctor', is_active: true });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated');
  });
});

describe('DELETE /api/staff/:id', () => {
  it('returns 200 on successful delete', async () => {
    const app = buildApp();
    const res = await request(app)
      .delete('/api/staff/s1')
      .set('Authorization', adminToken());
    expect(res.status).toBe(200);
  });

  it('returns 403 for non-admin delete attempt', async () => {
    const app = buildApp();
    const res = await request(app)
      .delete('/api/staff/s1')
      .set('Authorization', doctorToken());
    expect(res.status).toBe(403);
  });
});
