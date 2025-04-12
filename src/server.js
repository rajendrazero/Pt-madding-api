"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import aplikasi Express yang kita buat di app.ts
var app_1 = require("./app");
// Import variabel dari file .env
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
// Ambil PORT dari .env atau pakai default 3000
var PORT = process.env.PORT || 3000;
// Jalankan server
app_1.default.listen(PORT, function () {
    console.log("Server is running on port ".concat(PORT));
});
