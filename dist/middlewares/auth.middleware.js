"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token)
        return res.status(401).json({ message: 'Token tidak ada' });
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.SECRET);
        req.body.user = payload; // Tambah user ke body
        next();
    }
    catch (err) {
        res.status(403).json({ message: 'Token tidak valid' });
    }
};
exports.authenticate = authenticate;
