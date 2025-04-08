import { ErrorCodes, HtttpsExceptions } from './root';

export class NotFoundExceptions extends HtttpsExceptions {
  constructor(message: string, errorCode: ErrorCodes) {
    super(message, errorCode, 404, null);
  }
}
