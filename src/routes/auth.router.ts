import { Router } from 'express';
import {
  register,
  verifyCode,
  resendCode,
  login,
} from '../controllers/auth.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// Auth routes
router.post('/register', register);         // Simpan data sementara + kirim kode
router.post('/verify-code', verifyCode);    // Verifikasi kode dan simpan permanen
router.post('/resend-code', resendCode);    // Kirim ulang kode verifikasi
router.post('/login', login);               // Login setelah verifikasi

// Route untuk tes token saja (tanpa role)
router.get('/me', verifyToken, (req, res) => {
  const user = req.user;
  res.status(200).json({ message: 'Token valid', user });
});

export default router;