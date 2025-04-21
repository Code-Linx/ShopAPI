import { Router } from 'express';
import authMiddleWare from '../middlewares/auth';
import { errorHandler } from '../error-handler';
import { addItemToCart, changeQuantity, deleteItemFromCart, getCart } from '../controllers/cart';

const cartRoutes: Router = Router();
cartRoutes.post('/', [authMiddleWare], errorHandler(addItemToCart));

cartRoutes.get('/', [authMiddleWare], errorHandler(getCart));

cartRoutes.delete('/:id', [authMiddleWare], errorHandler(deleteItemFromCart));

cartRoutes.put('/:id', [authMiddleWare], errorHandler(changeQuantity));

export default cartRoutes;
