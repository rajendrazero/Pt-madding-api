"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOwnProfile = exports.getDeletedUsers = exports.recoverUser = exports.deleteUser = exports.getUsersPaginated = exports.updateUser = exports.getAllUsers = void 0;
const user_service_1 = require("../services/user.service");
const user_validation_1 = require("../validations/user.validation");
const zod_1 = require("zod");
const db_1 = require("../utils/db");
/**
 * Handler untuk mengambil semua user dari database
 */
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, user_service_1.fetchAllUsers)(); // Ambil semua user dari service
        res.status(200).json(users); // Kirim response 200 OK dengan data user
    }
    catch (error) {
        console.error('Gagal mengambil user:', error); // Logging jika error
        res.status(500).json({ error: 'Internal Server Error' }); // Kirim response 500
    }
});
exports.getAllUsers = getAllUsers;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const parsed = user_validation_1.updateUserSchema.parse(req.body); // Validasi update
        yield (0, user_service_1.updateUserById)(Object.assign({ id }, parsed));
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
});
exports.updateUser = updateUser;
const getUsersPaginated = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { keyword, role, is_verified, page = '1', limit = '10' } = req.query;
        const data = yield (0, user_service_1.getUsersWithFilterAndPagination)({
            keyword: keyword === null || keyword === void 0 ? void 0 : keyword.toString(),
            role: role === null || role === void 0 ? void 0 : role.toString(),
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
});
exports.getUsersPaginated = getUsersPaginated;
// Hapus akun (soft delete) - untuk pengguna dan admin
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId; // ID pengguna yang sedang login
    const targetUserId = req.params.id; // ID pengguna yang ingin dihapus
    // Cek apakah role adalah admin atau jika pengguna adalah user biasa dan mencoba menghapus dirinya sendiri
    if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === 'admin' || userId === targetUserId) {
        try {
            yield (0, user_service_1.softDeleteUserById)(targetUserId); // Menghapus akun dengan soft delete
            res.status(200).json({ message: 'User berhasil dihapus (soft delete)' });
        }
        catch (error) {
            console.error('Gagal hapus user:', error);
            res.status(500).json({ error: 'Gagal hapus user' });
        }
    }
    else {
        res.status(403).json({ error: 'Forbidden: hanya admin yang bisa menghapus pengguna lain' });
    }
});
exports.deleteUser = deleteUser;
const recoverUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield (0, user_service_1.recoverUserById)(id);
        res.status(200).json({ message: 'User berhasil dipulihkan' });
    }
    catch (error) {
        console.error('Gagal recovery user:', error);
        res.status(500).json({ error: 'Gagal memulihkan user' });
    }
});
exports.recoverUser = recoverUser;
const getDeletedUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const countRes = yield db_1.pool.query(countQuery, values);
        const total = parseInt(countRes.rows[0].count, 10);
        const dataQuery = `
      SELECT id, username, email, role, is_verified, created_at
      FROM users
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${idx} OFFSET $${idx + 1}
    `;
        const dataRes = yield db_1.pool.query(dataQuery, [...values, limitNum, offset]);
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
});
exports.getDeletedUsers = getDeletedUsers;
const updateOwnProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized: user ID not found' });
        return;
    }
    try {
        const parsed = user_validation_1.updateOwnProfileSchema.parse(req.body);
        yield (0, user_service_1.updateOwnProfileById)(Object.assign({ id: userId }, parsed));
        res.status(200).json({ message: 'Profil berhasil diperbarui' });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: error.errors.map(e => e.message) });
            return;
        }
        console.error('Gagal update profil:', error);
        res.status(500).json({ error: 'Gagal update profil' });
    }
});
exports.updateOwnProfile = updateOwnProfile;
