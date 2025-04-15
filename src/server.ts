import app from './app';  // Import aplikasi Express yang sudah dibuat
import dotenv from 'dotenv';
dotenv.config();

// Import cron job agar dapat dijalankan saat server berjalan
import './utils/cron';  // Pastikan path ke cron.ts sudah benar

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log(Server is running on port ${PORT});
});

