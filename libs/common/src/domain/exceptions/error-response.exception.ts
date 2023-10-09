import { ErrorResponse } from '@app/common/application/dtos/error-response.dto';
import { HttpException } from '@nestjs/common';

export class ErrorResponseException<T> extends HttpException {
  constructor(data: ErrorResponse<T>) {
    super(data, data.code); // You can specify a default status code here
  }
}
