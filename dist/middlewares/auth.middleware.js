"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRefreshToken = exports.checkRole = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../utils/jwt");
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
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
        const userRole = req.user?.role;
        if (userRole !== role) {
            res.status(403).json({ error: 'Akses ditolak. Role tidak sesuai.' });
            return;
        }
        next();
    };
};
exports.checkRole = checkRole;
const handleRefreshToken = async (refreshToken) => {
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
};
exports.handleRefreshToken = handleRefreshToken;
