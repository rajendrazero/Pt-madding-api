"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAllUsers = fetchAllUsers;
exports.insertUser = insertUser;
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
