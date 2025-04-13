"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Auth routes
router.post('/register', auth_controller_1.register); // Simpan data sementara + kirim kode
router.post('/verify-code', auth_controller_1.verifyCode); // Verifikasi kode dan simpan permanen
router.post('/resend-code', auth_controller_1.resendCode); // Kirim ulang kode verifikasi
router.post('/login', auth_controller_1.login); // Login setelah verifikasi
// Route untuk tes token saja (tanpa role)
router.get('/me', auth_middleware_1.verifyToken, (req, res) => {
    const user = req.user;
    res.status(200).json({ message: 'Token valid', user });
});
exports.default = router;
