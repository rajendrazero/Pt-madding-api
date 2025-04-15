"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
var app_1 = require("./app"); // Mengimpor app dari app.ts
var PORT = process.env.PORT || 3000; // Tentukan port, default 3000
// Jalankan server
app_1.default.listen(PORT, function () {
    console.log("Server berjalan di http://localhost:".concat(PORT));
});
