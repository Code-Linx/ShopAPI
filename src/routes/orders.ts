import { Router } from 'express';
import authMiddleWare from '../middlewares/auth';
import { errorHandler } from '../error-handler';
import { cancelOrder, createOrder, geteOrderById, listOrders } from '../controllers/orders';

const orderRoutes: Router = Router();

orderRoutes.post('/', [authMiddleWare], errorHandler(createOrder));
orderRoutes.get('/', [authMiddleWare], errorHandler(listOrders));
orderRoutes.put('/:id/cancel', [authMiddleWare], errorHandler(cancelOrder));
orderRoutes.get('/:id', [authMiddleWare], errorHandler(geteOrderById));
export default orderRoutes;
