import { Router } from 'express';
import { errorHandler } from '../error-handler';
import authMiddleWare from '../middlewares/auth';
import adminMiddleWare from '../middlewares/admin';
import {
  addAddress,
  changeUserRole,
  deleteAddress,
  getUserById,
  listAddress,
  listUsers,
  updateUser,
} from '../controllers/users';

const userRoutes: Router = Router();
userRoutes.post('/address', [authMiddleWare], errorHandler(addAddress));
userRoutes.delete('/:id/address', [authMiddleWare], errorHandler(deleteAddress));
userRoutes.get('/address', [authMiddleWare], errorHandler(listAddress));
userRoutes.put('/update-address', [authMiddleWare], errorHandler(updateUser));
userRoutes.put('/:id/role', [authMiddleWare, adminMiddleWare], errorHandler(changeUserRole));
userRoutes.get('/:id', [authMiddleWare, adminMiddleWare], errorHandler(getUserById));
userRoutes.get('/', [authMiddleWare, adminMiddleWare], errorHandler(listUsers));

export default userRoutes;
