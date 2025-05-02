import { Request, Response } from 'express';
import { AddressSchema, changeUserRoleSchema, UpdateUserSchema } from '../schema/users';
import { prismaClient } from '..';
import { NotFoundExceptions } from '../exceptions/not-found';
import { ErrorCodes } from '../exceptions/root';
import { Address } from '@prisma/client';
import { BadRequestsExceptions } from '../exceptions/bad-requests';
import { internalExceptions } from '../exceptions/internal-exceptions';

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

//handler to update user address
export const updateUser = async (req: Request, res: Response) => {
  const validatedData = UpdateUserSchema.parse(req.body);
  let shippingAddress: Address;
  let billingAddress: Address;
  if (validatedData.defaultShippingAddress) {
    try {
      shippingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: validatedData.defaultShippingAddress,
        },
      });
    } catch (error) {
      throw new NotFoundExceptions('Address Not Found', ErrorCodes.ADDRESS_NOT_FOUND);
    }
    if (shippingAddress.userId != req.user.id) {
      throw new BadRequestsExceptions(
        'Address does not belong to user',
        ErrorCodes.ADDRESS_DOES_NOT_BELONG_TO_USER
      );
    }
  }

  if (validatedData.defaultBillingAddress) {
    try {
      billingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: validatedData.defaultBillingAddress,
        },
      });
    } catch (error) {
      throw new NotFoundExceptions('Address Not Found', ErrorCodes.ADDRESS_NOT_FOUND);
    }
    if (billingAddress.userId != req.user.id) {
      throw new BadRequestsExceptions(
        'Address does not belong to user',
        ErrorCodes.ADDRESS_DOES_NOT_BELONG_TO_USER
      );
    }
  }

  const updatedUser = await prismaClient.user.update({
    where: {
      id: req.user.id, // <-- non-null assertion
    },
    data: validatedData,
  });
  res.json(updatedUser);
};

export const listUsers = async (req: Request, res: Response) => {
  try {
    const skip = req.query.skip ? parseInt(req.query.skip as string, 10) : 0;

    const users = await prismaClient.user.findMany({
      skip,
      take: 5,
    });

    res.json(users);
  } catch (err) {
    // Throw your custom exception instead
    throw new internalExceptions('Failed to fetch users', err, ErrorCodes.FAILED_TO_FETCH_USERS);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await prismaClient.user.findFirstOrThrow({
      where: {
        id: +req.params.id,
      },
      include: {
        addresses: true,
      },
    });
    res.json(user);
  } catch (err) {
    throw new NotFoundExceptions('User Not Found', ErrorCodes.USER_NOT_FOUND);
  }
};

export const changeUserRole = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const parsedData = changeUserRoleSchema.parse(req.body);

    const user = await prismaClient.user.update({
      where: {
        id: +req.params.id,
      },
      data: {
        role: parsedData.role,
      },
    });

    res.json(user);
  } catch (err) {
    throw new NotFoundExceptions('User Not Found', ErrorCodes.USER_NOT_FOUND);
  }
};
