"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.login = exports.resendCode = exports.verifyCode = exports.register = void 0;
const auth_validation_1 = require("../validations/auth.validation");
const auth_service_1 = require("../services/auth.service");
const zod_1 = require("zod"); // Pastikan ZodError diimpor dari Zod
const register = async (req, res) => {
    try {
        // Validasi input
        const validatedData = auth_validation_1.registerSchema.parse(req.body);
        const { username, email, password } = validatedData;
        // Panggil service untuk registrasi
        await (0, auth_service_1.registerUser)(username, email, password);
        res.status(201).json({ message: 'Registrasi berhasil. Cek email untuk kode verifikasi.' });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ error: error.errors });
        }
        else if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Terjadi kesalahan yang tidak diketahui' });
        }
    }
};
exports.register = register;
const verifyCode = async (req, res) => {
    try {
        // Validasi input
        const validatedData = auth_validation_1.verifyCodeSchema.parse(req.body);
        const { email, code } = validatedData;
        // Panggil service untuk verifikasi kode
        await (0, auth_service_1.verifyUserCode)(email, code);
        res.status(200).json({ message: 'Akun berhasil diverifikasi' });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ error: error.errors });
        }
        else if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Terjadi kesalahan yang tidak diketahui' });
        }
    }
};
exports.verifyCode = verifyCode;
const resendCode = async (req, res) => {
    try {
        // Validasi input
        const validatedData = auth_validation_1.resendCodeSchema.parse(req.body);
        const { email } = validatedData;
        // Panggil service untuk mengirim ulang kode
        await (0, auth_service_1.resendVerificationCode)(email);
        res.status(200).json({ message: 'Kode verifikasi baru telah dikirimkan ke email.' });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ error: error.errors });
        }
        else if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Terjadi kesalahan yang tidak diketahui' });
        }
    }
};
exports.resendCode = resendCode;
const login = async (req, res) => {
    try {
        // Validasi input
        const validatedData = auth_validation_1.loginSchema.parse(req.body);
        const { email, password } = validatedData;
        // Panggil service untuk login dan mendapatkan access token serta refresh token
        const { accessToken, refreshToken } = await (0, auth_service_1.loginUser)(email, password);
        res.status(200).json({ message: 'Login berhasil', accessToken, refreshToken });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ error: error.errors });
        }
        else if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Terjadi kesalahan yang tidak diketahui' });
        }
    }
};
exports.login = login;
// Endpoint untuk refresh token
const refreshToken = async (req, res) => {
    const refreshToken = req.body.refreshToken;
    try {
        // Panggil service untuk menangani refresh token
        const { accessToken, refreshToken: newRefreshToken } = await (0, auth_service_1.handleRefreshToken)(refreshToken);
        // Kirimkan kembali access token dan refresh token baru ke client
        res.status(200).json({ accessToken, refreshToken: newRefreshToken });
    }
    catch (err) {
        // Jika terjadi error, kirimkan response error dengan status 401
        res.status(401).json({ error: err.message });
    }
};
exports.refreshToken = refreshToken;
