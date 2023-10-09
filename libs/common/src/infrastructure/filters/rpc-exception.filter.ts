import { ArgumentsHost, Catch, RpcExceptionFilter } from '@nestjs/common';
import { Observable, of } from 'rxjs';

@Catch()
export class ExceptionFilter implements RpcExceptionFilter {
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    const errorResponse = {
      code: 400, // Default status code
      message: 'Validation failed',
      details: null, // Optional: Include additional details
    };

    if (exception.response && exception.status) {
      // If it's a custom exception with status and response defined
      errorResponse.code = exception.status;
      errorResponse.message = exception.response.message || 'Validation failed';
      errorResponse.details = exception.response.details || null;
    }

    return of(errorResponse); // Wrap the object in an observable
  }
}
