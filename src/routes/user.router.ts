import express from 'express';
import {
  createUser,
  updateUser,
  getAllUsers,
  deleteUser,
  getUsersWithFilters,
} from '../controllers/user.controller';
import { validate } from '../middlewares/validate';
import {
  createUserSchema,
  updateUserSchema,
} from '../validations/user.validation';

const router = express.Router();

// Ambil semua user
router.get('/', getAllUsers);

// Ambil user dengan filter (keyword, role, isVerified, dll)
router.get('/filter', getUsersWithFilters);

// Tambah user baru, divalidasi dengan schema Zod
router.post('/', validate(createUserSchema), createUser);

// Update user berdasarkan ID, divalidasi juga
router.put('/:id', validate(updateUserSchema), updateUser);

// Hapus user (soft delete)
router.delete('/:id', deleteUser);

export default router;