"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = getAllUsers;
const db_1 = require("../utils/db");
async function getAllUsers() {
    const res = await db_1.pool.query('SELECT * FROM "User" WHERE "isDeleted" = false');
    return res.rows;
}
