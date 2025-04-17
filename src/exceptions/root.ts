export class HtttpsExceptions extends Error {
  errorCode: any;
  statusCode: number;
  error: any;
  constructor(message: string, errorCode: ErrorCodes, statusCode: number, error: any) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.error = error;
  }
}

export enum ErrorCodes {
  USER_NOT_FOUND = 1001, // User does not exist
  INVALID_CREDENTIALS = 1002, // Wrong email or password
  UNAUTHORIZED_ACCESS = 1003, // Unauthorized operation
  TOKEN_EXPIRED = 1004, // JWT token expired
  ACCOUNT_LOCKED = 1005, // Too many failed login attempts
  USER_ALREADY_EXISTS = 1006, // User already exists
  PRODUCT_NOT_FOUND = 1007,
  ADDRESS_NOT_FOUND = 1008,

  DATABASE_ERROR = 2001, // Generic database failure
  DUPLICATE_ENTRY = 2002, // Unique constraint violation (e.g., email already registered)
  UNPROCESSABLE_ENTITY = 2003,
  INTERNAL_EXCEPTIONS = 30001,

  SERVER_ERROR = 5000, // General server error
}
