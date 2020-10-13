import { Injectable } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { isNullOrUndefined } from 'util';
import { Observable, Subject } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { LoggingService } from '../logging.service';

@Injectable()
export class LanguageService {
  private profileLanguageUpdateNotifier: Subject<void>;
  private readonly LOG_SOURCE = 'LanguageService';

  constructor(
    private logger: LoggingService,
    private translate: TranslateService) {
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
    if (isNullOrUndefined(languageCode)) {
      return false;
    }
    return this.translate.getLangs().includes(languageCode);
  }

  public addLanguages(languageCodes: Array<string>): void {
    this.translate.addLangs(languageCodes);
  }

  public useStoredLanguage(): string {
    const loadedCode: string = localStorage.getItem('studyLanguage');
    if (this.changeLanguage(loadedCode)) {
      return loadedCode;
    }
    return null;
  }

  public getProfileLanguageUpdateNotifier(): Observable<void> {
    return this.profileLanguageUpdateNotifier.asObservable().pipe(
      startWith(null as void)); // Make sure anything that updates when the language updates gets an initial value!
  }

  public notifyOfProfileLanguageUpdate(): void {
    this.profileLanguageUpdateNotifier.next();
  }

  public changeLanguageObservable(languageCode: string): Observable<any> {
    if (this.canUseLanguage(languageCode)) {
      localStorage.setItem('studyLanguage', languageCode);
      return this.translate.use(languageCode);
    } else {
      this.logger.logError(this.LOG_SOURCE, `Error: cannot use language ${languageCode}`);
      return null;
    }
  }

  public changeLanguage(languageCode: string): boolean {
    const obs = this.changeLanguageObservable(languageCode);
    return obs !== null;
  }
}
