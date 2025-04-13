"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware"); // Pastikan path benar
const router = (0, express_1.Router)();
// Route untuk registrasi dan pengiriman kode verifikasi
router.post('/register', auth_controller_1.register); // Simpan data sementara + kirim kode
// Route untuk verifikasi kode
router.post('/verify-code', auth_controller_1.verifyCode); // Verifikasi kode dan simpan permanen
// Route untuk mengirim ulang kode verifikasi
router.post('/resend-code', auth_controller_1.resendCode); // Kirim ulang kode verifikasi
router.post('/login', auth_controller_1.login); // Login setelah verifikasi
// Protected Routes (hanya bisa diakses setelah login)
router.get('/profile', auth_middleware_1.verifyToken, (req, res) => {
    // Akses data user dari JWT
    const user = req.user;
    res.status(200).json({ message: 'Profile user', user });
});
exports.default = router;
