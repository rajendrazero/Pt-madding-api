"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersWithFilters = exports.deleteUser = exports.updateUser = exports.createUser = exports.getAllUsers = void 0;
const user_validation_1 = require("../validations/user.validation");
const user_service_1 = require("../services/user.service");
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
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
        const parsed = user_validation_1.createUserSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, errors: parsed.error.flatten().fieldErrors });
        }
        const { username, email, password } = parsed.data;
        const id = (0, uuid_1.v4)();
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        await (0, user_service_1.insertUser)({ id, username, email, password: hashedPassword });
        res.status(201).json({ success: true, message: 'Pengguna berhasil ditambahkan.' });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Gagal menambahkan pengguna.', error: err });
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    try {
        // Convert id dari string ke number
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ success: false, message: 'ID tidak valid.' });
        }
        // Cek apakah user ada dan belum dihapus
        const existingUser = await (0, user_service_1.findUserById)(id);
        if (!existingUser || existingUser.isDeleted) {
            return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan atau sudah dihapus.' });
        }
        // Validasi data request body
        const parsed = user_validation_1.updateUserSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, errors: parsed.error.flatten().fieldErrors });
        }
        const { username, email, password } = parsed.data;
        // Hash password jika ada
        const hashedPassword = password ? await bcrypt_1.default.hash(password, 10) : undefined;
        // Update data user
        const updated = await (0, user_service_1.updateUserById)(id, {
            username,
            email,
            ...(hashedPassword && { password: hashedPassword }),
        });
        res.status(200).json({ success: true, message: 'Pengguna berhasil diperbarui.', data: updated });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Gagal memperbarui pengguna.', error: err });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const existingUser = await (0, user_service_1.findUserById)(id);
        if (!existingUser || existingUser.isDeleted) {
            return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan atau sudah dihapus.' });
        }
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
        const { keyword, role, isVerified, page, limit } = req.query;
        const users = await (0, user_service_1.getUsersWithFilterAndPagination)({
            keyword: keyword,
            role: role,
            isVerified: isVerified === 'true' ? true : isVerified === 'false' ? false : undefined,
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
