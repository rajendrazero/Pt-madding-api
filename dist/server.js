"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import aplikasi Express yang kita buat di app.ts
const app_1 = __importDefault(require("./app"));
// Import variabel dari file .env
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Ambil PORT dari .env atau pakai default 3000
const PORT = process.env.PORT || 3000;
// Jalankan server
app_1.default.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
