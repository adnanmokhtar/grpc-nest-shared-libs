import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

import { ErrorResponse } from '@app/common/application/dtos/error-response.dto';
import { LocalizationService } from '@app/common/application/services/localization.service';
import { ErrorResponseException } from '@app/common/domain/exceptions/error-response.exception';
import { FileLogger } from '../utils/logger.service';

@Catch(HttpException)
export class ValidationExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly localizationService: LocalizationService,
    private readonly fileLogger: FileLogger
  ) { }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof ErrorResponseException) {
      const responseData = exception.getResponse() as ErrorResponse<Error>;
      const code = responseData.code;
      response.status(code).json({
        status: responseData.status,
        code: code,
        message: responseData.message,
        errors: responseData.errors
      });
    } else if (exception.getStatus() === HttpStatus.NOT_FOUND) {
      // Handle 404 (Not Found) error
      response.status(HttpStatus.NOT_FOUND).json({
        status: 'error',
        code: HttpStatus.NOT_FOUND,
        message: this.localizationService.translate("messages.error.resource_not_found"),
        errors: []
      });
    } else if (exception instanceof HttpException && exception.getStatus() === HttpStatus.BAD_REQUEST) {
      // Handle other Bad Request errors
      const responseData = this.getValidationErrors(exception);
      response.status(HttpStatus.BAD_REQUEST).json(responseData);
    } else {
      // Handle other internal server errors
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.localizationService.translate("messages.error.internal_server_error"),
        errors: []
      });
    }
  }

  private getValidationErrors(exception: HttpException): any {
    const response = exception.getResponse() as Record<string, any>;

    if (typeof response === 'object' && response && 'message' in response) {
      const validationErrors = response['message'];
      const formattedErrors = this.formatValidationErrors(validationErrors);
      return {
        status: 'error',
        code: HttpStatus.BAD_REQUEST,
        message: this.localizationService.translate("messages.error.input_data_validation_failed"),
        errors: formattedErrors
      };
    } else if (typeof response === 'string') {
      return {
        status: 'error',
        code: HttpStatus.BAD_REQUEST,
        message: response,
        errors: []
      };
    } else {
      return {
        status: 'error',
        code: HttpStatus.BAD_REQUEST,
        message: this.localizationService.translate("messages.error.input_data_validation_failed"),
        errors: []
      };
    }
  }

  private formatValidationErrors(validationErrors: any): any[] {
    if (Array.isArray(validationErrors)) {
      return validationErrors.map((error: any) => ({
        property: error.field,
        constraints: error.errors,
      }));
    } else if (typeof validationErrors === 'object') {
      return Object.keys(validationErrors).map((property) => ({
        property,
        constraints: validationErrors[property],
      }));
    }
    return [];
  }


  private flattenValidationErrors(validationErrors: Record<string, any>): Record<string, string[]> {
    const flattenedErrors: Record<string, string[]> = {};

    Object.keys(validationErrors).forEach((property) => {
      const messages = validationErrors[property];
      if (Array.isArray(messages)) {
        flattenedErrors[property] = messages;
      } else {
        flattenedErrors[property] = [messages];
      }
    });

    return flattenedErrors;
  }
}
