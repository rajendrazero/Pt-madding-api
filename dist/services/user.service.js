"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAllUsers = fetchAllUsers;
exports.insertUser = insertUser;
exports.updateUserById = updateUserById;
exports.softDeleteUserById = softDeleteUserById;
exports.getUsersWithFilterAndPagination = getUsersWithFilterAndPagination;
const prismaClient_1 = require("../utils/prismaClient");
async function fetchAllUsers() {
    return await prismaClient_1.prisma.user.findMany({
        where: {
            isDeleted: false
        },
        select: {
            id: true,
            username: true,
            email: true,
            role: true,
            is_verified: true,
            createdAt: true
        }
    });
}
async function insertUser({ id, username, email, password }) {
    await prismaClient_1.prisma.user.create({
        data: {
            id,
            username,
            email,
            password
        }
    });
}
async function updateUserById({ id, username, email, password }) {
    const data = {};
    if (username)
        data.username = username;
    if (email)
        data.email = email;
    if (password)
        data.password = password;
    if (Object.keys(data).length === 0)
        return;
    await prismaClient_1.prisma.user.update({
        where: { id },
        data
    });
}
async function softDeleteUserById(id) {
    await prismaClient_1.prisma.user.update({
        where: { id },
        data: { isDeleted: true }
    });
}
async function getUsersWithFilterAndPagination({ keyword, role, is_verified, page = 1, limit = 10 }) {
    const filters = {
        isDeleted: false
    };
    if (keyword) {
        filters.OR = [
            { username: { contains: keyword, mode: 'insensitive' } },
            { email: { contains: keyword, mode: 'insensitive' } }
        ];
    }
    if (role) {
        filters.role = role;
    }
    if (typeof is_verified === 'boolean') {
        filters.is_verified = is_verified;
    }
    const total = await prismaClient_1.prisma.user.count({ where: filters });
    const users = await prismaClient_1.prisma.user.findMany({
        where: filters,
        select: {
            id: true,
            username: true,
            email: true,
            role: true,
            is_verified: true,
            createdAt: true
        },
        orderBy: {
            createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
    });
    return {
        data: users,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit)
    };
}
