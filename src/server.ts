// src/server.ts
import app from './app';  // Mengimpor app dari app.ts

const PORT = process.env.PORT || 3000;  // Tentukan port, default 3000

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});