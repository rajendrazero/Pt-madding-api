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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersWithFilterAndPagination = exports.softDeleteUserById = exports.updateUserById = exports.insertUser = exports.fetchAllUsers = void 0;
var prismaClient_1 = require("../utils/prismaClient");
function fetchAllUsers() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prismaClient_1.prisma.user.findMany({
                        where: {
                            isDeleted: false
                        },
                        select: {
                            id: true,
                            username: true,
                            email: true,
                            role: true,
                            isVerified: true,
                            createdAt: true
                        }
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.fetchAllUsers = fetchAllUsers;
function insertUser(_a) {
    var id = _a.id, username = _a.username, email = _a.email, password = _a.password;
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, prismaClient_1.prisma.user.create({
                        data: {
                            id: id,
                            username: username,
                            email: email,
                            password: password
                        }
                    })];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.insertUser = insertUser;
function updateUserById(_a) {
    var id = _a.id, username = _a.username, email = _a.email, password = _a.password;
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    data = {};
                    if (username)
                        data.username = username;
                    if (email)
                        data.email = email;
                    if (password)
                        data.password = password;
                    if (Object.keys(data).length === 0)
                        return [2 /*return*/];
                    return [4 /*yield*/, prismaClient_1.prisma.user.update({
                            where: { id: id },
                            data: data
                        })];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.updateUserById = updateUserById;
function softDeleteUserById(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prismaClient_1.prisma.user.update({
                        where: { id: id },
                        data: { isDeleted: true }
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.softDeleteUserById = softDeleteUserById;
function getUsersWithFilterAndPagination(_a) {
    var keyword = _a.keyword, role = _a.role, isVerified = _a.isVerified, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c;
    return __awaiter(this, void 0, void 0, function () {
        var filters, total, users;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    filters = {
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
                    if (typeof isVerified === 'boolean') {
                        filters.isVerified = isVerified;
                    }
                    return [4 /*yield*/, prismaClient_1.prisma.user.count({ where: filters })];
                case 1:
                    total = _d.sent();
                    return [4 /*yield*/, prismaClient_1.prisma.user.findMany({
                            where: filters,
                            select: {
                                id: true,
                                username: true,
                                email: true,
                                role: true,
                                isVerified: true,
                                createdAt: true
                            },
                            orderBy: {
                                createdAt: 'desc'
                            },
                            skip: (page - 1) * limit,
                            take: limit
                        })];
                case 2:
                    users = _d.sent();
                    return [2 /*return*/, {
                            data: users,
                            total: total,
                            currentPage: page,
                            totalPages: Math.ceil(total / limit)
                        }];
            }
        });
    });
}
exports.getUsersWithFilterAndPagination = getUsersWithFilterAndPagination;
