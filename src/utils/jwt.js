"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.generateToken = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
// Generate access token dan refresh token
var generateToken = function (userId, email, role) {
    // Generate access token dengan waktu kadaluarsa 30 hari
    var accessToken = jsonwebtoken_1.default.sign({ userId: userId, email: email, role: role }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Access token kadaluarsa dalam 30 hari
    });
    // Generate refresh token dengan waktu kadaluarsa 60 hari
    var refreshToken = jsonwebtoken_1.default.sign({ userId: userId, email: email, role: role }, process.env.JWT_SECRET, {
        expiresIn: '60d', // Refresh token kadaluarsa dalam 60 hari
    });
    // Return access token dan refresh token
    return { accessToken: accessToken, refreshToken: refreshToken };
};
exports.generateToken = generateToken;
// Fungsi untuk decode token (untuk akses token)
var decodeToken = function (token) {
    return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
};
exports.decodeToken = decodeToken;
