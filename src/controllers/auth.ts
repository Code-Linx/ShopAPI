import { NextFunction, Request, Response } from 'express';
import { prismaClient } from '..';
import { hashSync, compareSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secret';
import { BadRequestsExceptions } from '../exceptions/bad-requests';
import { ErrorCodes } from '../exceptions/root';
import { UnprocessableEntity } from '../exceptions/validation';
import { SignupSchema } from '../schema/users';
import { NotFoundExceptions } from '../exceptions/not-found';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  SignupSchema.parse(req.body);
  const { email, name, password } = req.body;
  let user = await prismaClient.user.findFirst({ where: { email } });
  if (user) {
    throw new BadRequestsExceptions('User already Exists', ErrorCodes.USER_ALREADY_EXISTS);
  }
  user = await prismaClient.user.create({
    data: {
      name,
      email,
      password: hashSync(password, 10),
    },
  });
  res.json(user);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  let user = await prismaClient.user.findFirst({ where: { email } });
  if (!user) {
    throw new NotFoundExceptions('User Not Found', ErrorCodes.USER_NOT_FOUND);
  }
  if (!compareSync(password, user.password)) {
    throw new BadRequestsExceptions('Incorrect password', ErrorCodes.INVALID_CREDENTIALS);
  }
  const token = jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET
  );
  res.json({ user, token });
};
