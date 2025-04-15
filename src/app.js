"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var auth_router_1 = require("./routes/auth.router");
var admin_router_1 = require("./routes/admin.router");
var user_router_1 = require("./routes/user.router");
var app = (0, express_1.default)();
var allowedOrigins = [
    'http://localhost:5173',
    'https://pt-madding-web.vercel.app' // ganti dengan domain frontend kamu di production
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// handle preflight
app.options('*', (0, cors_1.default)());
// Middleware
app.use(express_1.default.json());
// Test endpoint
app.get('/', function (req, res) {
    res.send('Server berjalan!');
});
// Routes
app.use('/api/auth', auth_router_1.default);
app.use('/api/admin', admin_router_1.default);
app.use('/api/user', user_router_1.default);
exports.default = app;
