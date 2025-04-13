import express from 'express';
import authRoutes from './routes/auth.router';
import adminRoutes from './routes/admin.router';
import userRoutes from './routes/user.router';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server berjalan!');
});

app.use('/api/auth', authRoutes);
app.use('/api/admin',adminRoutes); // Admin only
app.use('/api/user', userRoutes); // User biasa

export default app;