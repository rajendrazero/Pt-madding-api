"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Konfigurasi transporter untuk menggunakan Gmail
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: 'rajendrasekolah@gmail.com', // Gantilah dengan alamat email pengirim
        pass: 'iwzqygdkiqviusbp', // Gantilah dengan App Password yang kamu buat di Google Account
    },
});
// Fungsi untuk mengirim email
const sendEmail = async (to, subject, text) => {
    try {
        const info = await transporter.sendMail({
            from: 'rajendrasekolah@gmail.com', // Pengirim (gunakan email yang sama dengan di auth)
            to, // Penerima
            subject, // Subjek email
            text, // Isi pesan
        });
        console.log('Email berhasil dikirim:', info.response);
    }
    catch (error) {
        console.error('Gagal mengirim email:', error);
        throw new Error('Gagal mengirim email');
    }
};
// Tes pengiriman email
(async () => {
    try {
        await sendEmail('rajendraathallahfawwaz08@gmail.com', 'Test Email', 'Halo, ini adalah percakapan tes pengiriman email!');
        console.log('Tes berhasil dikirim');
    }
    catch (err) {
        console.error('Tes gagal:', err);
    }
})();
