"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendCode = exports.verifyCode = exports.register = void 0;
const AuthService = __importStar(require("../services/auth.service"));
const auth_validation_1 = require("../validations/auth.validation");
const zod_1 = require("zod");
// Fungsi untuk menangani error
const handleError = (err, res) => {
    if (err instanceof zod_1.z.ZodError) {
        res.status(400).json({ error: err.errors.map(e => e.message) });
    }
    else if (err instanceof Error) {
        res.status(400).json({ error: err.message });
    }
    else {
        res.status(400).json({ error: 'Terjadi kesalahan tak dikenal' });
    }
};
// Register dan kirim kode verifikasi
const register = async (req, res) => {
    try {
        const { username, email, password } = auth_validation_1.registerSchema.parse(req.body);
        await AuthService.registerUser(username, email, password);
        res.status(200).json({ message: 'Registrasi berhasil. Kode verifikasi telah dikirim ke email.' });
    }
    catch (err) {
        handleError(err, res);
    }
};
exports.register = register;
// Verifikasi kode
const verifyCode = async (req, res) => {
    try {
        const { email, code } = auth_validation_1.verifyCodeSchema.parse(req.body);
        await AuthService.verifyUserCode(email, code);
        res.status(201).json({ message: 'Registrasi berhasil dan akun telah diverifikasi' });
    }
    catch (err) {
        handleError(err, res);
    }
};
exports.verifyCode = verifyCode;
// Kirim ulang kode verifikasi
const resendCode = async (req, res) => {
    try {
        const { email } = auth_validation_1.resendCodeSchema.parse(req.body);
        await AuthService.resendVerificationCode(email);
        res.status(200).json({ message: 'Kode verifikasi berhasil dikirim ulang' });
    }
    catch (err) {
        handleError(err, res);
    }
};
exports.resendCode = resendCode;
