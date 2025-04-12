"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAllUsers = fetchAllUsers;
exports.updateUserById = updateUserById;
exports.softDeleteUserById = softDeleteUserById;
exports.getUsersWithFilterAndPagination = getUsersWithFilterAndPagination;
exports.recoverUserById = recoverUserById;
exports.deleteOldSoftDeletedUsers = deleteOldSoftDeletedUsers;
const db_1 = require("../utils/db");
// Pool adalah koneksi ke PostgreSQL
async function fetchAllUsers() {
    const res = await db_1.pool.query(`
    SELECT id, username, email, role, is_verified, created_at
    FROM users
    WHERE is_deleted = false
  `);
    return res.rows;
}
async function updateUserById({ id, username, email, password, }) {
    const fields = [];
    const values = [];
    let idx = 1;
    if (username) {
        fields.push(`username = $${idx++}`);
        values.push(username);
    }
    if (email) {
        fields.push(`email = $${idx++}`);
        values.push(email);
    }
    if (password) {
        fields.push(`password = $${idx++}`);
        values.push(password);
    }
    if (fields.length === 0)
        return;
    values.push(id);
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx}`;
    await db_1.pool.query(query, values);
}
async function softDeleteUserById(id) {
    await db_1.pool.query(`UPDATE users SET is_deleted = true WHERE id = $1`, [id]);
}
async function getUsersWithFilterAndPagination({ keyword, role, is_verified, page = 1, limit = 10 }) {
    const values = [];
    const filters = ['is_deleted = false'];
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
    if (typeof is_verified === 'boolean') {
        filters.push(`is_verified = $${idx}`);
        values.push(is_verified);
        idx++;
    }
    const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';
    const offset = (page - 1) * limit;
    // Ambil total count
    const countQuery = `SELECT COUNT(*) FROM users ${whereClause}`;
    const countRes = await db_1.pool.query(countQuery, values);
    const total = parseInt(countRes.rows[0].count, 10);
    // Ambil data pengguna
    const dataQuery = `
    SELECT id, username, email, role, is_verified, created_at
    FROM users
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${idx} OFFSET $${idx + 1}
  `;
    const dataRes = await db_1.pool.query(dataQuery, [...values, limit, offset]);
    return {
        data: dataRes.rows,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
    };
}
async function recoverUserById(id) {
    await db_1.pool.query(`UPDATE users SET is_deleted = false WHERE id = $1`, [id]);
}
async function deleteOldSoftDeletedUsers() {
    console.log('Menghapus pengguna soft-deleted lebih dari 3 menit');
    try {
        const result = await db_1.pool.query(`
      DELETE FROM users
      WHERE is_deleted = true AND updated_at < NOW() - INTERVAL '3 MINUTE'
    `);
        console.log(`${result.rowCount} pengguna dihapus`);
    }
    catch (error) {
        console.error('Error saat menghapus pengguna:', error);
    }
}
