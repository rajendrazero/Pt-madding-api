import express, { Application } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.router';
import adminRoutes from './routes/admin.router';
import userRoutes from './routes/user.router';

const app: Application = express();

// CORS configuration
// const allowedOrigins = [
//   'http://localhost:5173',
//   'https://pt-madding-api-production.up.railway.app',
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
// }));
// 
//Handle preflight requests
// app.options('*', cors());

app.use(cors());

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