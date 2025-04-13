"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
// Middleware untuk memverifikasi JWT
var verifyToken = function (req, res, next) {
    var _a;
    var token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Ambil token dari header Authorization
    if (!token) {
        res.status(403).json({ error: 'Token tidak ditemukan' });
        return; // Setelah merespon error, kita cukup "return" tanpa melanjutkan ke next()
    }
    try {
        var decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Menyimpan informasi user pada request
        next(); // Melanjutkan ke route selanjutnya
    }
    catch (err) {
        res.status(401).json({ error: 'Token tidak valid atau sudah kadaluarsa' });
        return; // Tidak perlu lanjutkan eksekusi, cukup "return" setelah merespons error
    }
};
exports.verifyToken = verifyToken;
