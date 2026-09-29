# Aether Hospital - Features

## Start Commands

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

---

## Landing Page
- Hero section with "Book Appointment" button
- Why Choose Us: 4 cards with features
- Services: 6 service cards
- Footer with contact info
- Login button in navigation

---

## Authentication
- Login at `/login`
- Email: `admin@aetherhospital.com` / `admin123`
- Three roles: Admin, Doctor, Receptionist
- JWT-based auth with localStorage persistence

---

## Admin Dashboard (`/admin`)
✅ **Live Stats Cards**
- Total Doctors count
- Total Receptionists count
- Total Staff count

✅ **Add Staff**
- Name, Email, Password, Role
- Click "+ Add Staff" button
- Form validates all fields

✅ **Edit Staff**
- Click "Edit" button in table
- Pre-filled form with staff data
- Update name, email, or role
- Click "Update Staff"

✅ **Delete Staff**
- Click "Delete" button in table
- Confirm deletion
- Removed from database

✅ **Staff Table**
- Shows all doctors and receptionists
- Columns: Name, Email, Role, Status
- Color-coded role badges
- Action buttons (Edit, Delete)

---

## Doctor Dashboard (`/doctor`)
- Simple placeholder page
- Logout button
- "Doctor here" message

---

## Receptionist Dashboard (`/receptionist`)
- Simple placeholder page
- Logout button
- "Receptionist here" message

---

## Appointment Page (`/appointment`)
- Placeholder page
- "Back to Home" button

---

## Project Structure

```
clinix/
├── backend/
│   ├── src/
│   │   ├── index.js
│   │   ├── db.js
│   │   ├── schema.sql
│   │   ├── seed.js
│   │   ├── middleware/auth.js
│   │   └── routes/
│   │       ├── auth.js
│   │       └── staff.js
│   ├── package.json
│   ├── .env
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── pages/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   └── styles/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── .env
│   └── .env.example
│
├── SETUP.md
├── WORKING.md
└── README.md
```
