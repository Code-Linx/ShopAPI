import { Router } from 'express';
import authRoutes from './auth';
import productRoutes from './product';
import userRoutes from './users';
import cartRoutes from './cart';
import orderRoutes from './orders';

const rootRouter: Router = Router();
rootRouter.use('/auth', authRoutes);
rootRouter.use('/product', productRoutes);
rootRouter.use('/user', userRoutes);
rootRouter.use('/cart', cartRoutes);
rootRouter.use('/order', orderRoutes);

export default rootRouter;
