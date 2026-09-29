/**
 * Tests for: src/middleware/auth.js
 *
 * What is tested:
 *  - verifyToken  → rejects missing tokens, rejects invalid/expired tokens,
 *                   accepts valid tokens and attaches decoded user to req.user
 *  - verifyAdmin  → chains verifyToken and additionally blocks non-admin roles,
 *                   allows admin role through
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

const SECRET = 'test-secret';

/** Build a minimal Express-like req object */
const makeReq = (authHeader) => ({
  headers: { authorization: authHeader },
});

/** Build a minimal Express-like res object that captures the response */
const makeRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json   = jest.fn(() => res);
  return res;
};

const makeNext = () => jest.fn();

/** Sign a token with the test secret */
const sign = (payload, opts = {}) =>
  jwt.sign(payload, SECRET, { expiresIn: '1h', ...opts });

// ── Setup ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  // Make the middleware use our test secret
  process.env.JWT_SECRET = SECRET;
});

// ── verifyToken ───────────────────────────────────────────────────────────────

describe('verifyToken middleware', () => {
  it('returns 401 when Authorization header is missing', () => {
    const req  = makeReq(undefined);
    const res  = makeRes();
    const next = makeNext();

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when token is missing from Bearer header', () => {
    const req  = makeReq('Bearer ');
    const res  = makeRes();
    const next = makeNext();

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when token is invalid / tampered', () => {
    const req  = makeReq('Bearer invalidtoken123');
    const res  = makeRes();
    const next = makeNext();

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when token is expired', () => {
    const token = sign({ id: '1', role: 'doctor' }, { expiresIn: '-1s' });
    const req   = makeReq(`Bearer ${token}`);
    const res   = makeRes();
    const next  = makeNext();

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next() and attaches decoded user when token is valid', () => {
    const payload = { id: 'u1', email: 'doc@test.com', role: 'doctor' };
    const token   = sign(payload);
    const req     = makeReq(`Bearer ${token}`);
    const res     = makeRes();
    const next    = makeNext();

    verifyToken(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toMatchObject(payload);
  });
});

// ── verifyAdmin ───────────────────────────────────────────────────────────────

describe('verifyAdmin middleware', () => {
  it('returns 403 when authenticated user is not an admin (doctor role)', () => {
    const token = sign({ id: 'u2', role: 'doctor' });
    const req   = makeReq(`Bearer ${token}`);
    const res   = makeRes();
    const next  = makeNext();

    verifyAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Admin access required' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 when authenticated user is not an admin (receptionist role)', () => {
    const token = sign({ id: 'u3', role: 'receptionist' });
    const req   = makeReq(`Bearer ${token}`);
    const res   = makeRes();
    const next  = makeNext();

    verifyAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next() when token belongs to an admin', () => {
    const token = sign({ id: 'u4', role: 'admin' });
    const req   = makeReq(`Bearer ${token}`);
    const res   = makeRes();
    const next  = makeNext();

    verifyAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
