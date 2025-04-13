"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.cleanUnverified = exports.resendVerificationCode = exports.verifyUserCode = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const mailer_1 = require("../utils/mailer");
const db_1 = require("../utils/db");
const jwt_1 = require("../utils/jwt");
// Generate random 6-digit code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
const registerUser = (username, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const { rows: existingUsers } = yield db_1.pool.query('SELECT 1 FROM users WHERE email = $1', [email]);
    if (existingUsers.length > 0)
        throw new Error('Email sudah terdaftar');
    const id = (0, uuid_1.v4)();
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const code = generateVerificationCode();
    yield db_1.pool.query('INSERT INTO users (id, username, email, password, is_verified) VALUES ($1, $2, $3, $4, false)', [id, username, email, hashedPassword]);
    yield saveVerificationCode(email, code);
    yield (0, mailer_1.sendEmail)(email, 'Kode Verifikasi', `Kode kamu: ${code}`);
});
exports.registerUser = registerUser;
const verifyUserCode = (email, code) => __awaiter(void 0, void 0, void 0, function* () {
    const { rows } = yield db_1.pool.query('SELECT * FROM verification_codes WHERE email = $1', [email]);
    if (!rows.length)
        throw new Error('Kode tidak ditemukan');
    const record = rows[0];
    const expired = new Date().getTime() - new Date(record.created_at).getTime() >
        10 * 60 * 1000;
    if (record.code !== code)
        throw new Error('Kode salah');
    if (expired)
        throw new Error('Kode verifikasi sudah kedaluwarsa');
    yield db_1.pool.query('UPDATE users SET is_verified = true WHERE email = $1', [email]);
    yield db_1.pool.query('DELETE FROM verification_codes WHERE email = $1', [email]);
});
exports.verifyUserCode = verifyUserCode;
const resendVerificationCode = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const { rows: users } = yield db_1.pool.query('SELECT is_verified FROM users WHERE email = $1', [email]);
    if (!users.length)
        throw new Error('Email belum terdaftar');
    if (users[0].is_verified)
        throw new Error('Akun sudah diverifikasi');
    const code = generateVerificationCode();
    yield saveVerificationCode(email, code);
    yield (0, mailer_1.sendEmail)(email, 'Kode Verifikasi Baru', `Kode verifikasi terbaru kamu: ${code}`);
});
exports.resendVerificationCode = resendVerificationCode;
const saveVerificationCode = (email, code) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.pool.query(`INSERT INTO verification_codes (id, email, code)
     VALUES ($1, $2, $3)
     ON CONFLICT (email)
     DO UPDATE SET code = EXCLUDED.code, created_at = CURRENT_TIMESTAMP`, [(0, uuid_1.v4)(), email, code]);
});
const cleanUnverified = () => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.pool.query(`
    DELETE FROM users
    WHERE is_verified = false AND created_at < NOW() - INTERVAL '24 hours'
  `);
});
exports.cleanUnverified = cleanUnverified;
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const { rows } = yield db_1.pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (!rows.length)
        throw new Error('Email tidak ditemukan');
    const user = rows[0];
    if (!user.is_verified)
        throw new Error('Akun belum diverifikasi');
    const valid = yield bcryptjs_1.default.compare(password, user.password);
    if (!valid)
        throw new Error('Password salah');
    // Generate JWT token
    return (0, jwt_1.generateToken)(user.id, user.email, user.role); // Pastikan ini mengembalikan objek dengan accessToken dan refreshToken
});
exports.loginUser = loginUser;
