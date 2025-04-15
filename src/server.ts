import app from './app';  // Import aplikasi Express yang sudah dibuat
import dotenv from 'dotenv';
import cors from 'cors'; // Tambahkan ini

dotenv.config();

// Tambahkan ini agar API bisa diakses dari localhost:5173
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Import cron job agar dapat dijalankan saat server berjalan
import './utils/cron';  // Pastikan path ke cron.ts sudah benar

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});