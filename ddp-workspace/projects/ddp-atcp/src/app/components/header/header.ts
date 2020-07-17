import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  CompositeDisposable,
  ConfigurationService,
  NGXTranslateService,
  SessionMementoService,
  UserProfileDecorator,
  CurrentActivityService,
  ActivityCodes
} from 'ddp-sdk';
import * as RouterResource from '../../router-resources';
import { Language, LanguagesToken } from '../../providers/languages.provider';
import { TranslateService } from '@ngx-translate/core';
import { UserPreferencesServiceAgent } from '../../services/serviceAgents/userPreferencesServiceAgent';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public RouterResource = RouterResource;
  public SignIn: string;
  private anchor = new CompositeDisposable();
  private userProfileDecorator: UserProfileDecorator;
  isProgressBarVisible = false;
  activityToShowProgress = ActivityCodes.MEDICAL_HISTORY;

  constructor(@Inject(LanguagesToken) public languages: Language[],
              private session: SessionMementoService,
              private ngxTranslate: NGXTranslateService,
              private translate: TranslateService,
              private currentActivityService: CurrentActivityService,
              @Inject('ddp.config') private configuration: ConfigurationService,
              private userPreferencesServiceAgent: UserPreferencesServiceAgent) {
  }

  public ngOnInit(): void {
    const translate$ = this.ngxTranslate.getTranslation('Common.Navigation.SignIn')
      .subscribe((SignIn: string) => this.SignIn = SignIn);
    this.anchor.addNew(translate$);

    const userProfileSubs$ = this.userPreferencesServiceAgent.profile
      .subscribe((data: UserProfileDecorator) => {
        if (!!data && this.isAuthenticated) {
          this.userProfileDecorator = data;
          this.runTranslator(this.userProfileDecorator.profile.preferredLanguage);
        }
      });
    this.anchor.addNew(userProfileSubs$);

    const currentActivity$ = this.currentActivityService.getCurrentActivity().subscribe(x => {
      x && x.activityCode === this.activityToShowProgress
      ? this.isProgressBarVisible = true
        : this.isProgressBarVisible = false;
      });
    this.anchor.addNew(currentActivity$);
  }

  public get isAuthenticated(): boolean {
    return this.session.isAuthenticatedSession();
  }

  public trackByFn(indx: number): number {
    return indx;
  }

  public ngOnDestroy(): void {
    this.anchor.removeAll();
  }

  public changeLanguage(language: Language): void {
    if (!!this.userProfileDecorator) {
      this.userProfileDecorator.profile.preferredLanguage = language.code;
      this.userPreferencesServiceAgent.saveProfile(false, this.userProfileDecorator.profile)
        .subscribe((data: UserProfileDecorator) => {
            this.userProfileDecorator = data;
            this.runTranslator(this.userProfileDecorator.profile.preferredLanguage);
        });
    } else {
      this.runTranslator(language.code);
    }
  }

  public runTranslator(languageCode: string): void {
    this.translate.use(languageCode).subscribe(() => {
      console.log(`Successfully initialized '${languageCode}' UI language.`);
    }, () => {
      console.error(`Problem with '${languageCode}' UI language initialization.
      Default '${this.configuration.defaultLanguageCode}' UI language is used`);
      this.translate.use(this.configuration.defaultLanguageCode);
    });
  }
}
