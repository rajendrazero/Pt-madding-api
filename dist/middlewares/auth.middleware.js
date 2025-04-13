"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware untuk memverifikasi JWT
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Ambil token dari header Authorization
    if (!token) {
        res.status(403).json({ error: 'Token tidak ditemukan' });
        return; // Setelah merespon error, kita cukup "return" tanpa melanjutkan ke next()
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Menyimpan informasi user pada request
        next(); // Melanjutkan ke route selanjutnya
    }
    catch (err) {
        res.status(401).json({ error: 'Token tidak valid atau sudah kadaluarsa' });
        return; // Tidak perlu lanjutkan eksekusi, cukup "return" setelah merespons error
    }
};
exports.verifyToken = verifyToken;
