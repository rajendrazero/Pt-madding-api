"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var generateToken = function (user) {
    return jsonwebtoken_1.default.sign(user, process.env.SECRET, { expiresIn: '7d' });
};
exports.generateToken = generateToken;
