"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var authenticate = function (req, res, next) {
    var _a;
    var token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token)
        return res.status(401).json({ message: 'Token tidak ada' });
    try {
        var payload = jsonwebtoken_1.default.verify(token, process.env.SECRET);
        req.body.user = payload; // Tambah user ke body
        next();
    }
    catch (err) {
        res.status(403).json({ message: 'Token tidak valid' });
    }
};
exports.authenticate = authenticate;
