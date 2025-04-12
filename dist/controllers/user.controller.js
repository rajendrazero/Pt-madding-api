"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersPaginated = exports.deleteUser = exports.updateUser = exports.createUser = exports.getAllUsers = void 0;
const user_service_1 = require("../services/user.service");
const uuid_1 = require("uuid");
const user_validation_1 = require("../validations/user.validation");
const zod_1 = require("zod");
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
    try {
        const parsed = user_validation_1.createUserSchema.parse(req.body); // Validasi pakai Zod
        const id = (0, uuid_1.v4)();
        await (0, user_service_1.insertUser)({ id, ...parsed });
        res.status(201).json({ message: 'User berhasil ditambahkan', id });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: error.errors.map(e => e.message) });
        }
        console.error('Gagal menambahkan user:', error);
        res.status(500).json({ error: 'Gagal menambahkan user' });
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    const { id } = req.params;
    try {
        const parsed = user_validation_1.updateUserSchema.parse(req.body); // Validasi update
        await (0, user_service_1.updateUserById)({ id, ...parsed });
        res.status(200).json({ message: 'User berhasil diupdate' });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: error.errors.map(e => e.message) });
            return;
        }
        console.error('Gagal update user:', error);
        res.status(500).json({ error: 'Gagal update user' });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await (0, user_service_1.softDeleteUserById)(id);
        res.status(200).json({ message: 'User berhasil dihapus (soft delete)' });
    }
    catch (error) {
        console.error('Gagal hapus user:', error);
        res.status(500).json({ error: 'Gagal hapus user' });
    }
};
exports.deleteUser = deleteUser;
const getUsersPaginated = async (req, res) => {
    try {
        const { keyword, role, is_verified, page = '1', limit = '10' } = req.query;
        const data = await (0, user_service_1.getUsersWithFilterAndPagination)({
            keyword: keyword?.toString(),
            role: role?.toString(),
            is_verified: is_verified === 'true' ? true : is_verified === 'false' ? false : undefined,
            page: parseInt(page),
            limit: parseInt(limit)
        });
        res.status(200).json(data);
    }
    catch (error) {
        console.error('Gagal filter + pagination:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat filter data user' });
    }
};
exports.getUsersPaginated = getUsersPaginated;
