import express from 'express';
import bcrypt from 'bcrypt';
import { supabase } from '../db.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyAdmin, async (req, res) => {
  try {
    const { data: staff, error } = await supabase
      .from('users')
      .select('id, name, email, role, is_active, created_at')
      .neq('role', 'admin')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(staff);
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
});

router.post('/', verifyAdmin, async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields required' });
  }

  if (!['doctor', 'receptionist'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const { data: newStaff, error } = await supabase
      .from('users')
      .insert([
        {
          name,
          email,
          password_hash: passwordHash,
          role,
          is_active: true,
        },
      ])
      .select();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Email already exists' });
      }
      throw error;
    }

    res.status(201).json({
      id: newStaff[0].id,
      name: newStaff[0].name,
      email: newStaff[0].email,
      role: newStaff[0].role,
    });
  } catch (error) {
    console.error('Add staff error:', error);
    res.status(500).json({ error: 'Failed to add staff' });
  }
});

router.put('/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, email, role, is_active } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  try {
    const { data: updated, error } = await supabase
      .from('users')
      .update({ name, email, role, is_active })
      .eq('id', id)
      .select();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Email already exists' });
      }
      throw error;
    }

    if (!updated || updated.length === 0) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    res.json({
      id: updated[0].id,
      name: updated[0].name,
      email: updated[0].email,
      role: updated[0].role,
      is_active: updated[0].is_active,
    });
  } catch (error) {
    console.error('Update staff error:', error);
    res.status(500).json({ error: 'Failed to update staff' });
  }
});

router.delete('/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Staff deleted successfully' });
  } catch (error) {
    console.error('Delete staff error:', error);
    res.status(500).json({ error: 'Failed to delete staff' });
  }
});

export default router;
