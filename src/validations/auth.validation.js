"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.resendCodeSchema = exports.verifyCodeSchema = exports.registerSchema = void 0;
// src/validations/auth.validation.ts
var zod_1 = require("zod");
// Validasi untuk registrasi
exports.registerSchema = zod_1.z.object({
    username: zod_1.z.string().min(3, { message: 'Username harus memiliki minimal 3 karakter' }),
    email: zod_1.z.string().email({ message: 'Email tidak valid' }),
    password: zod_1.z.string().min(6, { message: 'Password harus memiliki minimal 6 karakter' })
});
// Validasi untuk verifikasi kode
exports.verifyCodeSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: 'Email tidak valid' }),
    code: zod_1.z.string().length(6, { message: 'Kode verifikasi harus memiliki 6 digit' })
});
// Validasi untuk mengirim ulang kode verifikasi
exports.resendCodeSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: 'Email tidak valid' })
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: 'Email tidak valid' }),
    password: zod_1.z.string().min(6, { message: 'Password wajib diisi' })
});
