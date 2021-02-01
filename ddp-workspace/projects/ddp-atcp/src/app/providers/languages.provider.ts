import { ValueProvider, InjectionToken } from '@angular/core';
import languages from '../../assets/i18n/languages.json';

export interface Language {
  code: string;
  name: string;
}

export const LANGUAGES_TOKEN = new InjectionToken<Language[] | Promise<any>>('Language');

export const LanguagesProvider: ValueProvider = {
  provide: LANGUAGES_TOKEN,
  useValue: languages,
};
