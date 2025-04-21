import { Request, Response } from 'express';
import { createCartSchema } from '../schema/cart';
import { Product } from '@prisma/client';
import { prismaClient } from '..';
import { NotFoundExceptions } from '../exceptions/not-found';
import { ErrorCodes } from '../exceptions/root';
import { UnauthorizedHttpException } from '../exceptions/unauthorized';

export const addItemToCart = async (req: Request, res: Response) => {
  const validatedData = createCartSchema.parse(req.body);
  let product;

  try {
    product = await prismaClient.product.findFirstOrThrow({
      where: {
        id: validatedData.productId,
      },
    });
  } catch (err) {
    throw new NotFoundExceptions('Product Not Found', ErrorCodes.PRODUCT_NOT_FOUND);
  }

  // Check if item already exists in the user's cart
  const existingCartItem = await prismaClient.cartItem.findFirst({
    where: {
      userId: req.user.id,
      productId: product.id,
    },
  });

  let cart;

  if (existingCartItem) {
    // Update quantity if exists
    cart = await prismaClient.cartItem.update({
      where: { id: existingCartItem.id },
      data: {
        quantity: existingCartItem.quantity + validatedData.quantity,
      },
    });
  } else {
    // Create new cart item
    cart = await prismaClient.cartItem.create({
      data: {
        userId: req.user.id,
        productId: product.id,
        quantity: validatedData.quantity,
      },
    });
  }

  res.json(cart);
};

export const deleteItemFromCart = async (req: Request, res: Response) => {
  const cartItemId = +req.params.id;
  const userId = req.user.id;

  // Find the cart item
  const cartItem = await prismaClient.cartItem.findUnique({
    where: { id: cartItemId },
  });

  // If not found
  if (!cartItem) {
    throw new NotFoundExceptions('Cart item not found', ErrorCodes.CART_NOT_FOUND);
  }

  // Check if it belongs to the current user
  if (cartItem.userId !== userId) {
    throw new UnauthorizedHttpException(
      'Cart Does Not Belong To This User',
      ErrorCodes.UNAUTHORIZED_ACCESS
    );
  }

  // All good - delete it
  await prismaClient.cartItem.delete({
    where: { id: cartItemId },
  });

  res.json({ success: true, message: 'Item deleted' });
};

export const changeQuantity = async (req: Request, res: Response) => {};

export const getCart = async (req: Request, res: Response) => {};
