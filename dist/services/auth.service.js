"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const db_1 = require("../utils/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../utils/jwt");
const registerUser = async (email, password) => {
    // Cek apakah email sudah digunakan
    const existingUser = await db_1.pool.query('SELECT * FROM "User" WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
        throw new Error('Email sudah digunakan.');
    }
    // Enkripsi password
    const hashed = await bcryptjs_1.default.hash(password, 10);
    // Simpan user ke database
    const newUser = await db_1.pool.query('INSERT INTO "User" (email, password) VALUES ($1, $2) RETURNING id, email', [email, hashed]);
    return newUser.rows[0]; // { id, email }
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    // Cek user berdasarkan email
    const userResult = await db_1.pool.query('SELECT * FROM "User" WHERE email = $1', [email]);
    const user = userResult.rows[0];
    if (!user) {
        throw new Error('Email tidak ditemukan.');
    }
    // Bandingkan password
    const isValid = await bcryptjs_1.default.compare(password, user.password);
    if (!isValid) {
        throw new Error('Password salah.');
    }
    // Buat token
    const token = (0, jwt_1.generateToken)({ id: user.id, email: user.email });
    return { token };
};
exports.loginUser = loginUser;
