import { Router } from 'express';
import { verifyToken, checkRoles } from '../middlewares/auth.middleware';
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
// Route untuk user & admin
// ==================
router.get('/', checkRoles('user', 'admin'), (req, res) => {
  const user = req.user;
  res.status(200).json({ message: 'Profile user', user });
});

router.post('/upload', checkRoles('user', 'admin'), upload.single('photo'), uploadProfileImage);
router.put('/profile', checkRoles('user', 'admin'), updateOwnProfile);
router.get('/:id', checkRoles('user', 'admin'), getUserByIdHandler);
router.delete('/:id', checkRoles('user', 'admin'), deleteUser);

// ==================
// Route khusus admin
// ==================
router.use(checkRoles('admin')); // Semua route di bawah ini hanya untuk admin

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


/*
##public / anoun
##eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnZ2txaHdlYXR2cnNhbGtwd3J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNjEyMjUsImV4cCI6MjA1OTkzNzIyNX0.3XMCDfeeylSJyk373dApP3OdAF66cHwcTZGLMsitnHg

*/