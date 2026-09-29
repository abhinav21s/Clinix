/**
 * Tests for: src/routes/auth.js
 */

import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const TEST_SECRET = 'test-jwt-secret';
process.env.JWT_SECRET = TEST_SECRET;

const mockSingle = jest.fn();
const mockEq = jest.fn(() => ({ single: mockSingle }));
const mockSelect = jest.fn(() => ({ single: mockSingle, eq: mockEq }));
const mockUpdate = jest.fn(() => ({ eq: jest.fn(() => Promise.resolve({ error: null })) }));
const mockInsert = jest.fn(() => ({ select: jest.fn().mockResolvedValue({ data: [], error: null }) }));

const mockSupabase = {
  from: jest.fn(() => ({
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
  })),
};

jest.unstable_mockModule('../db.js', () => ({
  supabase: mockSupabase,
}));

const { default: authRoutes } = await import('../routes/auth.js');

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRoutes);
  return app;
};

const makeToken = (payload) => jwt.sign(payload, TEST_SECRET, { expiresIn: '1h' });
const hashPassword = (plain) => bcrypt.hashSync(plain, 10);

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEq.mockReturnValue({ single: mockSingle });
    mockSelect.mockReturnValue({ single: mockSingle, eq: mockEq });
  });

  it('returns 400 when email is missing', async () => {
    const app = buildApp();
    const res = await request(app).post('/api/auth/login').send({ password: 'pass' });
    expect(res.status).toBe(400);
  });

  it('returns 400 when password is missing', async () => {
    const app = buildApp();
    const res = await request(app).post('/api/auth/login').send({ email: 'a@b.com' });
    expect(res.status).toBe(400);
  });

  it('returns 401 when user is not found in DB', async () => {
    mockSingle.mockResolvedValueOnce({ data: null, error: new Error('not found') });
    const app = buildApp();
    const res = await request(app).post('/api/auth/login').send({ email: 'no@one.com', password: 'wrong' });
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid/i);
  });

  it('returns 401 when password is wrong', async () => {
    const hash = hashPassword('correct');
    mockSingle.mockResolvedValueOnce({ data: { id: '1', email: 'doc@h.com', name: 'Doc', role: 'doctor', password_hash: hash, is_active: true }, error: null });
    const app = buildApp();
    const res = await request(app).post('/api/auth/login').send({ email: 'doc@h.com', password: 'wrong' });
    expect(res.status).toBe(401);
  });

  it('returns 403 when account is deactivated', async () => {
    const hash = hashPassword('secret');
    mockSingle.mockResolvedValueOnce({ data: { id: '1', email: 'x@h.com', name: 'X', role: 'doctor', password_hash: hash, is_active: false }, error: null });
    const app = buildApp();
    const res = await request(app).post('/api/auth/login').send({ email: 'x@h.com', password: 'secret' });
    expect(res.status).toBe(403);
  });

  it('returns 200 with token on valid credentials', async () => {
    const hash = hashPassword('validpass');
    mockSingle.mockResolvedValueOnce({
      data: { id: 'u1', email: 'admin@h.com', name: 'Admin', role: 'admin', password_hash: hash, is_active: true },
      error: null,
    });
    const app = buildApp();
    const res = await request(app).post('/api/auth/login').send({ email: 'admin@h.com', password: 'validpass' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('admin@h.com');
  });
});

describe('GET /api/auth/me', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEq.mockReturnValue({ single: mockSingle });
    mockSelect.mockReturnValue({ single: mockSingle, eq: mockEq });
  });

  it('returns 401 when no token is provided', async () => {
    const app = buildApp();
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('returns 200 with user data when token is valid', async () => {
    const userPayload = { id: 'u2', email: 'doc@h.com', name: 'Dr Smith', role: 'doctor', is_active: true, created_at: new Date().toISOString() };
    mockSingle.mockResolvedValueOnce({ data: userPayload, error: null });
    const token = makeToken({ id: 'u2', role: 'doctor' });
    const app   = buildApp();
    const res   = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('doc@h.com');
  });

  it('returns 401 when user is deactivated', async () => {
    mockSingle.mockResolvedValueOnce({ data: { id: 'u3', is_active: false }, error: null });
    const token = makeToken({ id: 'u3', role: 'receptionist' });
    const app   = buildApp();
    const res   = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(401);
  });
});

describe('POST /api/auth/change-password', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEq.mockReturnValue({ single: mockSingle });
    mockSelect.mockReturnValue({ single: mockSingle, eq: mockEq });
  });

  const authHeader = (role = 'doctor') => {
    const token = makeToken({ id: 'cu1', role });
    return `Bearer ${token}`;
  };

  it('returns 400 when current_password is missing', async () => {
    const app = buildApp();
    const res = await request(app)
      .post('/api/auth/change-password')
      .set('Authorization', authHeader())
      .send({ new_password: 'newpass123' });
    expect(res.status).toBe(400);
  });

  it('returns 400 when new_password is shorter than 6 chars', async () => {
    const app = buildApp();
    const res = await request(app)
      .post('/api/auth/change-password')
      .set('Authorization', authHeader())
      .send({ current_password: 'old', new_password: 'ab' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/6 characters/i);
  });

  it('returns 400 when current_password is incorrect', async () => {
    const hash = hashPassword('correct-old');
    mockSingle.mockResolvedValueOnce({ data: { id: 'cu1', password_hash: hash }, error: null });
    const app = buildApp();
    const res = await request(app)
      .post('/api/auth/change-password')
      .set('Authorization', authHeader())
      .send({ current_password: 'wrong-old', new_password: 'newpass123' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/incorrect/i);
  });

  it('returns 200 on successful password change', async () => {
    const oldHash = hashPassword('correct-old');
    mockSingle.mockResolvedValueOnce({ data: { id: 'cu1', password_hash: oldHash }, error: null });

    const app = buildApp();
    const res = await request(app)
      .post('/api/auth/change-password')
      .set('Authorization', authHeader())
      .send({ current_password: 'correct-old', new_password: 'newpass123' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
