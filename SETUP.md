# Aether Hospital - Setup

## Requirements
- Node.js v18+
- Supabase account (free)

## Setup Steps

### 1. Supabase Setup
1. Create project at https://supabase.com
2. Dashboard → Settings → General: Copy Project URL (https://xxxxx.supabase.co)
3. Dashboard → Settings → API: Copy anon public key
4. Dashboard → SQL Editor → New Query
5. Copy/paste `backend/src/schema.sql` and run

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```
PORT=3001
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your-anon-key
JWT_SECRET=your-secret
```

Then:
```bash
npm install
npm run seed
npm run dev
```

Server runs on http://localhost:3001

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Demo Login
- Email: `admin@aetherhospital.com`
- Password: `admin123`
- Role: Admin
