/**
 * Tests for: src/components/ProtectedRoute.jsx
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import React from 'react';

vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../hooks/useAuth';
import ProtectedRoute from '../components/ProtectedRoute';

const renderProtected = (user, requiredRole) =>
  render(
    <MemoryRouter initialEntries={['/protected']}>
      <Routes>
        <Route
          path="/protected"
          element={
            <ProtectedRoute requiredRole={requiredRole}>
              <div data-testid="protected-content">Secret Content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<div data-testid="home-page">Home</div>} />
        <Route path="/login" element={<div data-testid="login-page">Login</div>} />
      </Routes>
    </MemoryRouter>
  );

describe('ProtectedRoute', () => {
  it('redirects to /login when user is not authenticated', () => {
    useAuth.mockReturnValue({ user: null });
    renderProtected(null, 'admin');
    expect(screen.getByTestId('login-page')).toBeTruthy();
    expect(screen.queryByTestId('protected-content')).toBeNull();
  });

  it('redirects to / when user does not have the required role', () => {
    useAuth.mockReturnValue({ user: { id: 'u1', role: 'receptionist' } });
    renderProtected({ id: 'u1', role: 'receptionist' }, 'admin');
    expect(screen.getByTestId('home-page')).toBeTruthy();
    expect(screen.queryByTestId('protected-content')).toBeNull();
  });

  it('renders children when user has the correct role', () => {
    useAuth.mockReturnValue({ user: { id: 'u2', role: 'admin' } });
    renderProtected({ id: 'u2', role: 'admin' }, 'admin');
    expect(screen.getByTestId('protected-content')).toBeTruthy();
  });

  it('renders children when no requiredRole is specified (any auth user)', () => {
    useAuth.mockReturnValue({ user: { id: 'u3', role: 'doctor' } });
    renderProtected({ id: 'u3', role: 'doctor' }, undefined);
    expect(screen.getByTestId('protected-content')).toBeTruthy();
  });

  it('redirects doctor away from admin-only route', () => {
    useAuth.mockReturnValue({ user: { id: 'u4', role: 'doctor' } });
    renderProtected({ id: 'u4', role: 'doctor' }, 'admin');
    expect(screen.queryByTestId('protected-content')).toBeNull();
    expect(screen.getByTestId('home-page')).toBeTruthy();
  });

  it('redirects receptionist away from doctor-only route', () => {
    useAuth.mockReturnValue({ user: { id: 'u5', role: 'receptionist' } });
    renderProtected({ id: 'u5', role: 'receptionist' }, 'doctor');
    expect(screen.queryByTestId('protected-content')).toBeNull();
    expect(screen.getByTestId('home-page')).toBeTruthy();
  });
});
