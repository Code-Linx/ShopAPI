import { NextFunction, Request, Response } from 'express';
import { UnauthorizedHttpException } from '../exceptions/unauthorized';
import { ErrorCodes } from '../exceptions/root';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secret';
import { prismaClient } from '..';

const authMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
  // 1. Get the Authorization header
  const authHeader = req.headers.authorization;

  // 2. If header is missing, return unauthorized
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedHttpException('Unauthorized', ErrorCodes.UNAUTHORIZED_ACCESS));
  }

  // 3. Extract the token string
  const token = authHeader.split(' ')[1];

  try {
    // 4. Verify the token and extract payload
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };

    // 5. Find the user from DB using the payload userId
    const userId = Number(payload.userId);
    if (isNaN(userId)) {
      return next(new UnauthorizedHttpException('Unauthorized', ErrorCodes.UNAUTHORIZED_ACCESS));
    }

    const user = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    // 6. If no user found, unauthorized
    if (!user) {
      return next(new UnauthorizedHttpException('Unauthorized', ErrorCodes.UNAUTHORIZED_ACCESS));
    }

    // 7. Attach user to request object and proceed
    req.user = user;
    next();
  } catch (error) {
    return next(new UnauthorizedHttpException('Unauthorized', ErrorCodes.UNAUTHORIZED_ACCESS));
  }
};

export default authMiddleWare;
