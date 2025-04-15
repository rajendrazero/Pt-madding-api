"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const app_1 = __importDefault(require("./app")); // Mengimpor app dari app.ts
const PORT = process.env.PORT || 3000; // Tentukan port, default 3000
// Jalankan server
app_1.default.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
