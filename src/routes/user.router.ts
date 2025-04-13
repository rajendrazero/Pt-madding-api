import { Router } from 'express';
import { verifyToken, checkRole } from '../middlewares/auth.middleware';
import { 
  updateOwnProfile,
  deleteUser,
} from '../controllers/user.controller';
import {
  refreshToken
} from '../controllers/auth.controller';

const router = Router();

// Terapkan middleware untuk semua route di bawahnya
router.use(verifyToken); // Semua route membutuhkan token yang valid

// Route untuk mendapatkan profile user (hanya bisa diakses oleh user itu sendiri)
router.get('/', checkRole('user'), (req, res) => {
  const user = req.user;
  res.status(200).json({ message: 'Profile user', user });
});

// Route untuk update profile user (hanya bisa diakses oleh user itu sendiri)
router.put('/profile', checkRole('user'), updateOwnProfile);

// Route untuk menghapus user (Hanya bisa dihapus oleh admin atau user itu sendiri)
router.delete('/:id', checkRole('user'), deleteUser);

// Route untuk logout
router.post('/logout', (req, res) => {
  // Tidak perlu melakukan apapun di server karena token JWT bersifat stateless
  // Hanya mengembalikan response logout berhasil
  res.status(200).json({ message: 'Logout berhasil' });
});

router.post('/refresh-token', refreshToken);

export default router;