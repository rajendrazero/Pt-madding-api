"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_controller_1 = require("../controllers/auth.controller");
var router = (0, express_1.Router)();
// Route untuk registrasi dan pengiriman kode verifikasi
router.post('/register', auth_controller_1.register); // Simpan data sementara + kirim kode
// Route untuk verifikasi kode
router.post('/verify-code', auth_controller_1.verifyCode); // Verifikasi kode dan simpan permanen
// Route untuk mengirim ulang kode verifikasi
router.post('/resend-code', auth_controller_1.resendCode); // Kirim ulang kode verifikasi
exports.default = router;
