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
exports.uploadProfileImage = exports.getUserByIdHandler = exports.getDeletedUsers = exports.recoverUser = exports.deleteUser = exports.updateOwnProfile = exports.updateUser = exports.getUsersPaginated = exports.getAllUsers = void 0;
var user_service_1 = require("../services/user.service");
var user_validation_1 = require("../validations/user.validation");
var zod_1 = require("zod");
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
var getUsersPaginated = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, keyword, role, is_verified, _b, page, _c, limit, data, error_2;
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
                error_2 = _d.sent();
                console.error('Gagal filter + pagination:', error_2);
                res.status(500).json({ error: 'Terjadi kesalahan saat filter data user' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUsersPaginated = getUsersPaginated;
var updateUser = function (req, res) { return __awaiter(void 0, void 0, Promise, function () {
    var id, parsed, updatedUser, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                parsed = user_validation_1.updateUserSchema.parse(req.body);
                return [4 /*yield*/, (0, user_service_1.updateUserById)(__assign({ id: id }, parsed))];
            case 2:
                _a.sent(); // Lakukan update
                return [4 /*yield*/, (0, user_service_1.getUserById)(id)];
            case 3:
                updatedUser = _a.sent();
                res.status(200).json({
                    message: 'User berhasil diupdate',
                    user: updatedUser
                });
                return [3 /*break*/, 5];
            case 4:
                error_3 = _a.sent();
                if (error_3 instanceof zod_1.z.ZodError) {
                    res.status(400).json({ error: error_3.errors.map(function (e) { return e.message; }) });
                    return [2 /*return*/];
                }
                console.error('Gagal update user:', error_3);
                res.status(500).json({ error: 'Gagal update user' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateUser = updateUser;
var updateOwnProfile = function (req, res) { return __awaiter(void 0, void 0, Promise, function () {
    var userId, parsed, updatedUser, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    res.status(401).json({ error: 'Unauthorized: user ID not found' });
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                parsed = user_validation_1.updateOwnProfileSchema.parse(req.body);
                return [4 /*yield*/, (0, user_service_1.updateOwnProfileById)(__assign({ id: userId }, parsed))];
            case 2:
                _b.sent();
                return [4 /*yield*/, (0, user_service_1.getUserById)(userId)];
            case 3:
                updatedUser = _b.sent();
                res.status(200).json({
                    message: 'Profil berhasil diperbarui',
                    user: updatedUser
                });
                return [3 /*break*/, 5];
            case 4:
                error_4 = _b.sent();
                if (error_4 instanceof zod_1.z.ZodError) {
                    res.status(400).json({ error: error_4.errors.map(function (e) { return e.message; }) });
                    return [2 /*return*/];
                }
                console.error('Gagal update profil:', error_4);
                res.status(500).json({ error: 'Gagal update profil' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateOwnProfile = updateOwnProfile;
// Hapus akun (soft delete) - untuk pengguna dan admin
var deleteUser = function (req, res) { return __awaiter(void 0, void 0, Promise, function () {
    var userId, targetUserId, error_5;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                targetUserId = req.params.id;
                if (!(((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === 'admin' || userId === targetUserId)) return [3 /*break*/, 5];
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, user_service_1.softDeleteUserById)(targetUserId)];
            case 2:
                _c.sent(); // Menghapus akun dengan soft delete
                res.status(200).json({ message: 'User berhasil dihapus (soft delete)' });
                return [3 /*break*/, 4];
            case 3:
                error_5 = _c.sent();
                console.error('Gagal hapus user:', error_5);
                res.status(500).json({ error: 'Gagal hapus user' });
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                res.status(403).json({ error: 'Forbidden: hanya admin yang bisa menghapus pengguna lain' });
                _c.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.deleteUser = deleteUser;
var recoverUser = function (req, res) { return __awaiter(void 0, void 0, Promise, function () {
    var id, error_6;
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
                error_6 = _a.sent();
                console.error('Gagal recovery user:', error_6);
                res.status(500).json({ error: 'Gagal memulihkan user' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.recoverUser = recoverUser;
var getDeletedUsers = function (req, res) { return __awaiter(void 0, void 0, Promise, function () {
    var result, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, user_service_1.getDeletedUsersService)(req.query)];
            case 1:
                result = _a.sent();
                res.status(200).json(result);
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                console.error('Gagal ambil user terhapus:', error_7);
                res.status(500).json({ error: 'Terjadi kesalahan saat ambil user terhapus' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getDeletedUsers = getDeletedUsers;
var getUserByIdHandler = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, includeDeleted, user, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                includeDeleted = req.query.includeDeleted;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, user_service_1.getUserById)(id, includeDeleted === 'true')];
            case 2:
                user = _a.sent();
                if (user) {
                    res.status(200).json(user); // Jika user ditemukan, kirimkan data
                }
                else {
                    res.status(404).json({ error: 'User tidak ditemukan' }); // Jika tidak ditemukan
                }
                return [3 /*break*/, 4];
            case 3:
                error_8 = _a.sent();
                console.error('Gagal mengambil user:', error_8);
                res.status(500).json({ error: 'Terjadi kesalahan saat mengambil user' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getUserByIdHandler = getUserByIdHandler;
var uploadProfileImage = function (req, res) {
    var fileUrl = (0, user_service_1.generateProfileImageUrl)(req);
    if (!fileUrl) {
        res.status(400).json({ message: 'Tidak ada file yang diupload.' });
        return;
    }
    res.status(200).json({ message: 'Upload berhasil', url: fileUrl });
};
exports.uploadProfileImage = uploadProfileImage;
