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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersWithFilters = exports.deleteUser = exports.updateUser = exports.createUser = exports.getAllUsers = void 0;
var user_service_1 = require("../services/user.service");
var uuid_1 = require("uuid");
var getAllUsers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, user_service_1.fetchAllUsers)()];
            case 1:
                users = _a.sent();
                res.status(200).json({ success: true, data: users });
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                res.status(500).json({ success: false, message: 'Gagal mengambil data pengguna.', error: err_1 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllUsers = getAllUsers;
var createUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, email, password, id, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, username = _a.username, email = _a.email, password = _a.password;
                if (!username || !email || !password) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Semua field wajib diisi.' })];
                }
                id = (0, uuid_1.v4)();
                return [4 /*yield*/, (0, user_service_1.insertUser)({ id: id, username: username, email: email, password: password })];
            case 1:
                _b.sent();
                res.status(201).json({ success: true, message: 'Pengguna berhasil ditambahkan.' });
                return [3 /*break*/, 3];
            case 2:
                err_2 = _b.sent();
                res.status(500).json({ success: false, message: 'Gagal menambahkan pengguna.', error: err_2 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createUser = createUser;
var updateUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, username, email, password, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = req.params.id;
                _a = req.body, username = _a.username, email = _a.email, password = _a.password;
                return [4 /*yield*/, (0, user_service_1.updateUserById)({ id: id, username: username, email: email, password: password })];
            case 1:
                _b.sent();
                res.status(200).json({ success: true, message: 'Pengguna berhasil diperbarui.' });
                return [3 /*break*/, 3];
            case 2:
                err_3 = _b.sent();
                res.status(500).json({ success: false, message: 'Gagal memperbarui pengguna.', error: err_3 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateUser = updateUser;
var deleteUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, (0, user_service_1.softDeleteUserById)(id)];
            case 1:
                _a.sent();
                res.status(200).json({ success: true, message: 'Pengguna berhasil dihapus (soft delete).' });
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                res.status(500).json({ success: false, message: 'Gagal menghapus pengguna.', error: err_4 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteUser = deleteUser;
var getUsersWithFilters = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, keyword, role, is_verified, page, limit, users, err_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, keyword = _a.keyword, role = _a.role, is_verified = _a.is_verified, page = _a.page, limit = _a.limit;
                return [4 /*yield*/, (0, user_service_1.getUsersWithFilterAndPagination)({
                        keyword: keyword,
                        role: role,
                        is_verified: is_verified === 'true' ? true : is_verified === 'false' ? false : undefined,
                        page: page ? parseInt(page) : 1,
                        limit: limit ? parseInt(limit) : 10
                    })];
            case 1:
                users = _b.sent();
                res.status(200).json(__assign({ success: true }, users));
                return [3 /*break*/, 3];
            case 2:
                err_5 = _b.sent();
                res.status(500).json({ success: false, message: 'Gagal mengambil data pengguna dengan filter.', error: err_5 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUsersWithFilters = getUsersWithFilters;
