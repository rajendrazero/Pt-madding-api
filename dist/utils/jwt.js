"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Generate access token dan refresh token
const generateToken = (userId, email, role) => {
    // Generate access token dengan waktu kadaluarsa 30 hari
    const accessToken = jsonwebtoken_1.default.sign({ userId, email, role }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Access token kadaluarsa dalam 30 hari
    });
    // Generate refresh token dengan waktu kadaluarsa 60 hari
    const refreshToken = jsonwebtoken_1.default.sign({ userId, email, role }, process.env.JWT_SECRET, {
        expiresIn: '60d', // Refresh token kadaluarsa dalam 60 hari
    });
    // Return access token dan refresh token
    return { accessToken, refreshToken };
};
exports.generateToken = generateToken;
// Fungsi untuk decode token (untuk akses token)
const decodeToken = (token) => {
    return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
};
exports.decodeToken = decodeToken;
