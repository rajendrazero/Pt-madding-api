import { Router } from 'express';
import { verifyToken, checkRole } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';
import {
  getUserByIdHandler,
  getAllUsers,
  updateOwnProfile,
  updateUser,
  deleteUser,
  getUsersPaginated,
  recoverUser,
  getDeletedUsers,
  uploadProfileImage,
} from '../controllers/user.controller';
import { refreshToken } from '../controllers/auth.controller';

const router = Router();

// ==================
// Middleware umum
// ==================
router.use(verifyToken);

// ==================
// Route khusus user
// ==================
router.get('/', checkRole('user'), (req, res) => {
  const user = req.user;
  res.status(200).json({ message: 'Profile user', user });
});

router.post('/upload', checkRole('user'), upload.single('photo'), uploadProfileImage);
router.put('/profile', checkRole('user'), updateOwnProfile);
router.get('/:id', checkRole('user'), getUserByIdHandler);
router.delete('/:id', checkRole('user'), deleteUser);

// ==================
// Route khusus admin
// ==================
router.use(checkRole('admin')); // Semua route di bawah hanya bisa diakses admin

router.post('/upload', upload.single('photo'), uploadProfileImage); // Admin upload avatar user
router.get('/users', getAllUsers);
router.get('/users/deleted', getDeletedUsers);
router.get('/users/search', getUsersPaginated);
router.patch('/users/:id/recover', recoverUser);
router.get('/users/:id', getUserByIdHandler);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// ==================
// Auth umum
// ==================
router.post('/refresh-token', refreshToken);
router.post('/logout', (_req, res) => {
  res.status(200).json({ message: 'Logout berhasil' });
});

export default router;