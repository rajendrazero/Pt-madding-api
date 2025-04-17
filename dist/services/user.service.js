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
exports.fetchAllUsers = fetchAllUsers;
exports.getUsersWithFilterAndPagination = getUsersWithFilterAndPagination;
exports.updateUserById = updateUserById;
exports.updateOwnProfileById = updateOwnProfileById;
exports.softDeleteUserById = softDeleteUserById;
exports.recoverUserById = recoverUserById;
exports.deleteOldSoftDeletedUsers = deleteOldSoftDeletedUsers;
exports.getDeletedUsersService = getDeletedUsersService;
exports.getUserById = getUserById;
const db_1 = require("../utils/db");
// Pool adalah koneksi ke PostgreSQL
function fetchAllUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield db_1.pool.query(`
    SELECT id, username, email, role, is_verified, created_at,
           photo_url, gender, class, description
    FROM users
    WHERE is_deleted = false AND is_verified = true
  `);
        return res.rows;
    });
}
function getUsersWithFilterAndPagination(_a) {
    return __awaiter(this, arguments, void 0, function* ({ keyword, role, is_verified, page = 1, limit = 10 }) {
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
        // Selalu filter hanya user yang terverifikasi, default true
        filters.push(`is_verified = $${idx}`);
        values.push(is_verified !== null && is_verified !== void 0 ? is_verified : true);
        idx++;
        const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';
        const offset = (page - 1) * limit;
        const countQuery = `SELECT COUNT(*) FROM users ${whereClause}`;
        const countRes = yield db_1.pool.query(countQuery, values);
        const total = parseInt(countRes.rows[0].count, 10);
        const dataQuery = `
    SELECT id, username, email, role, is_verified, created_at,
           photo_url, gender, class, description
    FROM users
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${idx} OFFSET $${idx + 1}
  `;
        const dataRes = yield db_1.pool.query(dataQuery, [...values, limit, offset]);
        return {
            data: dataRes.rows,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        };
    });
}
function updateUserById(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id, username, email, password, photo_url, gender, class: userClass, // `class` adalah kata kunci di JavaScript, jadi gunakan `userClass`
    description, }) {
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
        if (photo_url) {
            fields.push(`photo_url = $${idx++}`);
            values.push(photo_url);
        }
        if (gender) {
            fields.push(`gender = $${idx++}`);
            values.push(gender);
        }
        if (userClass) {
            fields.push(`class = $${idx++}`);
            values.push(userClass);
        }
        if (description) {
            fields.push(`description = $${idx++}`);
            values.push(description);
        }
        if (fields.length === 0)
            return;
        values.push(id);
        const query = `
    UPDATE users
    SET ${fields.join(', ')}
    WHERE id = $${idx} AND is_verified = true
  `;
        yield db_1.pool.query(query, values);
    });
}
function updateOwnProfileById(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id, username, email, password, photo_url, gender, class: userClass, // Gunakan `userClass` untuk menghindari bentrok dengan kata kunci `class`
    description, }) {
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
        if (photo_url) {
            fields.push(`photo_url = $${idx++}`);
            values.push(photo_url);
        }
        if (gender) {
            fields.push(`gender = $${idx++}`);
            values.push(gender);
        }
        if (userClass) {
            fields.push(`class = $${idx++}`);
            values.push(userClass);
        }
        if (description) {
            fields.push(`description = $${idx++}`);
            values.push(description);
        }
        if (fields.length === 0)
            return;
        values.push(id);
        const query = `
    UPDATE users
    SET ${fields.join(', ')}, updated_at = NOW()
    WHERE id = $${idx}
  `;
        yield db_1.pool.query(query, values);
    });
}
function softDeleteUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db_1.pool.query(`UPDATE users SET is_deleted = true WHERE id = $1 AND is_verified = true`, [id]);
    });
}
function recoverUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db_1.pool.query(`UPDATE users SET is_deleted = false WHERE id = $1 AND is_verified = true`, [id]);
    });
}
function deleteOldSoftDeletedUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Menghapus pengguna soft-deleted lebih dari 1 hari');
        try {
            const result = yield db_1.pool.query(`
      DELETE FROM users
      WHERE is_deleted = true AND updated_at < NOW() - INTERVAL '1 DAY'
    `);
            console.log(`${result.rowCount} pengguna dihapus`);
        }
        catch (error) {
            console.error('Error saat menghapus pengguna:', error);
        }
    });
}
function getDeletedUsersService(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const { keyword, role, is_verified, page = '1', limit = '10' } = query;
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
    SELECT id, username, email, role, is_verified, created_at,
           photo_url, gender, class, description
    FROM users
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${idx} OFFSET $${idx + 1}
  `;
        const dataRes = yield db_1.pool.query(dataQuery, [...values, limitNum, offset]);
        return {
            data: dataRes.rows,
            total,
            currentPage: pageNum,
            totalPages: Math.ceil(total / limitNum),
        };
    });
}
function getUserById(id_1) {
    return __awaiter(this, arguments, void 0, function* (id, includeDeleted = false) {
        const res = yield db_1.pool.query(`SELECT id, username, email, role, is_verified, created_at,
            photo_url, gender, class, description
     FROM users
     WHERE id = $1 ${includeDeleted ? '' : 'AND is_deleted = false'}`, [id]);
        return res.rows[0];
    });
}
