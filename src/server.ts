// Import aplikasi Express yang kita buat di app.ts
import app from './app';

// Import variabel dari file .env
import dotenv from 'dotenv';
dotenv.config();

// Ambil PORT dari .env atau pakai default 3000
const PORT = process.env.PORT || 3000;

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});