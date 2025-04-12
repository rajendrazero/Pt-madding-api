import { Router } from 'express';
import { createUser, getAllUsers, updateUser, deleteUser } from
'../controllers/user.controller';

const router = Router();

router.post('/', createUser);
router.get('/', getAllUsers);
router.put('/:id', updateUser);      // Untuk edit user
router.delete('/:id', deleteUser);   // Untuk hapus user (soft delete)

export default router;