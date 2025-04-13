"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_router_1 = __importDefault(require("./routes/auth.router"));
const admin_router_1 = __importDefault(require("./routes/admin.router"));
const user_router_1 = __importDefault(require("./routes/user.router"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Server berjalan!');
});
app.use('/api/auth', auth_router_1.default);
app.use('/api/admin', admin_router_1.default); // Admin only
app.use('/api/user', user_router_1.default); // User biasa
exports.default = app;
