"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_router_1 = require("./routes/auth.router");
var admin_router_1 = require("./routes/admin.router");
var user_router_1 = require("./routes/user.router");
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/', function (req, res) {
    res.send('Server berjalan!');
});
app.use('/api/auth', auth_router_1.default);
app.use('/api/admin', admin_router_1.default); // Admin only
app.use('/api/user', user_router_1.default); // User biasa
exports.default = app;
