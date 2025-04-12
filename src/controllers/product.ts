import { prismaClient } from '..';
import { Request, Response } from 'express';
import { NotFoundExceptions } from '../exceptions/not-found';
import { ErrorCodes } from '../exceptions/root';

export const createProduct = async (req: Request, res: Response) => {
  const product = await prismaClient.product.create({
    data: {
      ...req.body,
      tags: req.body.tags.join(','),
    },
  });
  res.json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = req.body;
    if (product.tags) {
      product.tags = product.tags.join(',');
    }
    const updateProduct = await prismaClient.product.update({
      where: {
        id: +req.params.id,
      },
      data: product,
    });

    res.json(updateProduct);
  } catch (err) {
    throw new NotFoundExceptions('Product Not Found', ErrorCodes.PRODUCT_NOT_FOUND);
  }
};
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await prismaClient.product.delete({
      where: {
        id: +req.params.id,
      },
    });
    res.json({ message: 'Product deleted successfully', data: product });
  } catch (err) {
    throw new NotFoundExceptions('Product Not Found', ErrorCodes.PRODUCT_NOT_FOUND);
  }
};
export const listProduct = async (req: Request, res: Response) => {
  const skip = parseInt(req.query.skip as string) || 0;

  const count = await prismaClient.product.count();
  const products = await prismaClient.product.findMany({
    skip,
    take: 5,
  });
  res.json({ count, data: products });
};
export const getProductByID = async (req: Request, res: Response) => {
  try {
    const product = await prismaClient.product.findFirstOrThrow({
      where: {
        id: +req.params.id,
      },
    });
    res.json(product);
  } catch (err) {
    throw new NotFoundExceptions('Product Not Found', ErrorCodes.PRODUCT_NOT_FOUND);
  }
};
