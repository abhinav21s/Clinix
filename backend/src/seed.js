import bcrypt from 'bcrypt';
import { supabase } from './db.js';

async function seed() {
  try {
    console.log('Starting seed...');

    const adminPassword = await bcrypt.hash('admin123', 10);

    const { data: existingAdmin } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'admin@aetherhospital.com')
      .single();

    if (existingAdmin) {
      console.log('Admin already exists');
      return;
    }

    const { data: admin, error: adminError } = await supabase
      .from('users')
      .insert([
        {
          name: 'Admin User',
          email: 'admin@aetherhospital.com',
          password_hash: adminPassword,
          role: 'admin',
          is_active: true,
        },
      ])
      .select();

    if (adminError) {
      console.error('Error creating admin:', adminError);
      return;
    }

    console.log('✓ Admin created');
    console.log('Email: admin@aetherhospital.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('Seed error:', error);
  }
}

seed();
