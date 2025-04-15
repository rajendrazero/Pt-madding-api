"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var auth_1 = require("./routes/auth"); // misalnya
var app = (0, express_1.default)();
// === Middleware CORS ===
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Middleware lainnya
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// === Routes ===
app.use('/api/auth', auth_1.default);
exports.default = app;
