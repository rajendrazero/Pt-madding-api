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
exports.login = exports.resendCode = exports.verifyCode = exports.register = void 0;
var AuthService = require("../services/auth.service");
var auth_validation_1 = require("../validations/auth.validation");
var zod_1 = require("zod");
// Fungsi untuk menangani error
var handleError = function (err, res) {
    if (err instanceof zod_1.z.ZodError) {
        res.status(400).json({ error: err.errors.map(function (e) { return e.message; }) });
    }
    else if (err instanceof Error) {
        res.status(400).json({ error: err.message });
    }
    else {
        res.status(400).json({ error: 'Terjadi kesalahan tak dikenal' });
    }
};
// Register dan kirim kode verifikasi
var register = function (req, res) { return __awaiter(void 0, void 0, Promise, function () {
    var _a, username, email, password, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = auth_validation_1.registerSchema.parse(req.body), username = _a.username, email = _a.email, password = _a.password;
                return [4 /*yield*/, AuthService.registerUser(username, email, password)];
            case 1:
                _b.sent();
                res.status(200).json({ message: 'Registrasi berhasil. Kode verifikasi telah dikirim ke email.' });
                return [3 /*break*/, 3];
            case 2:
                err_1 = _b.sent();
                handleError(err_1, res);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.register = register;
// Verifikasi kode
var verifyCode = function (req, res) { return __awaiter(void 0, void 0, Promise, function () {
    var _a, email, code, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = auth_validation_1.verifyCodeSchema.parse(req.body), email = _a.email, code = _a.code;
                return [4 /*yield*/, AuthService.verifyUserCode(email, code)];
            case 1:
                _b.sent();
                res.status(201).json({ message: 'Registrasi berhasil dan akun telah diverifikasi' });
                return [3 /*break*/, 3];
            case 2:
                err_2 = _b.sent();
                handleError(err_2, res);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.verifyCode = verifyCode;
// Kirim ulang kode verifikasi
var resendCode = function (req, res) { return __awaiter(void 0, void 0, Promise, function () {
    var email, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                email = auth_validation_1.resendCodeSchema.parse(req.body).email;
                return [4 /*yield*/, AuthService.resendVerificationCode(email)];
            case 1:
                _a.sent();
                res.status(200).json({ message: 'Kode verifikasi berhasil dikirim ulang' });
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                handleError(err_3, res);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.resendCode = resendCode;
var login = function (req, res) { return __awaiter(void 0, void 0, Promise, function () {
    var _a, email, password, token, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = auth_validation_1.loginSchema.parse(req.body), email = _a.email, password = _a.password;
                return [4 /*yield*/, AuthService.loginUser(email, password)];
            case 1:
                token = _b.sent();
                res.status(200).json({ message: 'Login berhasil', token: token });
                return [3 /*break*/, 3];
            case 2:
                err_4 = _b.sent();
                handleError(err_4, res);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
