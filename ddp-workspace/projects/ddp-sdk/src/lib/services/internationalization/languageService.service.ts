import { Inject, Injectable } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { LoggingService } from '../logging.service';
import { SessionMementoService } from '../sessionMemento.service';
import { ConfigurationService } from '../configuration.service';

@Injectable()
export class LanguageService {
  private profileLanguageUpdateNotifier: Subject<void>;
  private notifierParticipantGuid$: Subject<string> = new Subject();
  private readonly LOG_SOURCE = 'LanguageService';

  constructor(
    private logger: LoggingService,
    private translate: TranslateService,
    private session: SessionMementoService,
    @Inject('ddp.config') private config: ConfigurationService) {
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
    const loadedCode: string = localStorage.getItem('studyLanguage');
    if (loadedCode) {
      this.changeLanguage(loadedCode);

      return loadedCode;
    } else {
      return null;
    }
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

      if (this.session.session !== null) {
        this.session.updateSession(
          Object.assign({}, this.session.session, { locale: languageCode })
        );
      }

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

  public getAppLanguageCode(): string {
    return this.translate.currentLang ||
      (this.session.session && this.session.session.locale) ||
      localStorage.getItem('studyLanguage') ||
      this.config.defaultLanguageCode ||
      'en';
  }
  public notifyParticipantGuidBeforeLanguageChange(participantGuid: string): void {
    this.notifierParticipantGuid$.next(participantGuid);
  }
  public getParticipantGuidBeforeLanguageChange(): Observable<string> {
    return this.notifierParticipantGuid$.asObservable();
  }
}
