import { Injectable } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { isNullOrUndefined } from 'util';
import { Observable, Subject, zip } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UserProfileDecorator } from '../models/userProfileDecorator';
import { StudyDisplayLanguagePopupServiceAgent } from './serviceAgents/studyDisplayLanguagePopupServiceAgent.service';
import { UserProfileServiceAgent } from './serviceAgents/userProfileServiceAgent.service';

@Injectable()
export class LanguageService {
    private profileLanguageUpdateNotifier: Subject<void>;
    constructor(private translate: TranslateService, private studyPopup: StudyDisplayLanguagePopupServiceAgent,
                private profile: UserProfileServiceAgent) {
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

    public changeLanguagePromise(languageCode: string): Promise<any> {
      if (this.canUseLanguage(languageCode)) {
        localStorage.setItem('studyLanguage', languageCode);
        return this.translate.use(languageCode).toPromise();
      } else {
        console.log(`Error: cannot use language ${languageCode}`);
        return null;
      }
    }

    public changeLanguage(languageCode: string): boolean {
        if (this.canUseLanguage(languageCode)) {
            localStorage.setItem('studyLanguage', languageCode);
            this.translate.use(languageCode);
            return true;
        }

        return false;
    }

    public shouldDisplayLanguagePopup(studyGuid: string): Observable<boolean> {
      const studyDisplayObservable: Observable<boolean> = this.studyPopup.getStudyDisplayLanguagePopup(studyGuid);
      const userNotDisplayObservable: Observable<boolean> = this.profile.profile
        .pipe(
          map((decorator: UserProfileDecorator) => {
            return decorator.profile.skipLanguagePopup;
          }));

      return zip(studyDisplayObservable, userNotDisplayObservable)
        .pipe(map(([study, user]) => study && user));
    }
}
