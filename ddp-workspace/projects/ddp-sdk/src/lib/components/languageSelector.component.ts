import { Component, Inject, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { CompositeDisposable} from '../compositeDisposable';
import { UserProfile } from '../models/userProfile';
import { StudyLanguage } from '../models/studyLanguage';
import { ConfigurationService } from '../services/configuration.service';
import { LanguageService } from '../services/languageService.service';
import { SessionMementoService } from '../services/sessionMemento.service';
import { UserProfileServiceAgent} from '../services/serviceAgents/userProfileServiceAgent.service';
import { LanguageServiceAgent } from '../services/serviceAgents/languageServiceAgent.service';
import { isNullOrUndefined } from 'util';
import { iif, Observable, of, Subscription } from 'rxjs';
import { concatMap, flatMap, map, take } from 'rxjs/operators';

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
    </div>
  `
})
export class LanguageSelectorComponent implements OnInit, OnDestroy {
  @Input() isScrolled: boolean;
  @Output() isVisible: EventEmitter<boolean> = new EventEmitter();
  public loaded: boolean;
  public currentLanguage: StudyLanguage;
  public iconURL: string;
  private studyLanguages: StudyLanguage[];
  private anchor: CompositeDisposable;

  constructor(
    private serviceAgent: LanguageServiceAgent,
    private language: LanguageService,
    private profileServiceAgent: UserProfileServiceAgent,
    @Inject('ddp.config') private config: ConfigurationService,
    private session: SessionMementoService) { }

  public ngOnInit(): void {
    this.anchor = new CompositeDisposable();
    this.iconURL = this.config.languageSelectorIconURL ? this.config.languageSelectorIconURL : "assets/images/globe.svg#Language-Selector-3";
    let sub: Subscription = this.serviceAgent.getConfiguredLanguages(this.config.studyGuid).subscribe(x => {
      if (x) {
        //Only use language selector if multiple languages are configured!
        if (x.length > 1) {
          this.studyLanguages = x;
          this.language.addLanguages(this.studyLanguages.map(x => x.languageCode));
          let sub2: Subscription = this.findCurrentLanguage().subscribe(x => {
            this.loaded = x.valueOf();
            this.isVisible.emit(x.valueOf());
          });
          this.anchor.addNew(sub2);
        } else {
          this.isVisible.emit(false);
        }
      } else {
        console.error('Error: no configured language list was returned.');
        this.isVisible.emit(false);
      }
    });
    this.anchor.addNew(sub);
  }

  public ngOnDestroy(): void {
    if (this.anchor) {
      this.anchor.removeAll();
    }
  }

  public getUnselectedLanguages(): Array<StudyLanguage> {
    if (!isNullOrUndefined(this.studyLanguages)) {
      return this.studyLanguages.filter(elem => elem !== this.currentLanguage);
    }
    return null;
  }

  public changeLanguage(lang: StudyLanguage): void {
    if (!isNullOrUndefined(this.currentLanguage) && this.currentLanguage.languageCode === lang.languageCode) {
      return;
    }

    if (this.language.canUseLanguage(lang.languageCode)) {
      this.currentLanguage = lang;
      if (this.language.getCurrentLanguage() !== lang.languageCode) {
        this.language.changeLanguage(lang.languageCode);
        if (this.session.isAuthenticatedSession()) {
          this.updateProfileLanguage();
        }
      }
    }
    else {
      console.error('Error: The specified language: ' + JSON.stringify(lang) + ' is not configured for the study.');
    }
  }

  //Update the language in the profile to the current language
  private updateProfileLanguage(): void {
    // Create observable that gets the user's profile and creates a copy with updated preferred language
    let getProfileObservable: Observable<UserProfile> = this.profileServiceAgent.profile
      .pipe(map(x => {
        return {...x.profile, preferredLanguage: this.currentLanguage.languageCode};
      })).pipe(take(1));

    // When we get the new profile value, save it
    let updateProfileObservable: Observable<any> = getProfileObservable
      .pipe(concatMap(profile => this.profileServiceAgent.saveProfile(false, profile)));

    //Subscribe to the combined observable
    let sub: Subscription = updateProfileObservable.subscribe(() => this.language.notifyOfProfileLanguageUpdate(true));
    this.anchor.addNew(sub);
  }

  //Find the current language and return true if successful or false otherwise
  public findCurrentLanguage(): Observable<boolean> {
    //Check for a language in the profile
    let profileLangObservable: Observable<StudyLanguage> = this.getProfileLangObservable();

    //Use the current language if it exists or check for a stored language
    let currentStoredLangObservable: Observable<StudyLanguage> = this.getCurrentStoredLangObservable();

    //Check for a default language
    let defaultLangObservable: Observable<StudyLanguage> = this.getDefaultLangObservable();

    //Create an observable that will check each applicable option and return the first valid language found, if any
    let langObservable: Observable<StudyLanguage> = profileLangObservable.pipe(
      flatMap(x => {
        return this.getNextObservable(x, currentStoredLangObservable);
      }),
      flatMap(y => {
        return this.getNextObservable(y, defaultLangObservable);
      })
    );

    //Return an observable that uses langObservable to get the language and if found, sets the language and
    // returns true, or otherwise logs an error and returns false
    return langObservable.pipe(map(x => {
      if (this.foundLanguage(x)) {
        this.changeLanguage(x);
        return true;
      }
      else {
        console.error('Error: no stored, profile, or default language found');
        return false;
      }
    }));
  }

  private getNextObservable(lang: StudyLanguage, obs: Observable<StudyLanguage>): Observable<StudyLanguage> {
    if (this.foundLanguage(lang)) {
      return of(lang);
    }
    else {
      return obs;
    }
  }

  private getCurrentStoredLangObservable(): Observable<StudyLanguage> {
    return new Observable<StudyLanguage>(subscriber => {
      //Use the current language if it exists
      if (!isNullOrUndefined(this.currentLanguage)) {
        subscriber.next(this.currentLanguage);
      }
      else {
        //Check for a stored language
        let loadedCode: string = this.language.useStoredLanguage();
        if (loadedCode) {
          let lang: StudyLanguage = this.studyLanguages.find(x => x.languageCode === loadedCode);
          subscriber.next(isNullOrUndefined(lang) ? null : lang);
        }
        else {
          subscriber.next(null);
        }
      }
      subscriber.complete();
    });
  }

  private getProfileLangObservable(): Observable<StudyLanguage> {
    let profileLangObservable: Observable<StudyLanguage> = this.profileServiceAgent.profile
      .pipe(map(x => {
        if (x && x.profile.preferredLanguage) {
          return this.studyLanguages.find(y => y.languageCode === x.profile.preferredLanguage);
        }
        else {
          return null;
        }
      }));
    return iif(() => this.session.isAuthenticatedSession(), profileLangObservable, of(null));
  }

  private getDefaultLangObservable(): Observable<StudyLanguage> {
    return new Observable<StudyLanguage>(subscriber => {
      let lang: StudyLanguage = this.studyLanguages.find(element => element.isDefault = true);
      if (!isNullOrUndefined(lang)) {
        subscriber.next(lang);
      }
      else {
        subscriber.next(null);
      }
      subscriber.complete();
    });
  }

  private foundLanguage(lang: StudyLanguage): boolean {
    return !isNullOrUndefined(lang) && this.language.canUseLanguage(lang.languageCode);
  }
}
