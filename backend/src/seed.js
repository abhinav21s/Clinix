import bcrypt from 'bcrypt';
import { supabase } from './db.js';

async function seed() {
  try {
    console.log('--- Seeding Multi-Visit Date Patients ---');

    // 1. Admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const { data: existingAdmin } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'admin@aetherhospital.com')
      .single();

    if (!existingAdmin) {
      await supabase.from('users').insert([
        {
          name: 'Admin',
          email: 'admin@aetherhospital.com',
          password_hash: adminPassword,
          role: 'admin',
          is_active: true,
        },
      ]);
      console.log('✓ Admin created: admin@aetherhospital.com / admin123');
    }

    // 2. 5 Doctors
    const doctorPassword = await bcrypt.hash('doctor123', 10);
    const doctors = [
      { name: 'Dr. Sarah Jenkins', email: 'dr.jenkins@aetherhospital.com' },
      { name: 'Dr. Rajesh Sharma', email: 'dr.sharma@aetherhospital.com' },
      { name: 'Dr. Emily Chen', email: 'dr.chen@aetherhospital.com' },
      { name: 'Dr. Michael Brown', email: 'dr.brown@aetherhospital.com' },
      { name: 'Dr. Priya Patel', email: 'dr.patel@aetherhospital.com' },
    ];

    const doctorMap = {};

    for (const doc of doctors) {
      const { data: existingDoc } = await supabase
        .from('users')
        .select('id, name, email')
        .eq('email', doc.email)
        .single();

      if (existingDoc) {
        doctorMap[doc.email] = existingDoc.id;
      } else {
        const { data: newDoc, error } = await supabase
          .from('users')
          .insert([
            {
              name: doc.name,
              email: doc.email,
              password_hash: doctorPassword,
              role: 'doctor',
              is_active: true,
            },
          ])
          .select();

        if (!error && newDoc) {
          doctorMap[doc.email] = newDoc[0].id;
        }
      }
    }

    // 3. Clear existing patients
    await supabase.from('appointments').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // 4. Patients with multiple visit dates
    const sarahId = doctorMap['dr.jenkins@aetherhospital.com'];
    const sharmaId = doctorMap['dr.sharma@aetherhospital.com'];
    const chenId = doctorMap['dr.chen@aetherhospital.com'];
    const brownId = doctorMap['dr.brown@aetherhospital.com'];
    const patelId = doctorMap['dr.patel@aetherhospital.com'];

    const patients = [
      {
        name: 'Eleanor Vance',
        phone: '+1 555-0101',
        age: 56,
        gender: 'Female',
        doctor_id: sarahId,
        symptoms: 'Chest tightness and shortness of breath on climbing stairs',
        visits: [
          {
            date: '14 May 2026',
            doctor_name: 'Dr. Sarah Jenkins',
            diagnosis: 'Mild Hypertension (Stage 1)',
            medication: 'Amlodipine 5mg (1 tab morning)\nTelmisartan 40mg (1 tab daily)',
            notes: 'Patient advised low sodium diet and regular brisk walking. Baseline BP: 145/92 mmHg.',
          },
          {
            date: '10 Jan 2026',
            doctor_name: 'Dr. Priya Patel',
            diagnosis: 'Seasonal Acute Bronchitis',
            medication: 'Azithromycin 500mg (3 days)\nCough Expectorant Syrup (10ml thrice daily)',
            notes: 'Chest clear on auscultation. Advised warm water hydration.',
          }
        ]
      },
      {
        name: 'David Miller',
        phone: '+1 555-0102',
        age: 42,
        gender: 'Male',
        doctor_id: sarahId,
        symptoms: 'Palpitations and dizziness during gym workout',
        visits: [
          {
            date: '20 Jun 2026',
            doctor_name: 'Dr. Sarah Jenkins',
            diagnosis: 'Sinus Tachycardia (Stress induced)',
            medication: 'Propranolol 20mg (SOS when palpitations trigger)',
            notes: 'ECG normal sinus rhythm, resting HR 98 bpm. Advised cutting down pre-workout energy drinks.',
          },
          {
            date: '12 Nov 2025',
            doctor_name: 'Dr. Michael Brown',
            diagnosis: 'Right Shoulder Rotator Cuff Strain',
            medication: 'Ibuprofen 400mg (twice daily after meals for 5 days)',
            notes: 'Advised physiotherapy exercises and avoiding heavy lifting.',
          }
        ]
      },
      {
        name: 'Rachel Adams',
        phone: '+1 555-0103',
        age: 61,
        gender: 'Female',
        doctor_id: sarahId,
        symptoms: 'Swollen ankles and mild breathing difficulty',
        visits: [
          {
            date: '02 Feb 2026',
            doctor_name: 'Dr. Sarah Jenkins',
            diagnosis: 'Early Cardiac Evaluation & Fluid Retention',
            medication: 'Furosemide 20mg (1 tab alternate days)\nAtorvastatin 10mg (1 tab at night)',
            notes: 'Fluid intake restricted to 1.5L daily. Weight monitoring chart provided.',
          }
        ]
      },
      {
        name: 'James Wilson',
        phone: '+1 555-0104',
        age: 49,
        gender: 'Male',
        doctor_id: sarahId,
        symptoms: 'High blood pressure checkup',
        visits: [
          {
            date: '05 Mar 2026',
            doctor_name: 'Dr. Priya Patel',
            diagnosis: 'Annual Executive Health Screening',
            medication: 'Rosuvastatin 10mg (1 tab night)\nVitamin D3 60k IU (weekly)',
            notes: 'Fasting lipid profile elevated. Advised diet modifications and cardiology consultation.',
          }
        ]
      },
      {
        name: 'Clara Higgins',
        phone: '+1 555-0105',
        age: 72,
        gender: 'Female',
        doctor_id: sarahId,
        symptoms: 'Routine 6-month checkup',
        visits: [
          {
            date: '15 Dec 2025',
            doctor_name: 'Dr. Sarah Jenkins',
            diagnosis: 'Post LAD Stenting 6-Month Review (Stable)',
            medication: 'Aspirin 75mg (1 tab morning)\nClopidogrel 75mg (1 tab daily)\nRosuvastatin 20mg (1 tab night)',
            notes: 'Patient stable. 2D Echo shows LVEF 55% with good exercise tolerance.',
          }
        ]
      },
      {
        name: 'Marcus Sterling',
        phone: '+1 555-0106',
        age: 39,
        gender: 'Male',
        doctor_id: sharmaId,
        symptoms: 'Severe headache and migraine',
        visits: [
          {
            date: '11 Apr 2026',
            doctor_name: 'Dr. Rajesh Sharma',
            diagnosis: 'Refractory Migraine with Aura',
            medication: 'Sumatriptan 50mg (at onset of aura)\nNaproxen 500mg (SOS)',
            notes: 'Advised keeping headache diary and identifying dietary triggers.',
          }
        ]
      },
      {
        name: 'Sophia Anderson',
        phone: '+1 555-0107',
        age: 28,
        gender: 'Female',
        doctor_id: brownId,
        symptoms: 'Right knee pain after sports',
        visits: [
          {
            date: '19 Jan 2026',
            doctor_name: 'Dr. Michael Brown',
            diagnosis: 'Medial Meniscus Mild Strain',
            medication: 'Paracetamol 1000mg (as needed)\nTopical Diclofenac Gel',
            notes: 'Advised knee brace and avoiding impact running for 3 weeks.',
          }
        ]
      },
      {
        name: 'Oliver Chen',
        phone: '+1 555-0108',
        age: 8,
        gender: 'Male',
        doctor_id: chenId,
        symptoms: 'Fever and dry cough',
        visits: [
          {
            date: '03 Feb 2026',
            doctor_name: 'Dr. Emily Chen',
            diagnosis: 'Viral Upper Respiratory Infection',
            medication: 'Paracetamol Syrup 250mg (SOS for fever > 100F)\nSaline nasal drops',
            notes: 'Lungs clear. Encouraged oral fluid intake.',
          }
        ]
      },
      {
        name: 'Arthur Pendelton',
        phone: '+1 555-0109',
        age: 63,
        gender: 'Male',
        doctor_id: patelId,
        symptoms: 'High blood sugar test reading',
        visits: [
          {
            date: '28 May 2026',
            doctor_name: 'Dr. Priya Patel',
            diagnosis: 'Type 2 Diabetes Mellitus (Uncontrolled)',
            medication: 'Metformin 1000mg (twice daily with meals)\nGlimepiride 2mg (morning before breakfast)',
            notes: 'Fasting glucose was 220 mg/dL. Referred to nutritionist for low-carb diet plan.',
          }
        ]
      }
    ];

    const today = new Date().toISOString().split('T')[0];

    for (const p of patients) {
      const meta = {
        age: p.age,
        gender: p.gender,
        symptoms: p.symptoms,
        status: 'waiting',
        notes: '',
        visits: p.visits || [],
      };

      await supabase.from('appointments').insert([
        {
          patient_name: p.name,
          email: `${p.name.toLowerCase().replace(/\s+/g, '')}@patient.com`,
          phone: p.phone,
          appointment_date: today,
          appointment_time: '10:00 AM',
          doctor_id: p.doctor_id,
          department: 'OPD',
          reason: JSON.stringify(meta),
          is_active: true,
        },
      ]);
      console.log(`✓ Patient added with multiple visit dates: ${p.name}`);
    }

    console.log('\n--- Seed Complete ---');
    console.log('Admin: admin@aetherhospital.com / admin123');
    console.log('Doctor: dr.jenkins@aetherhospital.com / doctor123');
  } catch (err) {
    console.error('Seed error:', err);
  }
}

seed();
