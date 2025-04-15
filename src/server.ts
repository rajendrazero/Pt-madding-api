import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser'; // kalau kamu pakai ini
import authRoutes from './routes/auth'; // misalnya

const app = express();

// === Middleware CORS ===
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware lainnya
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === Routes ===
app.use('/api/auth', authRoutes);

export default app;