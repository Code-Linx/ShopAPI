import { Router } from 'express';
import { errorHandler } from '../error-handler';
import {
  createProduct,
  deleteProduct,
  getProductByID,
  listProduct,
  updateProduct,
} from '../controllers/product';
import authMiddleWare from '../middlewares/auth';
import adminMiddleWare from '../middlewares/admin';

const productRoutes: Router = Router();
productRoutes.post('/', [authMiddleWare, adminMiddleWare], errorHandler(createProduct));
productRoutes.put('/:id', [authMiddleWare, adminMiddleWare], errorHandler(updateProduct));
productRoutes.delete('/:id', [authMiddleWare, adminMiddleWare], errorHandler(deleteProduct));
productRoutes.get('/', [authMiddleWare, adminMiddleWare], errorHandler(listProduct));
productRoutes.get('/:id', [authMiddleWare, adminMiddleWare], errorHandler(getProductByID));
export default productRoutes;
