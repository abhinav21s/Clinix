/**
 * Tests for: src/contexts/AuthContext.jsx & src/hooks/useAuth.js
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { AuthContext, AuthProvider } from '../contexts/AuthContext';
import { useAuth } from '../hooks/useAuth';

// ── localStorage mock ─────────────────────────────────────────────────────────
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });

beforeEach(() => localStorageMock.clear());

// ── Helpers ───────────────────────────────────────────────────────────────────

const FAKE_USER = { id: 'u1', name: 'Dr Smith', email: 'smith@h.com', role: 'doctor' };
const FAKE_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.test.token';

const AuthConsumer = () => {
  const { user, token, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="user-name">{user?.name ?? 'none'}</span>
      <span data-testid="token-val">{token ?? 'no-token'}</span>
      <button onClick={() => login(FAKE_USER, FAKE_TOKEN)}>Login</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

const renderWithProvider = () =>
  render(
    <AuthProvider>
      <AuthConsumer />
    </AuthProvider>
  );

// ── AuthContext tests ─────────────────────────────────────────────────────────

describe('AuthContext / AuthProvider', () => {
  it('renders children without crashing', () => {
    renderWithProvider();
    expect(screen.getByTestId('user-name')).toBeTruthy();
  });

  it('starts with null user and token', () => {
    renderWithProvider();
    expect(screen.getByTestId('user-name').textContent).toBe('none');
    expect(screen.getByTestId('token-val').textContent).toBe('no-token');
  });

  it('login() updates user and token in context', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByTestId('user-name').textContent).toBe(FAKE_USER.name);
    expect(screen.getByTestId('token-val').textContent).toBe(FAKE_TOKEN);
  });

  it('login() persists token and user to localStorage', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(localStorageMock.getItem('token')).toBe(FAKE_TOKEN);
    expect(JSON.parse(localStorageMock.getItem('user'))).toMatchObject(FAKE_USER);
  });

  it('logout() clears user and token from context', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByRole('button', { name: /login/i }));
    await user.click(screen.getByRole('button', { name: /logout/i }));

    expect(screen.getByTestId('user-name').textContent).toBe('none');
    expect(screen.getByTestId('token-val').textContent).toBe('no-token');
  });

  it('logout() removes token and user from localStorage', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByRole('button', { name: /login/i }));
    await user.click(screen.getByRole('button', { name: /logout/i }));

    expect(localStorageMock.getItem('token')).toBeNull();
    expect(localStorageMock.getItem('user')).toBeNull();
  });

  it('restores user from localStorage on mount', () => {
    localStorageMock.setItem('token', FAKE_TOKEN);
    localStorageMock.setItem('user', JSON.stringify(FAKE_USER));

    renderWithProvider();

    expect(screen.getByTestId('user-name').textContent).toBe(FAKE_USER.name);
    expect(screen.getByTestId('token-val').textContent).toBe(FAKE_TOKEN);
  });
});

// ── useAuth hook ──────────────────────────────────────────────────────────────

describe('useAuth hook', () => {
  it('throws when used outside AuthProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<AuthConsumer />)).toThrow(/AuthProvider/i);
    spy.mockRestore();
  });

  it('returns { user, token, login, logout } inside AuthProvider', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    expect(screen.getByTestId('user-name').textContent).toBe('none');

    await user.click(screen.getByRole('button', { name: /login/i }));
    expect(screen.getByTestId('user-name').textContent).toBe(FAKE_USER.name);
  });
});
