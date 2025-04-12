import { Router } from 'express';
import { register, verifyCode, resendCode } from '../controllers/auth.controller';

const router = Router();

// Route untuk registrasi dan pengiriman kode verifikasi
router.post('/register', register);         // Simpan data sementara + kirim kode

// Route untuk verifikasi kode
router.post('/verify-code', verifyCode);    // Verifikasi kode dan simpan permanen

// Route untuk mengirim ulang kode verifikasi
router.post('/resend-code', resendCode);    // Kirim ulang kode verifikasi

export default router;