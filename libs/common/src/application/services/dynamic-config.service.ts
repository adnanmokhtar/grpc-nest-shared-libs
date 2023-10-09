import { Injectable } from '@nestjs/common';

@Injectable()
export class DynamicConfigService {
  private language: string = 'en';

  getLanguage(): string {
    return this.language;
  }

  setLanguage(newLanguage: string): void {
    this.language = newLanguage;
  }
}
