"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await (0, auth_service_1.registerUser)(email, password);
        res.status(201).json({ message: 'Pendaftaran berhasil', user });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await (0, auth_service_1.loginUser)(email, password);
        res.json({ message: 'Login berhasil', ...result });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.login = login;
