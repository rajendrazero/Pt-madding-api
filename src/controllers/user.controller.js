"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.getDeletedUsers = exports.recoverUser = exports.getUsersPaginated = exports.deleteUser = exports.updateUser = exports.getAllUsers = void 0;
var user_service_1 = require("../services/user.service");
var user_validation_1 = require("../validations/user.validation");
var zod_1 = require("zod");
var db_1 = require("../utils/db");
/**
 * Handler untuk mengambil semua user dari database
 */
var getAllUsers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, user_service_1.fetchAllUsers)()];
            case 1:
                users = _a.sent();
                res.status(200).json(users); // Kirim response 200 OK dengan data user
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Gagal mengambil user:', error_1); // Logging jika error
                res.status(500).json({ error: 'Internal Server Error' }); // Kirim response 500
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllUsers = getAllUsers;
var updateUser = function (req, res) { return __awaiter(void 0, void 0, Promise, function () {
    var id, parsed, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                parsed = user_validation_1.updateUserSchema.parse(req.body);
                return [4 /*yield*/, (0, user_service_1.updateUserById)(__assign({ id: id }, parsed))];
            case 2:
                _a.sent();
                res.status(200).json({ message: 'User berhasil diupdate' });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                if (error_2 instanceof zod_1.z.ZodError) {
                    res.status(400).json({ error: error_2.errors.map(function (e) { return e.message; }) });
                    return [2 /*return*/];
                }
                console.error('Gagal update user:', error_2);
                res.status(500).json({ error: 'Gagal update user' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateUser = updateUser;
var deleteUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, user_service_1.softDeleteUserById)(id)];
            case 2:
                _a.sent();
                res.status(200).json({ message: 'User berhasil dihapus (soft delete)' });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.error('Gagal hapus user:', error_3);
                res.status(500).json({ error: 'Gagal hapus user' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteUser = deleteUser;
var getUsersPaginated = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, keyword, role, is_verified, _b, page, _c, limit, data, error_4;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                _a = req.query, keyword = _a.keyword, role = _a.role, is_verified = _a.is_verified, _b = _a.page, page = _b === void 0 ? '1' : _b, _c = _a.limit, limit = _c === void 0 ? '10' : _c;
                return [4 /*yield*/, (0, user_service_1.getUsersWithFilterAndPagination)({
                        keyword: keyword === null || keyword === void 0 ? void 0 : keyword.toString(),
                        role: role === null || role === void 0 ? void 0 : role.toString(),
                        is_verified: is_verified === 'true' ? true : is_verified === 'false' ? false : undefined,
                        page: parseInt(page),
                        limit: parseInt(limit)
                    })];
            case 1:
                data = _d.sent();
                res.status(200).json(data);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _d.sent();
                console.error('Gagal filter + pagination:', error_4);
                res.status(500).json({ error: 'Terjadi kesalahan saat filter data user' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUsersPaginated = getUsersPaginated;
var recoverUser = function (req, res) { return __awaiter(void 0, void 0, Promise, function () {
    var id, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, user_service_1.recoverUserById)(id)];
            case 2:
                _a.sent();
                res.status(200).json({ message: 'User berhasil dipulihkan' });
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                console.error('Gagal recovery user:', error_5);
                res.status(500).json({ error: 'Gagal memulihkan user' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.recoverUser = recoverUser;
var getDeletedUsers = function (req, res) { return __awaiter(void 0, void 0, Promise, function () {
    var _a, keyword, role, is_verified, _b, page, _c, limit, pageNum, limitNum, offset, values, filters, idx, whereClause, countQuery, countRes, total, dataQuery, dataRes, error_6;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 4]);
                _a = req.query, keyword = _a.keyword, role = _a.role, is_verified = _a.is_verified, _b = _a.page, page = _b === void 0 ? '1' : _b, _c = _a.limit, limit = _c === void 0 ? '10' : _c;
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
                countRes = _d.sent();
                total = parseInt(countRes.rows[0].count, 10);
                dataQuery = "\n      SELECT id, username, email, role, is_verified, created_at\n      FROM users\n      ".concat(whereClause, "\n      ORDER BY created_at DESC\n      LIMIT $").concat(idx, " OFFSET $").concat(idx + 1, "\n    ");
                return [4 /*yield*/, db_1.pool.query(dataQuery, __spreadArray(__spreadArray([], values, true), [limitNum, offset], false))];
            case 2:
                dataRes = _d.sent();
                res.status(200).json({
                    data: dataRes.rows,
                    total: total,
                    currentPage: pageNum,
                    totalPages: Math.ceil(total / limitNum),
                });
                return [3 /*break*/, 4];
            case 3:
                error_6 = _d.sent();
                console.error('Gagal ambil user terhapus:', error_6);
                res.status(500).json({ error: 'Terjadi kesalahan saat ambil user terhapus' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getDeletedUsers = getDeletedUsers;
