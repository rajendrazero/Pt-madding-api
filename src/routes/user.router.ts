import { Router } from 'express';
// src/routes/user.router.ts
import {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUsersWithFilters
} from '../controllers/user.controller';

const router = Router();

router.post('/', createUser);
router.get('/', getAllUsers);
router.put('/:id', updateUser);     
router.delete('/:id', deleteUser);   
router.get('/search', getUsersWithFilters);

export default router;