import { Request, Response } from 'express';
import { prismaClient } from '..';
import { hashSync } from 'bcrypt';

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
