import express, { Application } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.router';
import adminRoutes from './routes/admin.router';
import userRoutes from './routes/user.router';

const app: Application = express();

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
}

app.use(cors(corsOptions))
// TIDAK PERLU: app.options('*', cors()) karena sudah dicover di app.use(cors(...))

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