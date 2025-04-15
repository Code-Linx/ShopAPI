import { Router } from 'express';
import { errorHandler } from '../error-handler';
import authMiddleWare from '../middlewares/auth';
import adminMiddleWare from '../middlewares/admin';
import { addAddress, deleteAddress, listAddress } from '../controllers/users';

const userRoutes: Router = Router();
userRoutes.post('/address', [authMiddleWare, adminMiddleWare], errorHandler(addAddress));
userRoutes.delete('/address/:id', [authMiddleWare, adminMiddleWare], errorHandler(deleteAddress));
userRoutes.get('/address', [authMiddleWare, adminMiddleWare], errorHandler(listAddress));

export default userRoutes;
