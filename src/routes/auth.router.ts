import { Router } from 'express';
import { 
  register,
  verifyCode, 
  resendCode,
  login,
} from '../controllers/auth.controller';
import { verifyToken } from '../middlewares/auth.middleware'; // Pastikan path benar
const router = Router();

// Route untuk registrasi dan pengiriman kode verifikasi
router.post('/register', register);         // Simpan data sementara + kirim kode

// Route untuk verifikasi kode
router.post('/verify-code', verifyCode);    // Verifikasi kode dan simpan permanen

// Route untuk mengirim ulang kode verifikasi
router.post('/resend-code', resendCode);    // Kirim ulang kode verifikasi

router.post('/login', login); // Login setelah verifikasi

// Protected Routes (hanya bisa diakses setelah login)
router.get('/profile', verifyToken, (req, res) => {
  // Akses data user dari JWT
  const user = req.user;
  res.status(200).json({ message: 'Profile user', user });
});

export default router;


