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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const user = (_a = process.env.EMAIL_USER) === null || _a === void 0 ? void 0 : _a.trim();
const pass = (_b = process.env.EMAIL_PASS) === null || _b === void 0 ? void 0 : _b.trim();
if (!user || !pass) {
    throw new Error('EMAIL_USER atau EMAIL_PASS tidak di-set atau kosong.');
}
exports.transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user,
        pass,
    },
});
// Fungsi untuk mengirim email
const sendEmail = (to, subject, text) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const info = yield exports.transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        });
        console.log('Email berhasil dikirim:', info.response);
    }
    catch (error) {
        console.error('Gagal mengirim email:', error);
        console.log('ERROR MESSAGE:', error.message);
        console.log('ERROR RESPONSE:', error.response);
        console.log('ERROR CODE:', error.code);
        throw new Error('Gagal mengirim email');
    }
});
exports.sendEmail = sendEmail;
