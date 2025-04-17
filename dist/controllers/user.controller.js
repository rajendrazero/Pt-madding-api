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
exports.uploadProfileImage = exports.getUserByIdHandler = exports.getDeletedUsers = exports.recoverUser = exports.deleteUser = exports.updateOwnProfile = exports.updateUser = exports.getUsersPaginated = exports.getAllUsers = void 0;
const user_service_1 = require("../services/user.service");
const user_validation_1 = require("../validations/user.validation");
const zod_1 = require("zod");
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
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const parsed = user_validation_1.updateUserSchema.parse(req.body); // Validasi update
        yield (0, user_service_1.updateUserById)(Object.assign({ id }, parsed)); // Lakukan update
        const updatedUser = yield (0, user_service_1.getUserById)(id); // Ambil user yang sudah diperbarui
        res.status(200).json({
            message: 'User berhasil diupdate',
            user: updatedUser
        });
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
        const updatedUser = yield (0, user_service_1.getUserById)(userId); // Ambil data terbaru
        res.status(200).json({
            message: 'Profil berhasil diperbarui',
            user: updatedUser
        });
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
        const result = yield (0, user_service_1.getDeletedUsersService)(req.query);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Gagal ambil user terhapus:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat ambil user terhapus' });
    }
});
exports.getDeletedUsers = getDeletedUsers;
const getUserByIdHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { includeDeleted } = req.query; // Menggunakan query untuk menentukan apakah termasuk yang terhapus
    try {
        const user = yield (0, user_service_1.getUserById)(id, includeDeleted === 'true'); // Cek apakah includeDeleted = 'true'
        if (user) {
            res.status(200).json(user); // Jika user ditemukan, kirimkan data
        }
        else {
            res.status(404).json({ error: 'User tidak ditemukan' }); // Jika tidak ditemukan
        }
    }
    catch (error) {
        console.error('Gagal mengambil user:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat mengambil user' });
    }
});
exports.getUserByIdHandler = getUserByIdHandler;
const uploadProfileImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized: user ID not found' });
        return;
    }
    const fileUrl = (0, user_service_1.generateProfileImageUrl)(req);
    if (!fileUrl) {
        res.status(400).json({ message: 'Tidak ada file yang diupload.' });
        return;
    }
    try {
        // Update field photo_url di database
        yield (0, user_service_1.updateOwnProfileById)({ id: userId, photo_url: fileUrl });
        const updatedUser = yield (0, user_service_1.getUserById)(userId);
        res.status(200).json({
            message: 'Upload berhasil & profil diperbarui',
            url: fileUrl,
            user: updatedUser
        });
    }
    catch (error) {
        console.error('Gagal update photo_url:', error);
        res.status(500).json({ error: 'Gagal menyimpan URL foto ke database' });
    }
});
exports.uploadProfileImage = uploadProfileImage;
