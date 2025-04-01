import { Request, Response } from 'express';
import { prismaClient } from '..';
import { hashSync, compareSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secret';

export const signup = async (req: Request, res: Response) => {
  const { email, name, password } = req.body;
  let user = await prismaClient.user.findFirst({ where: { email } });
  if (user) {
    throw Error('User already exist');
  }
  user = await prismaClient.user.create({
    data: {
      name,
      email,
      passwod: hashSync(password, 10),
    },
  });
  res.json(user);
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
