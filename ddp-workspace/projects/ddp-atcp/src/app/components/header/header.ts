import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  CompositeDisposable,
  ConfigurationService,
  NGXTranslateService,
  SessionMementoService,
  UserProfileDecorator,
  LoggingService
} from 'ddp-sdk';
import * as RouterResource from '../../router-resources';
import { Language, LanguagesToken } from '../../providers/languages.provider';
import { TranslateService } from '@ngx-translate/core';
import { CurrentActivityService } from '../../sdk/services/currentActivity.service';
import { UserPreferencesServiceAgent } from '../../services/serviceAgents/userPreferencesServiceAgent';
import { take } from 'rxjs/operators';
import { ActivityCodes } from '../../sdk/constants/activityCodes';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public RouterResource = RouterResource;
  public SignIn: string;
  isProgressBarVisible = false;
  activityToShowProgress = ActivityCodes.MEDICAL_HISTORY;
  private anchor = new CompositeDisposable();
  private userProfileDecorator: UserProfileDecorator;
  private readonly LOG_SOURCE = 'HeaderComponent';

  constructor(@Inject(LanguagesToken) public languages: Language[],
              private session: SessionMementoService,
              private logger: LoggingService,
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
        .pipe(take(1))
        .subscribe((data: UserProfileDecorator) => {
          this.userProfileDecorator = data;
          this.runTranslator(this.userProfileDecorator.profile.preferredLanguage);
        });
    } else {
      this.runTranslator(language.code);
    }
  }

  public runTranslator(languageCode: string): void {
    this.translate.use(languageCode)
      .pipe(take(1))
      .subscribe(() => {
        this.logger.logEvent(`${this.LOG_SOURCE} %s`, `Successfully initialized '${languageCode}' UI language.`);
      }, () => {
        this.logger.logError(`${this.LOG_SOURCE} %s`, `Problem with '${languageCode}' UI language initialization.
        Default '${this.configuration.defaultLanguageCode}' UI language is used`);
        this.translate.use(this.configuration.defaultLanguageCode);
      });
  }
}
