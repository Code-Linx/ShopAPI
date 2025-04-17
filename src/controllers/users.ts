import { Request, Response } from 'express';
import { AddressSchema } from '../schema/users';
import { prismaClient } from '..';
import { NotFoundExceptions } from '../exceptions/not-found';
import { ErrorCodes } from '../exceptions/root';

export const addAddress = async (req: Request, res: Response) => {
  AddressSchema.parse(req.body);
  // Check if req.user is defined
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const address = await prismaClient.address.create({
    data: {
      ...req.body,
      userId: req.user.id,
    },
  });
  res.json(address);
};
export const deleteAddress = async (req: Request, res: Response) => {
  try {
    await prismaClient.address.delete({
      where: {
        id: +req.params.id,
      },
    });
    res.json({ success: true });
  } catch (err) {
    throw new NotFoundExceptions('Address Not Found.', ErrorCodes.ADDRESS_NOT_FOUND);
  }
};

export const listAddress = async (req: Request, res: Response) => {
  // Check if req.user is defined
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  const address = await prismaClient.address.findMany({
    where: {
      userId: req.user.id,
    },
  });
  res.json({ address });
};
