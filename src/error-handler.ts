import { NextFunction, Request, Response } from 'express';
import { ErrorCodes, HtttpsExceptions } from './exceptions/root';
import { internalExceptions } from './exceptions/internal-exceptions';

export const errorHandler = (method: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (error: any) {
      let exception: HtttpsExceptions;
      if (error instanceof HtttpsExceptions) {
        exception = error;
      } else {
        exception = new internalExceptions(
          'Something Went Wrong',
          error,
          ErrorCodes.INTERNAL_EXCEPTIONS
        );
      }
      next(exception);
    }
  };
};
