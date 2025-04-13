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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.cleanUnverified = exports.resendVerificationCode = exports.verifyUserCode = exports.registerUser = void 0;
var bcryptjs_1 = require("bcryptjs");
var uuid_1 = require("uuid");
var mailer_1 = require("../utils/mailer");
var db_1 = require("../utils/db");
var jwt_1 = require("../utils/jwt");
// Generate random 6-digit code
var generateVerificationCode = function () {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
var registerUser = function (username, email, password) { return __awaiter(void 0, void 0, Promise, function () {
    var existingUsers, id, hashedPassword, code;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.pool.query('SELECT 1 FROM users WHERE email = $1', [email])];
            case 1:
                existingUsers = (_a.sent()).rows;
                if (existingUsers.length > 0)
                    throw new Error('Email sudah terdaftar');
                id = (0, uuid_1.v4)();
                return [4 /*yield*/, bcryptjs_1.default.hash(password, 10)];
            case 2:
                hashedPassword = _a.sent();
                code = generateVerificationCode();
                return [4 /*yield*/, db_1.pool.query('INSERT INTO users (id, username, email, password, is_verified) VALUES ($1, $2, $3, $4, false)', [id, username, email, hashedPassword])];
            case 3:
                _a.sent();
                return [4 /*yield*/, saveVerificationCode(email, code)];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, mailer_1.sendEmail)(email, 'Kode Verifikasi', "Kode kamu: ".concat(code))];
            case 5:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.registerUser = registerUser;
var verifyUserCode = function (email, code) { return __awaiter(void 0, void 0, Promise, function () {
    var rows, record, expired;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.pool.query('SELECT * FROM verification_codes WHERE email = $1', [email])];
            case 1:
                rows = (_a.sent()).rows;
                if (!rows.length)
                    throw new Error('Kode tidak ditemukan');
                record = rows[0];
                expired = new Date().getTime() - new Date(record.created_at).getTime() >
                    10 * 60 * 1000;
                if (record.code !== code)
                    throw new Error('Kode salah');
                if (expired)
                    throw new Error('Kode verifikasi sudah kedaluwarsa');
                return [4 /*yield*/, db_1.pool.query('UPDATE users SET is_verified = true WHERE email = $1', [email])];
            case 2:
                _a.sent();
                return [4 /*yield*/, db_1.pool.query('DELETE FROM verification_codes WHERE email = $1', [email])];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.verifyUserCode = verifyUserCode;
var resendVerificationCode = function (email) { return __awaiter(void 0, void 0, Promise, function () {
    var users, code;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.pool.query('SELECT is_verified FROM users WHERE email = $1', [email])];
            case 1:
                users = (_a.sent()).rows;
                if (!users.length)
                    throw new Error('Email belum terdaftar');
                if (users[0].is_verified)
                    throw new Error('Akun sudah diverifikasi');
                code = generateVerificationCode();
                return [4 /*yield*/, saveVerificationCode(email, code)];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, mailer_1.sendEmail)(email, 'Kode Verifikasi Baru', "Kode verifikasi terbaru kamu: ".concat(code))];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.resendVerificationCode = resendVerificationCode;
var saveVerificationCode = function (email, code) { return __awaiter(void 0, void 0, Promise, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.pool.query("INSERT INTO verification_codes (id, email, code)\n     VALUES ($1, $2, $3)\n     ON CONFLICT (email)\n     DO UPDATE SET code = EXCLUDED.code, created_at = CURRENT_TIMESTAMP", [(0, uuid_1.v4)(), email, code])];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var cleanUnverified = function () { return __awaiter(void 0, void 0, Promise, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.pool.query("\n    DELETE FROM users\n    WHERE is_verified = false AND created_at < NOW() - INTERVAL '24 hours'\n  ")];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.cleanUnverified = cleanUnverified;
var loginUser = function (email, password) { return __awaiter(void 0, void 0, Promise, function () {
    var rows, user, valid, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.pool.query('SELECT * FROM users WHERE email = $1', [email])];
            case 1:
                rows = (_a.sent()).rows;
                if (!rows.length)
                    throw new Error('Email tidak ditemukan');
                user = rows[0];
                if (!user.is_verified)
                    throw new Error('Akun belum diverifikasi');
                return [4 /*yield*/, bcryptjs_1.default.compare(password, user.password)];
            case 2:
                valid = _a.sent();
                if (!valid)
                    throw new Error('Password salah');
                token = (0, jwt_1.generateToken)(user.id, user.email);
                return [2 /*return*/, token];
        }
    });
}); };
exports.loginUser = loginUser;
