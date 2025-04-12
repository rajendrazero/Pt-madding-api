"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app")); // Import aplikasi Express yang sudah dibuat
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Import cron job agar dapat dijalankan saat server berjalan
require("./utils/cron"); // Pastikan path ke cron.ts sudah benar
const PORT = process.env.PORT || 3000;
app_1.default.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
