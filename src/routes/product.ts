import { Router } from 'express';
import { errorHandler } from '../error-handler';
import { createProduct } from '../controllers/product';
import authMiddleWare from '../middlewares/auth';
import adminMiddleWare from '../middlewares/admin';

const productRoutes: Router = Router();
productRoutes.post('/', [authMiddleWare, adminMiddleWare], errorHandler(createProduct));
export default productRoutes;
