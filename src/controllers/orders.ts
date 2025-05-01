import { Request, Response } from 'express';
import { prismaClient } from '..';
import { NotFoundExceptions } from '../exceptions/not-found';
import { ErrorCodes } from '../exceptions/root';
import { UnauthorizedHttpException } from '../exceptions/unauthorized';

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
