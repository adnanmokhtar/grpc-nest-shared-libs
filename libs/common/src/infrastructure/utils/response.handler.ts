import { ErrorResponse } from '@app/common/application/dtos/error-response.dto';
import { LocalizationService } from '@app/common/application/services/localization.service';
import { ErrorResponseException } from '@app/common/domain/exceptions/error-response.exception';
import { HttpStatus, Injectable } from '@nestjs/common';
import { SuccessResponse } from '../../application/dtos/success-response.dto';
import { FileLogger } from './logger.service';

@Injectable()
export class ResponseHandler {
  constructor(
    private readonly logger: FileLogger,
    private readonly localizationService: LocalizationService
  ) { }

  /**
   * Handles response formatting for both success and error scenarios.
   *
   * @param data - The response data to be sent.
   * @param error - An optional error object.
   * @param statusCode - The HTTP status code (default: HttpStatus.OK).
   * @param message - An optional custom message (default: 'Success').
   * @returns The formatted response.
   */
  handle(data: any, error: Error | null = null, statusCode: number = HttpStatus.OK, message: string | null = 'Success'): any {
    message = this.getTranslateMessage(message as string);
    const errorMessage = error ? this.getTranslateMessage(error.message) : '';

    if (error) {
      // Log the error here
      console.error('Error:', errorMessage);

      this.logger.error('Error message', errorMessage);

      // If the provided message is null, use the error message
      message = message || errorMessage;

      // Handle error response using ErrorResponse with a custom message
      // throw ErrorResponse('error', statusCode, message, data || [errorMessage]);

      throw new ErrorResponseException(new ErrorResponse('error', statusCode, message, data || [errorMessage]));
    } else {
      // Handle success response using SuccessResponse with a custom message
      return new SuccessResponse('success', statusCode, message, data);
    }
  }

  /**
   * Translates a message with optional dynamic arguments.
   * The message can have a format like "mainMessage-argKey-secondMessage".
   * The second part (argKey) is used as the key for dynamic argument translation.
   *
   * @param message - The message to translate, with optional dynamic argument part.
   * @returns The translated message.
   */
  getTranslateMessage(message: string): string {
    // Split the text by hyphens to get individual parts
    const parts = message.split('-');

    // Extract the main message and set default values for arg and secondMessage
    const mainMessage = parts[0];
    const argKey = parts[1] ?? ''; // Optional dynamic argument key
    const secondMessage = parts[2] ?? ''; // Optional second message

    // Translate the second part (argKey) to obtain the dynamic argument value
    const dynamicArgValue = this.localizationService.translate(secondMessage);

    // Create an object with the dynamic argument using computed property name (ES6 feature)
    const dynamicArgs = { [argKey]: dynamicArgValue };

    // Translate the main message with the dynamic argument
    const translatedMessage = this.localizationService.translate(mainMessage, {
      args: dynamicArgs,
    });

    return translatedMessage;
  }
}
