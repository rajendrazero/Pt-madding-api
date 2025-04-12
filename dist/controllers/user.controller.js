"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersWithFilters = exports.deleteUser = exports.updateUser = exports.createUser = exports.getAllUsers = void 0;
const user_service_1 = require("../services/user.service");
const uuid_1 = require("uuid");
const getAllUsers = async (req, res) => {
    try {
        const users = await (0, user_service_1.fetchAllUsers)();
        res.status(200).json({ success: true, data: users });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data pengguna.', error: err });
    }
};
exports.getAllUsers = getAllUsers;
const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: 'Semua field wajib diisi.' });
        }
        const id = (0, uuid_1.v4)();
        await (0, user_service_1.insertUser)({ id, username, email, password });
        res.status(201).json({ success: true, message: 'Pengguna berhasil ditambahkan.' });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Gagal menambahkan pengguna.', error: err });
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password } = req.body;
        await (0, user_service_1.updateUserById)({ id, username, email, password });
        res.status(200).json({ success: true, message: 'Pengguna berhasil diperbarui.' });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Gagal memperbarui pengguna.', error: err });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await (0, user_service_1.softDeleteUserById)(id);
        res.status(200).json({ success: true, message: 'Pengguna berhasil dihapus (soft delete).' });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Gagal menghapus pengguna.', error: err });
    }
};
exports.deleteUser = deleteUser;
const getUsersWithFilters = async (req, res) => {
    try {
        const { keyword, role, is_verified, page, limit } = req.query;
        const users = await (0, user_service_1.getUsersWithFilterAndPagination)({
            keyword: keyword,
            role: role,
            is_verified: is_verified === 'true' ? true : is_verified === 'false' ? false : undefined,
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 10
        });
        res.status(200).json({ success: true, ...users });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data pengguna dengan filter.', error: err });
    }
};
exports.getUsersWithFilters = getUsersWithFilters;
