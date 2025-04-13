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
exports.handleRefreshToken = exports.checkRole = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../utils/jwt");
const verifyToken = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        res.status(403).json({ error: 'Token tidak ditemukan' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ error: 'Token tidak valid atau sudah kadaluarsa' });
        return;
    }
};
exports.verifyToken = verifyToken;
const checkRole = (role) => {
    return (req, res, next) => {
        var _a;
        const userRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        if (userRole !== role) {
            res.status(403).json({ error: 'Akses ditolak. Role tidak sesuai.' });
            return;
        }
        next();
    };
};
exports.checkRole = checkRole;
const handleRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (!refreshToken) {
        throw new Error('Refresh token tidak ditemukan');
    }
    try {
        // Verifikasi refresh token
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_SECRET);
        // Generate access token baru dan refresh token baru
        return (0, jwt_1.generateToken)(decoded.userId, decoded.email, decoded.role);
    }
    catch (err) {
        throw new Error('Refresh token tidak valid atau sudah kadaluarsa');
    }
});
exports.handleRefreshToken = handleRefreshToken;
