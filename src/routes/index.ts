import { Router } from 'express';
import authRoutes from './auth';
import productRoutes from './product';
import userRoutes from './users';
const rootRouter: Router = Router();
rootRouter.use('/auth', authRoutes);
rootRouter.use('/product', productRoutes);
rootRouter.use('/address', userRoutes);

export default rootRouter;
