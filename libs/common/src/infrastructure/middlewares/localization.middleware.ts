import { LocalizationService } from '@app/common/application/services/localization.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LocalizationMiddleware implements NestMiddleware {
  constructor(private readonly localizationService: LocalizationService) {}

  use(req: Request, res: Response, next: () => void) {
    // Determine the language from the request, e.g., from a query parameter, header, or cookie
    const language = (req.query.lang as string) || req.headers['accept-language'] || 'en'; // Default to 'en' if not specified
  
    // Set the language in the localization service
    this.localizationService.setLanguage(language);
  
    // Continue processing the request
    next();
  }
}
