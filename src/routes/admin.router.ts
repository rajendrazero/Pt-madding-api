import { Router } from 'express';
import {
  getAllUsers,
  updateUser,
  deleteUser, 
  getUsersPaginated,
  recoverUser,
  getDeletedUsers
} from '../controllers/user.controller';
import {
  refreshToken
} from '../controllers/auth.controller';
import { verifyToken, checkRole } from '../middlewares/auth.middleware';

const router = Router();

// Semua route di bawah hanya bisa diakses admin
router.use(verifyToken, checkRole('admin'));

// Route untuk mendapatkan semua user
router.get('/', getAllUsers);

// Route untuk update user berdasarkan ID
router.put('/:id', updateUser);

// Route untuk menghapus user berdasarkan ID (admin bisa hapus user lain)
router.delete('/:id', deleteUser);

// Route untuk mencari user dengan pagination
router.get('/search', getUsersPaginated);

// Route untuk mengembalikan user yang telah dihapus (admin bisa recover user)
router.patch('/users/:id/recover', recoverUser);

// Route untuk mendapatkan daftar user yang terhapus (soft delete)
router.get('/users/deleted', getDeletedUsers);

// Route untuk logout
router.post('/logout', (req, res) => {
  // Tidak perlu melakukan apapun di server karena token JWT bersifat stateless
  // Hanya mengembalikan response logout berhasil
  res.status(200).json({ message: 'Logout berhasil' });
});

router.post('/refresh-token', refreshToken);

export default router;