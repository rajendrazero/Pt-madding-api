import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/user.router';
import authRoutes from './routes/auth.router';

dotenv.config();
const app = express();

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

export default app;