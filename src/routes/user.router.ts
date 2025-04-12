import { Router } from 'express';
import {
getAllUsers,
updateUser,
deleteUser, 
getUsersPaginated, recoverUser,
  getDeletedUsers
} from
'../controllers/user.controller';

const router = Router();

router.get('/', getAllUsers);
router.put('/:id', updateUser);     
router.delete('/:id', deleteUser);   
router.get('/search', getUsersPaginated);
router.patch('/users/:id/recover', recoverUser);
router.get('/users/deleted', getDeletedUsers);

export default router;
