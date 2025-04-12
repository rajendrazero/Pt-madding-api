"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Konfigurasi transporter email (gunakan Gmail atau SMTP lainnya)
exports.transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Gantilah dengan alamat email pengirim
        pass: process.env.EMAIL_PASS, // Gantilah dengan App Password yang kamu buat di Google Account
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
        console.log('EMAIL_USER:', process.env.EMAIL_USER);
        console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Ditemukan' : 'Kosong');
        throw new Error('Gagal mengirim email');
    }
};
exports.sendEmail = sendEmail;
