import { Router } from 'express';
import { login, me, signup } from '../controllers/auth';
import { errorHandler } from '../error-handler';
import authMiddleWare from '../middlewares/auth';

const authRoutes: Router = Router();
authRoutes.post('/signup', errorHandler(signup));
authRoutes.post('/login', errorHandler(login));
authRoutes.get('/me', [authMiddleWare], errorHandler(me));
export default authRoutes;
