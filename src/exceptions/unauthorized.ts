import { HtttpsExceptions } from './root';

export class UnauthorizedHttpException extends HtttpsExceptions {
  constructor(message: string, errorCode: number, error?: any) {
    super(message, errorCode, 401, error);
  }
}
