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
const sendEmail = (to, subject, text) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const info = yield transporter.sendMail({
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
});
// Tes pengiriman email
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sendEmail('rajendraathallahfawwaz08@gmail.com', 'Test Email', 'Halo, ini adalah percakapan tes pengiriman email!');
        console.log('Tes berhasil dikirim');
    }
    catch (err) {
        console.error('Tes gagal:', err);
    }
}))();
