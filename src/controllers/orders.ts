import { Request, Response } from 'express';
import { prismaClient } from '..';
import { NotFoundExceptions } from '../exceptions/not-found';
import { ErrorCodes } from '../exceptions/root';
import { UnauthorizedHttpException } from '../exceptions/unauthorized';
import { orderEventStatus } from '@prisma/client';
import { internalExceptions } from '../exceptions/internal-exceptions';

export const createOrder = async (req: Request, res: Response) => {
  return await prismaClient.$transaction(async (tx) => {
    const cartItems = await tx.cartItem.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        product: true,
      },
    });
    if (cartItems.length === 0) {
      return res.json({ message: 'cart is empty' });
    }

    const price = cartItems.reduce((prev, current) => {
      return prev + current.quantity * +current.product.price;
    }, 0);

    const defaultAddressId = req.user.defaultShippingAddress;

    if (!defaultAddressId) {
      throw new NotFoundExceptions(
        'No default shipping address found.',
        ErrorCodes.ADDRESS_NOT_FOUND
      );
    }

    const address = await tx.address.findFirst({
      where: {
        id: defaultAddressId,
      },
    });

    if (!address) {
      throw new NotFoundExceptions('Shipping address not found.', ErrorCodes.ADDRESS_NOT_FOUND);
    }

    const order = await tx.order.create({
      data: {
        userId: req.user.id,
        netAmount: price,
        address: address.formattedAddress,
        product: {
          create: cartItems.map((cart) => {
            return {
              productId: cart.productId,
              quantity: cart.quantity,
            };
          }),
        },
      },
    });

    const orderEvent = await tx.orderEvent.create({
      data: {
        orderId: order.id,
      },
    });

    await tx.cartItem.deleteMany({
      where: {
        userId: req.user.id,
      },
    });

    return res.json(order);
  });
};

export const listOrders = async (req: Request, res: Response) => {
  const order = await prismaClient.order.findMany({
    where: {
      userId: req.user.id,
    },
  });
  res.json(order);
};

export const cancelOrder = async (req: Request, res: Response) => {
  return await prismaClient.$transaction(async (tx) => {
    const orderId = +req.params.id;

    const order = await tx.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      throw new NotFoundExceptions('Order not found', ErrorCodes.ORDER_NOT_FOUND);
    }

    // Ensure user owns the order
    if (order.userId !== req.user.id) {
      throw new UnauthorizedHttpException(
        'You are not authorized to cancel this order',
        ErrorCodes.UNAUTHORIZED_ACCESS
      );
    }

    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    });

    await tx.orderEvent.create({
      data: {
        orderId: updatedOrder.id,
        status: 'CANCELLED',
      },
    });

    res.json(updatedOrder);
  });
};

export const geteOrderById = async (req: Request, res: Response) => {
  try {
    const order = await prismaClient.order.findFirstOrThrow({
      where: {
        id: +req.params.id,
      },
      include: {
        product: true,
        orderEvent: true,
      },
    });
    res.json(order);
  } catch (err) {
    throw new NotFoundExceptions('Order Not Found', ErrorCodes.ORDER_NOT_FOUND);
  }
};

export const listAllOrders = async (req: Request, res: Response) => {
  try {
    let whereClause: { status?: orderEventStatus } = {};

    const statusParam = req.query.status;
    const skip = req.query.skip ? parseInt(req.query.skip as string, 10) : 0;

    if (typeof statusParam === 'string') {
      const upperStatus = statusParam.toUpperCase() as orderEventStatus;

      if (Object.values(orderEventStatus).includes(upperStatus)) {
        whereClause.status = upperStatus;
      }
    }

    const orders = await prismaClient.order.findMany({
      where: whereClause,
      skip,
      take: 5,
    });

    if (orders.length === 0) {
      return res.status(404).json({
        message: `No orders found with status "${whereClause.status ?? 'ANY'}".`,
        data: [],
      });
    }

    res.json({ message: 'Orders fetched successfully.', data: orders });
  } catch (err) {
    throw new internalExceptions('Failed to fetch orders', err, ErrorCodes.SERVER_ERROR);
  }
};

export const changeStatus = async (req: Request, res: Response) => {
  try {
    const result = await prismaClient.$transaction(async (tx) => {
      // Update the order status
      const order = await tx.order.update({
        where: {
          id: +req.params.id,
        },
        data: {
          status: req.body.status,
        },
      });

      // Create a related order event
      await tx.orderEvent.create({
        data: {
          orderId: order.id,
          status: req.body.status,
        },
      });

      return order;
    });

    res.json(result);
  } catch (err) {
    throw new NotFoundExceptions('Order Not Found', ErrorCodes.ORDER_NOT_FOUND);
  }
};

export const listUsersOrders = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);
  const status = req.params.status;

  let whereClause: any = {
    userId,
  };

  if (status) {
    whereClause.status = status;
  }

  const skip = req.query.skip ? parseInt(req.query.skip as string, 10) : 0;

  const orders = await prismaClient.order.findMany({
    where: whereClause,
    skip,
    take: 5,
  });

  if (orders.length === 0) {
    return res.status(404).json({
      message: `No orders found for user ${userId}${status ? ` with status "${status}"` : ''}.`,
      data: [],
    });
  }

  res.json({
    message: 'Orders fetched successfully.',
    data: orders,
  });
};
