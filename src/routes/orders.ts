import { Router } from 'express';
import authMiddleWare from '../middlewares/auth';
import { errorHandler } from '../error-handler';
import {
  cancelOrder,
  changeStatus,
  createOrder,
  geteOrderById,
  listAllOrders,
  listOrders,
  listUsersOrders,
} from '../controllers/orders';
import adminMiddleWare from '../middlewares/admin';

const orderRoutes: Router = Router();

orderRoutes.post('/', [authMiddleWare], errorHandler(createOrder));
orderRoutes.get('/', [authMiddleWare], errorHandler(listOrders));
orderRoutes.put('/:id/cancel', [authMiddleWare], errorHandler(cancelOrder));
orderRoutes.get('/index', [authMiddleWare], [adminMiddleWare], errorHandler(listAllOrders));
orderRoutes.get('/:id/user', [authMiddleWare], [adminMiddleWare], errorHandler(listUsersOrders));
orderRoutes.put('/:id/status', [authMiddleWare], [adminMiddleWare], errorHandler(changeStatus));
orderRoutes.get('/:id', [authMiddleWare], errorHandler(geteOrderById));
export default orderRoutes;
