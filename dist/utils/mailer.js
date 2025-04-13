"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const user = process.env.EMAIL_USER?.trim();
const pass = process.env.EMAIL_PASS?.trim();
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
const sendEmail = async (to, subject, text) => {
    try {
        const info = await exports.transporter.sendMail({
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
};
exports.sendEmail = sendEmail;
