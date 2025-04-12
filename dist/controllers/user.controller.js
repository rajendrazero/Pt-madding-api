"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getAllUsers = void 0;
const user_service_1 = require("../services/user.service");
const uuid_1 = require("uuid");
/**
 * Handler untuk mengambil semua user dari database
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await (0, user_service_1.fetchAllUsers)(); // Ambil semua user dari service
        res.status(200).json(users); // Kirim response 200 OK dengan data user
    }
    catch (error) {
        console.error('Gagal mengambil user:', error); // Logging jika error
        res.status(500).json({ error: 'Internal Server Error' }); // Kirim response 500
    }
};
exports.getAllUsers = getAllUsers;
/**
 * Handler untuk membuat user baru
 */
const createUser = async (req, res) => {
    const { username, email, password } = req.body; // Ambil data dari body
    // Validasi data
    if (!username || !email || !password) {
        res.status(400).json({ error: 'Field tidak lengkap!' }); // Kirim response 400 Bad Request
        return; // Hentikan eksekusi
    }
    try {
        const id = (0, uuid_1.v4)(); // Generate UUID unik
        await (0, user_service_1.insertUser)({ id, username, email, password }); // Simpan ke DB lewat service
        res.status(201).json({ message: 'User berhasil ditambahkan', id }); // Kirim response sukses
    }
    catch (error) {
        console.error('Gagal menambahkan user:', error); // Logging jika gagal
        res.status(500).json({ error: 'Gagal menambahkan user' }); // Kirim response 500
    }
};
exports.createUser = createUser;
