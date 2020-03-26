import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class LanguageService {
    constructor(private translate: TranslateService) { }

    public getCurrentLanguage(): string {
        return this.translate.currentLang;
    }
}
