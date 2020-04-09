import { ValueProvider, InjectionToken } from '@angular/core';
import languages from '../../assets/i18n/languages.json';

export interface Language {
  code: string;
  name: string;
}

export const LanguagesToken = new InjectionToken<Language>('Language');

export const LanguagesProvider: ValueProvider = {
  provide: LanguagesToken,
  useValue: languages
};
