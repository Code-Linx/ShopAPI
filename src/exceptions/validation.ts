import { HtttpsExceptions } from './root';

export class UnprocessableEntity extends HtttpsExceptions {
  constructor(error: any, message: string, errorCode: number) {
    super(message, errorCode, 422, error);
  }
}
