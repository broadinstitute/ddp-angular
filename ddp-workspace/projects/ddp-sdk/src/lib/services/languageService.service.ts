import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isNullOrUndefined } from "util";

@Injectable()
export class LanguageService {
    constructor(private translate: TranslateService) { }

    public getCurrentLanguage(): string {
        return this.translate.currentLang;
    }

    public canUseLanguage(languageCode: string): boolean {
      if (isNullOrUndefined(languageCode)) {
        return false;
      }
      return this.translate.getLangs().includes(languageCode);
    }

    public addLanguages(languageCodes: Array<string>): void {
      this.translate.addLangs(languageCodes);
    }

    public useStoredLanguage(): string {
      let loadedCode: string = localStorage.getItem('studyLanguage');
      if (this.changeLanguage(loadedCode)) {
        return loadedCode;
      }
      return null;
    }

    public changeLanguage(languageCode: string): boolean {
      if (this.canUseLanguage(languageCode)) {
        this.translate.use(languageCode);
        localStorage.setItem('studyLanguage', languageCode);
        return true;
      }

      return false;
    }
}
