import { Component, Inject, Input, OnDestroy, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { iif, Observable, of, Subscription, merge } from 'rxjs';
import { flatMap, map, mergeMap, filter, concatMap, tap } from 'rxjs/operators';
import { PopupWithCheckboxComponent } from '../popupWithCheckbox.component';
import { CompositeDisposable } from '../../compositeDisposable';
import { StudyLanguage } from '../../models/studyLanguage';
import { UserProfile } from '../../models/userProfile';
import { ConfigurationService } from '../../services/configuration.service';
import { LanguageService } from '../../services/internationalization/languageService.service';
import { SessionMementoService } from '../../services/sessionMemento.service';
import { DisplayLanguagePopupServiceAgent } from '../../services/serviceAgents/displayLanguagePopupServiceAgent.service';
import { LanguageServiceAgent } from '../../services/serviceAgents/languageServiceAgent.service';
import { UserProfileServiceAgent } from '../../services/serviceAgents/userProfileServiceAgent.service';
import { LoggingService } from '../../services/logging.service';

@Component({
  selector: 'ddp-language-selector',
  template: `
    <div [hidden]="!loaded">
      <button class="SimpleButton" [ngClass]="{'SimpleButton--Scrolled': isScrolled}" *ngIf="currentLanguage !== null && currentLanguage !== undefined" [matMenuTriggerFor]="menu">
        <svg class="ddp-globe" height="24px" width="24px">
          <title id="title" [lang]="currentLanguage.languageCode" translate>SDK.LanguageSelector.LanguageSelection</title>
          <use [attr.href]="iconURL"></use>
        </svg>
        <span class="ddp-current-language">{{currentLanguage.displayName}}</span>
        <mat-icon class="ddp-dropdown-arrow">arrow_drop_down</mat-icon>
      </button>

      <mat-menu #menu="matMenu" class="language-menu">
        <button mat-menu-item *ngFor="let lang of getUnselectedLanguages()" (click)="changeLanguage(lang)">{{lang.displayName}}</button>
      </mat-menu>
      <ddp-popup-with-checkbox text="Toolkit.Dialogs.LanguagePreferences.Text"
                                   checkboxText="Toolkit.Dialogs.LanguagePreferences.CheckboxText"
                                   buttonText="Toolkit.Dialogs.LanguagePreferences.ButtonText">
      </ddp-popup-with-checkbox>
    </div>
  `
})
export class LanguageSelectorComponent implements OnInit, OnDestroy {
  @Input() isScrolled: boolean;
  @Output() isVisible: EventEmitter<boolean> = new EventEmitter();
  @Output() beforeLanguageChange: EventEmitter<StudyLanguage> = new EventEmitter<StudyLanguage>();
  @Output() afterProfileLanguageChange: EventEmitter<void> = new EventEmitter();
  public loaded: boolean;
  public currentLanguage: StudyLanguage;
  public iconURL: string;
  private studyLanguages: StudyLanguage[] = [];
  private anchor: CompositeDisposable;
  private readonly defaultIconUrl: string = 'assets/images/globe.svg#Language-Selector-3';
  private readonly LOG_SOURCE = 'LanguageSelectorComponent';
  @ViewChild(PopupWithCheckboxComponent, { static: false }) private popup: PopupWithCheckboxComponent;

  constructor(
    private serviceAgent: LanguageServiceAgent,
    private language: LanguageService,
    private logger: LoggingService,
    private profileServiceAgent: UserProfileServiceAgent,
    @Inject('ddp.config') private config: ConfigurationService,
    private session: SessionMementoService,
    @Inject(DOCUMENT) private document: Document,
    private displayPop: DisplayLanguagePopupServiceAgent) { }

  public ngOnInit(): void {
    this.anchor = new CompositeDisposable();
    this.iconURL = this.config.languageSelectorIconURL ? this.config.languageSelectorIconURL : this.defaultIconUrl;
    this.currentLanguageListener();
    this.i18nListener();
    const sub = this.serviceAgent.getConfiguredLanguages(this.config.studyGuid).pipe(
      mergeMap(studyLanguages => {
        if (studyLanguages) {
          // Only use language selector if multiple languages are configured!
          if (studyLanguages.length > 1) {
            this.studyLanguages = studyLanguages;
            this.language.addLanguages(this.studyLanguages.map(language => language.languageCode));
            return this.findCurrentLanguage();
          } else {
            return of(false);
          }
        } else {
          this.logger.logError(this.LOG_SOURCE, 'Error: no configured language list was returned.');
          return of(false);
        }
      })
    ).subscribe(loaded => {
      this.loaded = loaded;
      this.isVisible.emit(loaded);
    });
    this.anchor.addNew(sub);
  }

  public ngOnDestroy(): void {
    this.anchor.removeAll();
  }

  public getUnselectedLanguages(): Array<StudyLanguage> {
    return this.studyLanguages.filter(language => language.languageCode !== this.currentLanguage.languageCode);
  }

  public changeLanguage(lang: StudyLanguage): void {
    if (this.currentLanguage && this.currentLanguage.languageCode === lang.languageCode) {
      return;
    }

    if (this.language.canUseLanguage(lang.languageCode)) {
      this.currentLanguage = lang;
      if (this.language.getCurrentLanguage() !== lang.languageCode) {
        this.beforeLanguageChange.emit(lang);
        const langObs: Observable<any> = this.language.changeLanguageObservable(lang.languageCode);
        let sub;
        if (this.session.isAuthenticatedSession()) {
          sub = this.launchPopup();
          const sub2 = this.updateProfileLanguage().pipe(concatMap(() => langObs)).subscribe();
          this.anchor.addNew(sub2);
        } else {
          sub = langObs.subscribe();
        }
        this.anchor.addNew(sub);
      }
    } else {
      this.logger.logError(this.LOG_SOURCE,
        `Error: The specified language: ${JSON.stringify(lang)} is not configured for the study.`);
    }
  }

  private launchPopup(): Subscription {
    return this.displayPop.getShouldDisplayLanguagePopup()
      .subscribe(shouldDisp => {
        if (shouldDisp) { // If we should display the popup
          this.popup.openModal(); // Display the popup!
        }
      });
  }

  // Update the language in the profile to the current language
  private updateProfileLanguage(): Observable<any> {
    const profileModifications: UserProfile = new UserProfile();
    profileModifications.preferredLanguage = this.currentLanguage.languageCode;
    return this.profileServiceAgent.updateProfile(profileModifications)
      .pipe(
        tap(() => this.afterProfileLanguageChange.emit()),
        tap(() => this.language.notifyOfProfileLanguageUpdate())
      );
  }

  // Find the current language and return true if successful or false otherwise
  public findCurrentLanguage(): Observable<boolean> {
    // Check for a language in the profile
    const profileLangObservable: Observable<StudyLanguage> = this.getProfileLangObservable();

    // Use the current language if it exists or check for a stored language
    const currentStoredLangObservable: Observable<StudyLanguage> = this.getCurrentStoredLangObservable();

    // Check for a default language
    const defaultLangObservable: Observable<StudyLanguage> = this.getDefaultLangObservable();

    // Create an observable that will check each applicable option and return the first valid language found, if any
    const langObservable: Observable<StudyLanguage> = profileLangObservable.pipe(
      flatMap(profileLang => {
        return this.getNextObservable(profileLang, currentStoredLangObservable);
      }),
      flatMap(currentStoredLang => {
        return this.getNextObservable(currentStoredLang, defaultLangObservable);
      })
    );

    // Return an observable that uses langObservable to get the language and if found, sets the language and
    // returns true, or otherwise logs an error and returns false
    return langObservable.pipe(map(language => {
      if (this.foundLanguage(language)) {
        this.changeLanguage(language);
        return true;
      } else {
        this.logger.logError(this.LOG_SOURCE, 'Error: no stored, profile, or default language found.');
        return false;
      }
    }));
  }

  private getNextObservable(lang: StudyLanguage, obs: Observable<StudyLanguage>): Observable<StudyLanguage> {
    if (this.foundLanguage(lang)) {
      return of(lang);
    } else {
      return obs;
    }
  }

  private getCurrentStoredLangObservable(): Observable<StudyLanguage> {
    return new Observable<StudyLanguage>(subscriber => {
      // Use the current language if it exists
      if (this.currentLanguage) {
        subscriber.next(this.currentLanguage);
      } else {
        // Check for a stored language
        const loadedCode: string = this.language.useStoredLanguage();
        if (loadedCode) {
          const lang: StudyLanguage = this.studyLanguages.find(studyLang => studyLang.languageCode === loadedCode);
          subscriber.next(lang ? lang : null);
        } else {
          subscriber.next(null);
        }
      }
      subscriber.complete();
    });
  }

  private getProfileLangObservable(): Observable<StudyLanguage> {
    const profileLangObservable: Observable<StudyLanguage> = this.profileServiceAgent.profile
      .pipe(map(profileDecorator => {
        if (profileDecorator && profileDecorator.profile.preferredLanguage) {
          return this.studyLanguages.find(studyLang => studyLang.languageCode === profileDecorator.profile.preferredLanguage);
        } else {
          return null;
        }
      }));
    return iif(() => this.session.isAuthenticatedSession(), profileLangObservable, of(null));
  }

  private getDefaultLangObservable(): Observable<StudyLanguage> {
    return new Observable<StudyLanguage>(subscriber => {
      const lang: StudyLanguage = this.studyLanguages.find(element => element.isDefault = true);
      if (lang) {
        subscriber.next(lang);
      } else {
        subscriber.next(null);
      }
      subscriber.complete();
    });
  }

  private foundLanguage(lang: StudyLanguage): boolean {
    return lang && this.language.canUseLanguage(lang.languageCode);
  }

  private currentLanguageListener(): void {
    const sub = this.language.onLanguageChange().pipe(
      filter(() => !!this.currentLanguage),
      filter(event => event.lang !== this.currentLanguage.languageCode)
    ).subscribe(event => {
      this.currentLanguage = this.studyLanguages.find(language => {
        return language.languageCode === event.lang;
      });
    });
    this.anchor.addNew(sub);
  }

  private i18nListener(): void {
    const sub = merge(
      of(this.language.getCurrentLanguage()),
      this.language.onLanguageChange().pipe(map(event => event.lang))
    ).subscribe(languageCode => {
      const direction = this.config.rtlLanguages.includes(languageCode) ? 'rtl' : 'ltr';
      this.changeDocumentLanguage(direction, languageCode);
    });
    this.anchor.addNew(sub);
  }

  private changeDocumentLanguage(direction: string, languageCode: string): void {
    const html = this.document.querySelector('html');
    html.setAttribute('dir', direction);
    html.setAttribute('lang', languageCode);
  }
}
