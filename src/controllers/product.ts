import { prismaClient } from '..';
import { Request, Response } from 'express';

export const createProduct = async (req: Request, res: Response) => {
  const product = await prismaClient.product.create({
    data: {
      ...req.body,
      tags: req.body.tags.join(','),
    },
  });
  res.json(product);
};
