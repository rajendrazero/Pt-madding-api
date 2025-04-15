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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeletedUsersService = exports.deleteOldSoftDeletedUsers = exports.recoverUserById = exports.softDeleteUserById = exports.updateOwnProfileById = exports.updateUserById = exports.getUsersWithFilterAndPagination = exports.fetchAllUsers = void 0;
var db_1 = require("../utils/db");
// Pool adalah koneksi ke PostgreSQL
function fetchAllUsers() {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.pool.query("\n    SELECT id, username, email, role, is_verified, created_at,\n           photo_url, gender, class, description\n    FROM users\n    WHERE is_deleted = false AND is_verified = true\n  ")];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res.rows];
            }
        });
    });
}
exports.fetchAllUsers = fetchAllUsers;
function getUsersWithFilterAndPagination(_a) {
    var keyword = _a.keyword, role = _a.role, is_verified = _a.is_verified, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c;
    return __awaiter(this, void 0, void 0, function () {
        var values, filters, idx, whereClause, offset, countQuery, countRes, total, dataQuery, dataRes;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    values = [];
                    filters = ['is_deleted = false'];
                    idx = 1;
                    if (keyword) {
                        filters.push("(username ILIKE $".concat(idx, " OR email ILIKE $").concat(idx, ")"));
                        values.push("%".concat(keyword, "%"));
                        idx++;
                    }
                    if (role) {
                        filters.push("role = $".concat(idx));
                        values.push(role);
                        idx++;
                    }
                    // Selalu filter hanya user yang terverifikasi, default true
                    filters.push("is_verified = $".concat(idx));
                    values.push(is_verified !== null && is_verified !== void 0 ? is_verified : true);
                    idx++;
                    whereClause = filters.length > 0 ? "WHERE ".concat(filters.join(' AND ')) : '';
                    offset = (page - 1) * limit;
                    countQuery = "SELECT COUNT(*) FROM users ".concat(whereClause);
                    return [4 /*yield*/, db_1.pool.query(countQuery, values)];
                case 1:
                    countRes = _d.sent();
                    total = parseInt(countRes.rows[0].count, 10);
                    dataQuery = "\n    SELECT id, username, email, role, is_verified, created_at,\n           photo_url, gender, class, description\n    FROM users\n    ".concat(whereClause, "\n    ORDER BY created_at DESC\n    LIMIT $").concat(idx, " OFFSET $").concat(idx + 1, "\n  ");
                    return [4 /*yield*/, db_1.pool.query(dataQuery, __spreadArray(__spreadArray([], values, true), [limit, offset], false))];
                case 2:
                    dataRes = _d.sent();
                    return [2 /*return*/, {
                            data: dataRes.rows,
                            total: total,
                            currentPage: page,
                            totalPages: Math.ceil(total / limit),
                        }];
            }
        });
    });
}
exports.getUsersWithFilterAndPagination = getUsersWithFilterAndPagination;
function updateUserById(_a) {
    var id = _a.id, username = _a.username, email = _a.email, password = _a.password, photo_url = _a.photo_url, gender = _a.gender, userClass = _a.class, // `class` adalah kata kunci di JavaScript, jadi gunakan `userClass`
    description = _a.description;
    return __awaiter(this, void 0, void 0, function () {
        var fields, values, idx, query;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fields = [];
                    values = [];
                    idx = 1;
                    if (username) {
                        fields.push("username = $".concat(idx++));
                        values.push(username);
                    }
                    if (email) {
                        fields.push("email = $".concat(idx++));
                        values.push(email);
                    }
                    if (password) {
                        fields.push("password = $".concat(idx++));
                        values.push(password);
                    }
                    if (photo_url) {
                        fields.push("photo_url = $".concat(idx++));
                        values.push(photo_url);
                    }
                    if (gender) {
                        fields.push("gender = $".concat(idx++));
                        values.push(gender);
                    }
                    if (userClass) {
                        fields.push("class = $".concat(idx++));
                        values.push(userClass);
                    }
                    if (description) {
                        fields.push("description = $".concat(idx++));
                        values.push(description);
                    }
                    if (fields.length === 0)
                        return [2 /*return*/];
                    values.push(id);
                    query = "\n    UPDATE users\n    SET ".concat(fields.join(', '), "\n    WHERE id = $").concat(idx, " AND is_verified = true\n  ");
                    return [4 /*yield*/, db_1.pool.query(query, values)];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.updateUserById = updateUserById;
function updateOwnProfileById(_a) {
    var id = _a.id, username = _a.username, email = _a.email, password = _a.password, photo_url = _a.photo_url, gender = _a.gender, userClass = _a.class, // Gunakan `userClass` untuk menghindari bentrok dengan kata kunci `class`
    description = _a.description;
    return __awaiter(this, void 0, void 0, function () {
        var fields, values, idx, query;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fields = [];
                    values = [];
                    idx = 1;
                    if (username) {
                        fields.push("username = $".concat(idx++));
                        values.push(username);
                    }
                    if (email) {
                        fields.push("email = $".concat(idx++));
                        values.push(email);
                    }
                    if (password) {
                        fields.push("password = $".concat(idx++));
                        values.push(password);
                    }
                    if (photo_url) {
                        fields.push("photo_url = $".concat(idx++));
                        values.push(photo_url);
                    }
                    if (gender) {
                        fields.push("gender = $".concat(idx++));
                        values.push(gender);
                    }
                    if (userClass) {
                        fields.push("class = $".concat(idx++));
                        values.push(userClass);
                    }
                    if (description) {
                        fields.push("description = $".concat(idx++));
                        values.push(description);
                    }
                    if (fields.length === 0)
                        return [2 /*return*/];
                    values.push(id);
                    query = "\n    UPDATE users\n    SET ".concat(fields.join(', '), ", updated_at = NOW()\n    WHERE id = $").concat(idx, "\n  ");
                    return [4 /*yield*/, db_1.pool.query(query, values)];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.updateOwnProfileById = updateOwnProfileById;
function softDeleteUserById(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.pool.query("UPDATE users SET is_deleted = true WHERE id = $1 AND is_verified = true", [id])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.softDeleteUserById = softDeleteUserById;
function recoverUserById(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.pool.query("UPDATE users SET is_deleted = false WHERE id = $1 AND is_verified = true", [id])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.recoverUserById = recoverUserById;
function deleteOldSoftDeletedUsers() {
    return __awaiter(this, void 0, Promise, function () {
        var result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Menghapus pengguna soft-deleted lebih dari 1 hari');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, db_1.pool.query("\n      DELETE FROM users\n      WHERE is_deleted = true AND updated_at < NOW() - INTERVAL '1 DAY'\n    ")];
                case 2:
                    result = _a.sent();
                    console.log("".concat(result.rowCount, " pengguna dihapus"));
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error saat menghapus pengguna:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.deleteOldSoftDeletedUsers = deleteOldSoftDeletedUsers;
function getDeletedUsersService(query) {
    return __awaiter(this, void 0, void 0, function () {
        var keyword, role, is_verified, _a, page, _b, limit, pageNum, limitNum, offset, values, filters, idx, whereClause, countQuery, countRes, total, dataQuery, dataRes;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    keyword = query.keyword, role = query.role, is_verified = query.is_verified, _a = query.page, page = _a === void 0 ? '1' : _a, _b = query.limit, limit = _b === void 0 ? '10' : _b;
                    pageNum = parseInt(page);
                    limitNum = parseInt(limit);
                    offset = (pageNum - 1) * limitNum;
                    values = [];
                    filters = ['is_deleted = true'];
                    idx = 1;
                    if (keyword) {
                        filters.push("(username ILIKE $".concat(idx, " OR email ILIKE $").concat(idx, ")"));
                        values.push("%".concat(keyword, "%"));
                        idx++;
                    }
                    if (role) {
                        filters.push("role = $".concat(idx));
                        values.push(role);
                        idx++;
                    }
                    if (typeof is_verified === 'boolean' || is_verified === 'true' || is_verified === 'false') {
                        filters.push("is_verified = $".concat(idx));
                        values.push(is_verified === 'true');
                        idx++;
                    }
                    whereClause = filters.length ? "WHERE ".concat(filters.join(' AND ')) : '';
                    countQuery = "SELECT COUNT(*) FROM users ".concat(whereClause);
                    return [4 /*yield*/, db_1.pool.query(countQuery, values)];
                case 1:
                    countRes = _c.sent();
                    total = parseInt(countRes.rows[0].count, 10);
                    dataQuery = "\n    SELECT id, username, email, role, is_verified, created_at,\n           photo_url, gender, class, description\n    FROM users\n    ".concat(whereClause, "\n    ORDER BY created_at DESC\n    LIMIT $").concat(idx, " OFFSET $").concat(idx + 1, "\n  ");
                    return [4 /*yield*/, db_1.pool.query(dataQuery, __spreadArray(__spreadArray([], values, true), [limitNum, offset], false))];
                case 2:
                    dataRes = _c.sent();
                    return [2 /*return*/, {
                            data: dataRes.rows,
                            total: total,
                            currentPage: pageNum,
                            totalPages: Math.ceil(total / limitNum),
                        }];
            }
        });
    });
}
exports.getDeletedUsersService = getDeletedUsersService;
