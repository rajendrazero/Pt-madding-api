"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./app"); // Import aplikasi Express yang sudah dibuat
var dotenv_1 = require("dotenv");
var cors_1 = require("cors"); // Tambahkan ini
dotenv_1.default.config();
// Tambahkan ini agar API bisa diakses dari localhost:5173
app_1.default.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Import cron job agar dapat dijalankan saat server berjalan
require("./utils/cron"); // Pastikan path ke cron.ts sudah benar
var PORT = process.env.PORT || 3000;
app_1.default.listen(PORT, function () {
    console.log("Server is running on port ".concat(PORT));
});
