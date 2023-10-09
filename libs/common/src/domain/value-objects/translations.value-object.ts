import { Translation } from "../entities/translation";
import { EntityNotFoundException } from "../exceptions/entity-not-found.exception";

export class Translations<T> implements Iterable<Translation> {
  private readonly _translations: Translation[];

  constructor(
    translations: Translation[] = []
    ) {
    this.validate(translations);
    this._translations = translations;
  }

  [Symbol.iterator](): Iterator<Translation> {
    let index = 0;
    const translations = this._translations;

    return {
      next(): IteratorResult<Translation> {
        if (index < translations.length) {
          return { value: translations[index++], done: false };
        } else {
          return { value: undefined, done: true };
        }
      },
    };
  }

  get translations(): Translation[] {
    return this._translations;
  }

  add(translation: Translation): void {
    this._translations.push(translation);
  }

  update(newTranslation: Translation): void {
    const translationIndex = this.findTranslationIndex(newTranslation.getId());
    if (translationIndex === -1) {
      throw new EntityNotFoundException('contry.attributes.translation');
    }
    this._translations[translationIndex] = newTranslation;
  }

  remove(translationId: number): void {
    const translationIndex = this.findTranslationIndex(translationId);
    if (translationIndex === -1) {
      throw new EntityNotFoundException('contry.attributes.translation');
    }
    this._translations.splice(translationIndex, 1);
  }

  private validate(translations: Translation[]): void {
    for (const translation of translations) {
      if (!(translation instanceof Translation)) {
        throw new Error('Invalid country translation');
      }
    }
  }

  private findTranslationIndex(translationId: number | null): number {
    return this._translations.findIndex((translation) => translation.getId() === translationId);
  }

  toJSON(): Translation[] {
    return this._translations;
  }
}
