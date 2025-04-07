import { HtttpsExceptions } from './root';

export class internalExceptions extends HtttpsExceptions {
  constructor(message: string, error: any, errorCode: number) {
    super(message, errorCode, 500, error);
  }
}
