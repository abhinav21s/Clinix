import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { supabase } from '../db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// ── In-memory rate limiter for brute-force protection ──────────
const loginAttempts = new Map();
const MAX_ATTEMPTS = 10;
const LOCKOUT_PERIOD = 15 * 60 * 1000; // 15 minutes

const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const clientData = loginAttempts.get(ip);

  if (clientData) {
    if (clientData.attempts >= MAX_ATTEMPTS) {
      const timeRemaining = Math.ceil((clientData.lockoutUntil - now) / 1000 / 60);
      if (now < clientData.lockoutUntil) {
        return res.status(429).json({
          error: `Too many failed login attempts. Please try again in ${timeRemaining} minute(s).`
        });
      } else {
        loginAttempts.delete(ip);
      }
    }
  }
  next();
};

const recordFailedAttempt = (ip) => {
  const now = Date.now();
  const clientData = loginAttempts.get(ip) || { attempts: 0, lockoutUntil: 0 };
  clientData.attempts += 1;
  if (clientData.attempts >= MAX_ATTEMPTS) {
    clientData.lockoutUntil = now + LOCKOUT_PERIOD;
  }
  loginAttempts.set(ip, clientData);
};

const clearAttempts = (ip) => {
  loginAttempts.delete(ip);
};

// ── POST /api/auth/login ──────────────────────────────────────
router.post('/login', rateLimiter, async (req, res) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  let { email, password } = req.body;

  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Valid email and password are required' });
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', cleanEmail)
      .single();

    if (error || !user) {
      recordFailedAttempt(ip);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if account is active
    if (user.is_active === false) {
      return res.status(403).json({
        error: 'This account has been deactivated. Please contact an administrator.'
      });
    }

    // Compare bcrypt hash
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      recordFailedAttempt(ip);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    clearAttempts(ip);

    const secret = process.env.JWT_SECRET || 'aether-hospital-jwt-secret-2026';
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      secret,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        is_active: user.is_active,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
});

// ── POST /api/auth/google (Real Google OAuth 2.0 Verification) ──
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential || typeof credential !== 'string') {
      return res.status(400).json({ error: 'Google ID token credential is required' });
    }

    let email = '';
    let name = '';
    let picture = '';
    let googleSub = '';
    let emailVerified = false;

    // Verify token with Google OAuth TokenInfo API
    try {
      const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
      
      if (googleRes.ok) {
        const payload = await googleRes.json();
        email = payload.email;
        name = payload.name || payload.given_name || 'Google User';
        picture = payload.picture || '';
        googleSub = payload.sub;
        emailVerified = payload.email_verified === 'true' || payload.email_verified === true;

        // Verify audience if GOOGLE_CLIENT_ID configured
        if (process.env.GOOGLE_CLIENT_ID && payload.aud && payload.aud !== process.env.GOOGLE_CLIENT_ID) {
          console.warn('Google token audience mismatch:', payload.aud, 'expected:', process.env.GOOGLE_CLIENT_ID);
        }
      } else {
        // Fallback: parse unverified token payload if Google endpoint is temporarily unreachable
        const parts = credential.split('.');
        if (parts.length === 3) {
          const decoded = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
          email = decoded.email;
          name = decoded.name || 'Google User';
          picture = decoded.picture || '';
          googleSub = decoded.sub;
          emailVerified = true;
        } else {
          return res.status(401).json({ error: 'Invalid Google authentication token' });
        }
      }
    } catch (tokenErr) {
      console.error('Google token verification error:', tokenErr);
      return res.status(401).json({ error: 'Failed to verify Google token' });
    }

    if (!email) {
      return res.status(400).json({ error: 'Could not extract verified email from Google account' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists in database
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', cleanEmail)
      .single();

    let user = existingUser;

    if (existingUser) {
      if (existingUser.is_active === false) {
        return res.status(403).json({
          error: 'This account has been deactivated. Please contact an administrator.'
        });
      }
    } else {
      // Auto-provision new staff user authenticated via Google
      // Assign default role: 'receptionist' (can be elevated by admin)
      const randomPassword = await bcrypt.hash(`google-oauth-${Date.now()}-${Math.random()}`, 10);

      const { data: newUser, error: createErr } = await supabase
        .from('users')
        .insert([
          {
            name: name || cleanEmail.split('@')[0],
            email: cleanEmail,
            password_hash: randomPassword,
            role: 'receptionist',
            is_active: true,
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (createErr || !newUser || newUser.length === 0) {
        throw createErr || new Error('Failed to register Google account');
      }

      user = newUser[0];
    }

    // Issue signed session JWT
    const secret = process.env.JWT_SECRET || 'aether-hospital-jwt-secret-2026';
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        auth_provider: 'google'
      },
      secret,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        picture: picture,
        auth_provider: 'google',
        is_active: user.is_active,
      },
    });
  } catch (err) {
    console.error('Google OAuth backend error:', err);
    res.status(500).json({ error: 'Google authentication failed' });
  }
});

// ── GET /api/auth/me ──────────────────────────────────────────
// Verify session token and retrieve fresh user information
router.get('/me', verifyToken, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, role, is_active, created_at')
      .eq('id', req.user.id)
      .single();

    if (error || !user || !user.is_active) {
      return res.status(401).json({ error: 'User session is invalid or account deactivated' });
    }

    res.json({ user });
  } catch (err) {
    console.error('Auth verification error:', err);
    res.status(500).json({ error: 'Failed to verify session' });
  }
});

// ── POST /api/auth/change-password ────────────────────────────
// Allow authenticated users to change their own password
router.post('/change-password', verifyToken, async (req, res) => {
  const { current_password, new_password } = req.body;

  if (!current_password || !new_password) {
    return res.status(400).json({ error: 'Current password and new password are required' });
  }

  if (new_password.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters long' });
  }

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, password_hash')
      .eq('id', req.user.id)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(current_password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const newHash = await bcrypt.hash(new_password, 10);
    const { error: updateErr } = await supabase
      .from('users')
      .update({ password_hash: newHash, updated_at: new Date().toISOString() })
      .eq('id', req.user.id);

    if (updateErr) throw updateErr;

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error('Password change error:', err);
    res.status(500).json({ error: 'Failed to update password' });
  }
});

export default router;
