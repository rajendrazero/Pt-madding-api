"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./app"); // Import aplikasi Express yang sudah dibuat
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
// Import cron job agar dapat dijalankan saat server berjalan
require("./utils/cron"); // Pastikan path ke cron.ts sudah benar
var PORT = process.env.PORT || 3000;
app_1.default.listen(PORT, function () {
    console.log(Server, is, running, on, port, $, { PORT: PORT });
});
