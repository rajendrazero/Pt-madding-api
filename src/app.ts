import express from 'express';
import authRoutes from './routes/auth.router';
import userRoutes from './routes/user.router';

const app = express();
app.use(express.json());

// Tambahkan endpoint dasar untuk tes
app.get('/', (req, res) => {
  res.send('Server berjalan!');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

export default app;