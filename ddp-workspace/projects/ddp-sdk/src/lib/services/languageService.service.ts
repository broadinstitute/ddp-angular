import { Injectable } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Observable, Subject } from "rxjs";
import { startWith } from "rxjs/operators";

@Injectable()
export class LanguageService {
  private profileLanguageUpdateNotifier: Subject<void>;
  constructor(private translate: TranslateService) {
    this.profileLanguageUpdateNotifier = new Subject<void>();
    this.profileLanguageUpdateNotifier.next();
  }

  public getCurrentLanguage(): string {
    return this.translate.currentLang;
  }

  public onLanguageChange(): Observable<LangChangeEvent> {
    return this.translate.onLangChange;
  }

  public canUseLanguage(languageCode: string): boolean {
    if (languageCode) {
      return this.translate.getLangs().includes(languageCode);
    }
    return false;
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

  public getProfileLanguageUpdateNotifier(): Observable<void> {
    return this.profileLanguageUpdateNotifier.asObservable().pipe(
      startWith(<void>null)); //Make sure anything that updates when the language updates gets an initial value!
  }

  public notifyOfProfileLanguageUpdate(): void {
    this.profileLanguageUpdateNotifier.next();
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
