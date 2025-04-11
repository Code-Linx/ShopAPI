import { NextFunction, Request, Response } from 'express';
import { UnauthorizedHttpException } from '../exceptions/unauthorized';
import { ErrorCodes } from '../exceptions/root';

const adminMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (user?.role == 'ADMIN') {
    next();
  } else {
    next(
      new UnauthorizedHttpException(
        'Unauthorized, Please Login as admin',
        ErrorCodes.UNAUTHORIZED_ACCESS
      )
    );
  }
};

export default adminMiddleWare;
