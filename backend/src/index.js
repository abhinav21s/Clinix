import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import staffRoutes from './routes/staff.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'running' });
});

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
