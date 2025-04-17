import express, { Application } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.router';
import userRoutes from './routes/user.router';
import path from 'path';

const app: Application = express();

// Deklarasikan allowedOrigins SEBELUM dipakai
const allowedOrigins = [
    'http://localhost:5173',
    'https://litera9.vercel.app',
    'https://litera9-git-main-rajendrazeros-projects.vercel.app',
    'https://litera9-rajendrazeros-projects.vercel.app',
];

// CORS setup
const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Test endpoint
app.get('/', (req, res) => {
  res.send('Server berjalan!');
});


// Middleware untuk melayani file statis dari folder 'uploads'
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

export default app;