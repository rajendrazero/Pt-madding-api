"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./app"); // Import aplikasi Express yang sudah dibuat
var dotenv_1 = require("dotenv");
var cors_1 = require("cors"); // Import middleware CORS

dotenv_1.default.config();

// Menggunakan CORS middleware untuk mengatasi masalah CORS
app_1.default.use(cors_1.default({
  origin: 'http://localhost:5173', // Sesuaikan dengan domain front-end Anda
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Metode HTTP yang diperbolehkan
  allowedHeaders: ['Content-Type', 'Authorization'], // Header yang diperbolehkan
}));

// Import cron job agar dapat dijalankan saat server berjalan
require("./utils/cron"); // Pastikan path ke cron.ts sudah benar

var PORT = process.env.PORT || 3000;
app_1.default.listen(PORT, function () {
    console.log("Server is running on port ".concat(PORT));
});