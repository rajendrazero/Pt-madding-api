"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeletedUsers = exports.recoverUser = exports.getUsersPaginated = exports.deleteUser = exports.updateUser = exports.getAllUsers = void 0;
const user_service_1 = require("../services/user.service");
const user_validation_1 = require("../validations/user.validation");
const zod_1 = require("zod");
const db_1 = require("../utils/db");
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
const recoverUser = async (req, res) => {
    const { id } = req.params;
    try {
        await (0, user_service_1.recoverUserById)(id);
        res.status(200).json({ message: 'User berhasil dipulihkan' });
    }
    catch (error) {
        console.error('Gagal recovery user:', error);
        res.status(500).json({ error: 'Gagal memulihkan user' });
    }
};
exports.recoverUser = recoverUser;
const getDeletedUsers = async (req, res) => {
    try {
        const { keyword, role, is_verified, page = '1', limit = '10' } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;
        const values = [];
        const filters = ['is_deleted = true'];
        let idx = 1;
        if (keyword) {
            filters.push(`(username ILIKE $${idx} OR email ILIKE $${idx})`);
            values.push(`%${keyword}%`);
            idx++;
        }
        if (role) {
            filters.push(`role = $${idx}`);
            values.push(role);
            idx++;
        }
        if (typeof is_verified === 'boolean' || is_verified === 'true' || is_verified === 'false') {
            filters.push(`is_verified = $${idx}`);
            values.push(is_verified === 'true');
            idx++;
        }
        const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
        const countQuery = `SELECT COUNT(*) FROM users ${whereClause}`;
        const countRes = await db_1.pool.query(countQuery, values);
        const total = parseInt(countRes.rows[0].count, 10);
        const dataQuery = `
      SELECT id, username, email, role, is_verified, created_at
      FROM users
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${idx} OFFSET $${idx + 1}
    `;
        const dataRes = await db_1.pool.query(dataQuery, [...values, limitNum, offset]);
        res.status(200).json({
            data: dataRes.rows,
            total,
            currentPage: pageNum,
            totalPages: Math.ceil(total / limitNum),
        });
    }
    catch (error) {
        console.error('Gagal ambil user terhapus:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat ambil user terhapus' });
    }
};
exports.getDeletedUsers = getDeletedUsers;
