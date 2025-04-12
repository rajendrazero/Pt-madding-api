"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = void 0;
const db_1 = require("../utils/db");
// Ambil semua user dari tabel "User"
const getAllUsers = async (req, res) => {
    try {
        const result = await db_1.pool.query('SELECT id, email, createdAt FROM "User" WHERE "isDeleted" = false');
        res.json(result.rows);
    }
    catch (error) {
        console.error('Gagal mengambil user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getAllUsers = getAllUsers;
