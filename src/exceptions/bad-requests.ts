import { ErrorCodes, HtttpsExceptions } from './root';

export class BadRequestsExceptions extends HtttpsExceptions {
  constructor(message: string, errorCode: ErrorCodes) {
    super(message, errorCode, 400, null);
  }
}
