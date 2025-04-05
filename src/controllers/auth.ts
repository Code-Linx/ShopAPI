import { NextFunction, Request, Response } from 'express';
import { prismaClient } from '..';
import { hashSync, compareSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secret';
import { BadRequestsExceptions } from '../exceptions/bad-requests';
import { ErrorCodes } from '../exceptions/root';
import { UnprocessableEntity } from '../exceptions/validation';
import { SignupSchema } from '../schema/users';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    SignupSchema.parse(req.body);
    const { email, name, password } = req.body;
    let user = await prismaClient.user.findFirst({ where: { email } });
    if (user) {
      next(new BadRequestsExceptions('User already Exists', ErrorCodes.USER_ALREADY_EXISTS));
    }
    user = await prismaClient.user.create({
      data: {
        name,
        email,
        passwod: hashSync(password, 10),
      },
    });
    res.json(user);
  } catch (err: any) {
    next(
      new UnprocessableEntity(
        err?.cause?.issues,
        'Unprocessable Entity',
        ErrorCodes.UNPROCESSABLE_ENTITY
      )
    );
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  let user = await prismaClient.user.findFirst({ where: { email } });
  if (!user) {
    throw Error('User does not exist');
  }
  if (!compareSync(password, user.passwod)) {
    throw Error('Incorrect Password');
  }
  const token = jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET
  );
  res.json({ user, token });
};
