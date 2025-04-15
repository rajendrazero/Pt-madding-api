import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.router.js';
import adminRoutes from './routes/admin.router.js';
import userRoutes from './routes/user.router.js';

const app = express();

// Middleware
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.options('*', cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Tes endpoint
app.get('/', (req, res) => {
  res.send('Server berjalan!');
});

// Routing
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

export default app;