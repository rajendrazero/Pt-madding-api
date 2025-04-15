"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var auth_router_1 = require("./routes/auth.router");
var admin_router_1 = require("./routes/admin.router");
var user_router_1 = require("./routes/user.router");
var app = (0, express_1.default)();
// Middleware JSON
app.use(express_1.default.json());
// Tambahkan konfigurasi CORS
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
// Menangani preflight request
app.options('*', (0, cors_1.default)());
// Tes endpoint
app.get('/', function (req, res) {
    res.send('Server berjalan!');
});
// Routes utama
app.use('/api/auth', auth_router_1.default);
app.use('/api/admin', admin_router_1.default); // Admin only
app.use('/api/user', user_router_1.default); // User biasa
exports.default = app;
