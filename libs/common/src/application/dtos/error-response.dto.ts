import { Injectable } from '@nestjs/common';

@Injectable()
export class ErrorResponse<T> {
  constructor(
    public status: string,
    public code: number,
    public message: string = getErrorMessage(code),
    public errors: any[] = []
  ) { }
}

// Define a function to get the error message based on status code
function getErrorMessage(statusCode: number): string {
  const errorMessages: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    409: 'Conflict',
    422: 'Unprocessable Entity',
    500: 'Internal Server Error',
  };

  return errorMessages[statusCode] || 'Unknown Error';
}