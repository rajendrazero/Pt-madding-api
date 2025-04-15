import express, { Application } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.router';
import adminRoutes from './routes/admin.router';
import userRoutes from './routes/user.router';

const app: Application = express();

const allowedOrigins = [
  'http://localhost:5173', // untuk local development
  'https://pt-madding-web.vercel.app' // ganti dengan domain frontend kamu di production
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // wajib kalau pakai cookie/JWT dengan auth header
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// handle preflight
app.options('*', cors());

// Middleware
app.use(express.json());

// Test endpoint
app.get('/', (req, res) => {
  res.send('Server berjalan!');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

export default app;