import { Router } from 'express';
import { createUser, getAllUsers, updateUser, deleteUser, getUsersPaginated} from
'../controllers/user.controller';

const router = Router();

router.post('/', createUser);
router.get('/', getAllUsers);
router.put('/:id', updateUser);     
router.delete('/:id', deleteUser);   
router.get('/search', getUsersPaginated);

export default router;