import { Request, Response } from 'express';
import { AddressSchema } from '../schema/users';
import { prismaClient } from '..';

export const addAddress = async (req: Request, res: Response) => {
  AddressSchema.parse(req.body);

  const address = await prismaClient.address.create({
    data: {
      ...req.body,
      userId: req.user.id,
    },
  });
  res.json(address);
};
export const deleteAddress = async (req: Request, res: Response) => {};
export const listAddress = async (req: Request, res: Response) => {};
