"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAllUsers = fetchAllUsers;
exports.insertUser = insertUser;
exports.updateUserById = updateUserById;
exports.softDeleteUserById = softDeleteUserById;
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
async function insertUser({ id, username, email, password }) {
    await db_1.pool.query(`
    INSERT INTO users (id, username, email, password)
    VALUES ($1, $2, $3, $4)
  `, [id, username, email, password]);
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
