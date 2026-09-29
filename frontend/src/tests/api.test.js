/**
 * Tests for: src/api/api.js
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '../api/api.js';

const mockFetch = (responseBody, ok = true, status = 200) => {
  global.fetch = vi.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(responseBody),
  });
};

beforeEach(() => {
  vi.restoreAllMocks();
});

const FAKE_TOKEN = 'test.jwt.token';

describe('api.login()', () => {
  it('calls POST /auth/login with email and password', async () => {
    mockFetch({ token: 'abc', user: { id: 'u1' } });

    const result = await api.login('admin@h.com', 'secret');

    expect(global.fetch).toHaveBeenCalledOnce();
    const [url, opts] = global.fetch.mock.calls[0];
    expect(url).toMatch(/\/auth\/login$/);
    expect(opts.method).toBe('POST');
    const body = JSON.parse(opts.body);
    expect(body.email).toBe('admin@h.com');
    expect(body.password).toBe('secret');
    expect(result.token).toBe('abc');
  });

  it('returns parsed JSON response', async () => {
    mockFetch({ error: 'Invalid credentials' }, false, 401);

    const result = await api.login('bad@h.com', 'wrong');
    expect(result.error).toMatch(/invalid/i);
  });
});

describe('api.getStaff()', () => {
  it('sends GET request with Authorization Bearer header', async () => {
    mockFetch([{ id: 's1', name: 'Nurse Joy', role: 'receptionist' }]);

    const result = await api.getStaff(FAKE_TOKEN);

    expect(global.fetch).toHaveBeenCalledOnce();
    const [url, opts] = global.fetch.mock.calls[0];
    expect(url).toMatch(/\/staff$/);
    expect(opts.headers.Authorization).toBe(`Bearer ${FAKE_TOKEN}`);
    expect(Array.isArray(result)).toBe(true);
  });
});

describe('api.addStaff()', () => {
  it('sends POST request with staff data and auth header', async () => {
    const newStaff = { id: 's2', name: 'Dr Who', email: 'who@h.com', role: 'doctor' };
    mockFetch(newStaff);

    const data = { name: 'Dr Who', email: 'who@h.com', password: 'pass', role: 'doctor' };
    const result = await api.addStaff(FAKE_TOKEN, data);

    const [url, opts] = global.fetch.mock.calls[0];
    expect(url).toMatch(/\/staff$/);
    expect(opts.method).toBe('POST');
    expect(opts.headers.Authorization).toBe(`Bearer ${FAKE_TOKEN}`);
    expect(JSON.parse(opts.body)).toMatchObject(data);
    expect(result.id).toBe('s2');
  });
});

describe('api.updateStaff()', () => {
  it('sends PUT to /staff/:id with updated data', async () => {
    const updated = { id: 's3', name: 'Updated Name', role: 'receptionist', is_active: true };
    mockFetch(updated);

    const result = await api.updateStaff(FAKE_TOKEN, 's3', { name: 'Updated Name', role: 'receptionist' });

    const [url, opts] = global.fetch.mock.calls[0];
    expect(url).toMatch(/\/staff\/s3$/);
    expect(opts.method).toBe('PUT');
    expect(result.name).toBe('Updated Name');
  });
});

describe('api.deleteStaff()', () => {
  it('sends DELETE to /staff/:id with auth header', async () => {
    mockFetch({ message: 'Staff deleted successfully' });

    const result = await api.deleteStaff(FAKE_TOKEN, 's4');

    const [url, opts] = global.fetch.mock.calls[0];
    expect(url).toMatch(/\/staff\/s4$/);
    expect(opts.method).toBe('DELETE');
    expect(opts.headers.Authorization).toBe(`Bearer ${FAKE_TOKEN}`);
    expect(result.message).toMatch(/deleted/i);
  });
});
