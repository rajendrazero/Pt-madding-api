"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var auth_router_js_1 = require("./routes/auth.router.js");
var admin_router_js_1 = require("./routes/admin.router.js");
var user_router_js_1 = require("./routes/user.router.js");
var app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.options('*', (0, cors_1.default)({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
// Tes endpoint
app.get('/', function (req, res) {
    res.send('Server berjalan!');
});
// Routing
app.use('/api/auth', auth_router_js_1.default);
app.use('/api/admin', admin_router_js_1.default);
app.use('/api/user', user_router_js_1.default);
exports.default = app;
