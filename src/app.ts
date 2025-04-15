import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.router';
import adminRoutes from './routes/admin.router';
import userRoutes from './routes/user.router';

const app = express();

// Middleware JSON
app.use(express.json());

// Tambahkan konfigurasi CORS
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Menangani preflight request
app.options('*', cors());

// Tes endpoint
app.get('/', (req, res) => {
  res.send('Server berjalan!');
});

// Routes utama
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); // Admin only
app.use('/api/user', userRoutes);   // User biasa

export default app;