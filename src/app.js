"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_router_1 = require("./routes/auth.router");
var user_router_1 = require("./routes/user.router");
var app = (0, express_1.default)();
app.use(express_1.default.json());
// Tambahkan endpoint dasar untuk tes
app.get('/', function (req, res) {
    res.send('Server berjalan!');
});
app.use('/api/auth', auth_router_1.default);
app.use('/api/users', user_router_1.default);
exports.default = app;
