import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { DynamicConfigService } from './dynamic-config.service';

@Injectable()
export class LocalizationService {

  constructor(
    private readonly i18n: I18nService,
    private readonly dynamicConfigService: DynamicConfigService
  ) { }

  setLanguage(language: string) {
    this.dynamicConfigService.setLanguage(language);
  }

  translate(key: string, args?: Record<string, any>) {
    const language = this.dynamicConfigService.getLanguage();
    const translationOptions = {
      args: {},
      ...args,
      lang: language,
    };

    let message = this.i18n.translate(key, translationOptions) as string;

    if (args) {
      for (const argKey of Object.keys(args)) {
        const argValue = args[argKey];
        message = message.replace(`{${argKey}}`, argValue);
      }
    }

    return message;
  }
}
