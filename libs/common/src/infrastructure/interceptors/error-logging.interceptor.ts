import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class ErrorLoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(ErrorLoggingInterceptor.name);

    intercept(
        context: ExecutionContext,
        next: CallHandler<any>
    ): Observable<any> {

        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        this.logRequest(request);

        return next.handle().pipe(
            tap((data) => {
                this.logResponse(request, response, data);
            }),
            catchError((error) => {
                // Log the error message and stack trace
                this.logger.error(error.message, error.stack);

                // Re-throw the error to propagate it further
                return throwError(error);
            })
        );
    }

    private logRequest(request: any) {
        if (request) {
          const requestBody = JSON.stringify(request.body); // Serialize request body
          this.logger.log(
            `Incoming request: ${request.method} ${request.url}`,
            `Request body: ${requestBody}`
          );
        }
      }
    
      private logResponse(request: any, response: any, data: any) {
        if (request && response) {
          const responseBody = JSON.stringify(data); // Serialize response data
          this.logger.log(
            `Outgoing response for ${request.method} ${request.url}: ${response.statusCode}`,
            `Response body: ${responseBody}`
          );
        }
      }
}
