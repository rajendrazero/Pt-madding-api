"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserById = void 0;
exports.fetchAllUsers = fetchAllUsers;
exports.insertUser = insertUser;
exports.updateUserById = updateUserById;
exports.softDeleteUserById = softDeleteUserById;
exports.getUsersWithFilterAndPagination = getUsersWithFilterAndPagination;
const prismaClient_1 = require("../utils/prismaClient");
const client_1 = require("@prisma/client");
const findUserById = async (id) => {
    return await prismaClient_1.prisma.user.findUnique({ where: { id } });
};
exports.findUserById = findUserById;
// Mengambil semua user yang tidak dihapus (isDeleted false)
async function fetchAllUsers() {
    return await prismaClient_1.prisma.user.findMany({
        where: { isDeleted: false },
        select: {
            id: true,
            username: true,
            email: true,
            role: true,
            isVerified: true,
            createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
    });
}
// Menambahkan user baru ke database
async function insertUser(params) {
    const { id, username, email, password, role = client_1.Role.user, isVerified = false } = params;
    return await prismaClient_1.prisma.user.create({
        data: {
            id,
            username,
            email,
            password,
            role,
            isVerified,
        },
    });
}
// Memperbarui data user berdasarkan ID
async function updateUserById(params) {
    const { id, username, email, password, role, isVerified } = params;
    // Kumpulkan field yang akan diupdate
    const data = {};
    if (username)
        data.username = username;
    if (email)
        data.email = email;
    if (password)
        data.password = password;
    if (role)
        data.role = role;
    if (typeof isVerified === 'boolean')
        data.isVerified = isVerified;
    // Jika tidak ada field yang diupdate, lempar error atau kembalikan hasil
    if (Object.keys(data).length === 0) {
        throw new Error('Tidak ada data yang diperbarui.');
    }
    return await prismaClient_1.prisma.user.update({
        where: { id },
        data,
    });
}
// Melakukan soft delete pada user dengan merubah status isDeleted menjadi true
async function softDeleteUserById(id) {
    return await prismaClient_1.prisma.user.update({
        where: { id },
        data: { isDeleted: true },
    });
}
// Mengambil user berdasarkan filter dan pagination
async function getUsersWithFilterAndPagination({ keyword, role, isVerified, page = 1, limit = 10, }) {
    // Membuat filter dasar: hanya user yang belum dihapus
    const filters = { isDeleted: false };
    // Jika ada keyword, cari berdasarkan username atau email (pencarian case-insensitive)
    if (keyword) {
        filters.OR = [
            { username: { contains: keyword, mode: 'insensitive' } },
            { email: { contains: keyword, mode: 'insensitive' } },
        ];
    }
    // Jika filter role ditentukan, tambahkan ke filter
    if (role) {
        filters.role = role;
    }
    // Filter untuk status verifikasi
    if (typeof isVerified === 'boolean') {
        filters.isVerified = isVerified;
    }
    // Hitung total user berdasarkan filter
    const total = await prismaClient_1.prisma.user.count({ where: filters });
    // Ambil data user dengan filter, diurutkan berdasarkan tanggal pembuatan (desc)
    const users = await prismaClient_1.prisma.user.findMany({
        where: filters,
        select: {
            id: true,
            username: true,
            email: true,
            role: true,
            isVerified: true,
            createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
    });
    return {
        data: users,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
    };
}
