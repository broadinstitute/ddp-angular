import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isNullOrUndefined } from "util";
import { Observable, Subject } from "rxjs";
import { startWith } from "rxjs/operators";

@Injectable()
export class LanguageService {
    private profileLanguageUpdateNotifier: Subject<boolean>;
    constructor(private translate: TranslateService) {
      this.profileLanguageUpdateNotifier = new Subject<boolean>();
      this.profileLanguageUpdateNotifier.next(false);
    }

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

    public getProfileLanguageUpdateNotifier(): Observable<boolean> {
      return this.profileLanguageUpdateNotifier.asObservable().pipe(startWith(false));
    }

    public notifyOfProfileLanguageUpdate(val: boolean): void {
      this.profileLanguageUpdateNotifier.next(val);
    }

    public changeLanguagePromise(languageCode: string): Promise<any> {
      if (this.canUseLanguage(languageCode)) {
        localStorage.setItem('studyLanguage', languageCode);
        return this.translate.use(languageCode).toPromise();
      }
      else {
        console.log(`Error: cannot use language ${languageCode}`);
        return null;
      }
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
