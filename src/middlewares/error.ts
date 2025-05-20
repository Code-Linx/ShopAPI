import { NextFunction, Request, Response } from 'express';
import { HtttpsExceptions } from '../exceptions/root';
import logger from '../utils/logger';

export const errorMiddleware = (
  error: HtttpsExceptions,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // ✅ Automatically log every error
  logger.error(`❌ ${req.method} ${req.originalUrl} — ${error.message}`, {
    statusCode: error.statusCode,
    errorCode: error.errorCode,
    stack: error.stack,
  });

  res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode,
    error: error.error,
  });
};
