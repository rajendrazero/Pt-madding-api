"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    username: zod_1.z.string().min(3, 'Username minimal 3 karakter'),
    email: zod_1.z.string().email('Email tidak valid'),
    password: zod_1.z.string().min(6, 'Password minimal 6 karakter')
});
exports.updateUserSchema = zod_1.z.object({
    username: zod_1.z.string().min(3).optional(),
    email: zod_1.z.string().email().optional(),
    password: zod_1.z.string().min(6).optional()
});
