"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOwnProfileSchema = exports.createUserSchema = exports.updateUserSchema = void 0;
var zod_1 = require("zod");
// Validasi untuk update user (boleh sebagian)
exports.updateUserSchema = zod_1.z.object({
    username: zod_1.z.string().min(3).optional(),
    email: zod_1.z.string().email().optional(),
    password: zod_1.z.string().min(6).optional(),
    photo_url: zod_1.z.string().url().optional(),
    gender: zod_1.z.string().optional(),
    class: zod_1.z.string().max(50).optional(),
    description: zod_1.z.string().optional(),
}).refine(function (data) { return Object.keys(data).some(function (key) { return data[key] !== undefined; }); }, {
    message: "Minimal satu field harus diisi"
});
// Validasi untuk membuat user baru + kode verifikasi
exports.createUserSchema = zod_1.z.object({
    username: zod_1.z.string().min(3, "Username minimal 3 karakter"),
    email: zod_1.z.string().email("Format email tidak valid"),
    password: zod_1.z.string().min(6, "Password minimal 6 karakter"),
    code: zod_1.z.string().length(6, "Kode verifikasi harus 6 digit angka"),
});
exports.updateOwnProfileSchema = zod_1.z.object({
    username: zod_1.z.string().min(3).optional(),
    email: zod_1.z.string().email().optional(),
    password: zod_1.z.string().min(6).optional(),
    photo_url: zod_1.z.string().url().optional(),
    gender: zod_1.z.string().optional(),
    class: zod_1.z.string().max(50).optional(),
    description: zod_1.z.string().optional(),
}).refine(function (data) { return Object.keys(data).some(function (key) { return data[key] !== undefined; }); }, {
    message: "Minimal satu field harus diisi"
});
