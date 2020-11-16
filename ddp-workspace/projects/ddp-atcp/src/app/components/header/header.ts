import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import {
  CompositeDisposable,
  ConfigurationService,
  SessionMementoService,
  UserProfileDecorator,
} from 'ddp-sdk';
import * as RouterResource from '../../router-resources';
import { Language, LanguagesToken } from '../../providers/languages.provider';
import { TranslateService } from '@ngx-translate/core';
import { CurrentActivityService } from '../../sdk/services/currentActivity.service';
import { UserPreferencesServiceAgent } from '../../services/serviceAgents/userPreferencesServiceAgent';
import { take } from 'rxjs/operators';
import { ActivityCodes } from '../../sdk/constants/activityCodes';
import { MultiGovernedUserService } from '../../services/multi-governed-user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public RouterResource = RouterResource;
  private anchor = new CompositeDisposable();
  private userProfileDecorator: UserProfileDecorator;
  isProgressBarVisible = false;
  activityToShowProgress = ActivityCodes.MEDICAL_HISTORY;
  isMultiGoverned: boolean;

  constructor(@Inject(LanguagesToken) public languages: Language[],
              private session: SessionMementoService,
              private translate: TranslateService,
              private currentActivityService: CurrentActivityService,
              @Inject('ddp.config') private configuration: ConfigurationService,
              private userPreferencesServiceAgent: UserPreferencesServiceAgent,
              private multiGovernedUserService: MultiGovernedUserService) {
  }

  public ngOnInit(): void {
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

    this.multiGovernedUserService.isMultiGoverned$
      .pipe(
        filter(value => value !== null),
        take(1),
      )
      .subscribe(isMultiGoverned => {
        this.isMultiGoverned = isMultiGoverned;
      });
  }

  public get isAuthenticated(): boolean {
    return this.session.isAuthenticatedSession();
  }

  public ngOnDestroy(): void {
    this.anchor.removeAll();
  }

  public runTranslator(languageCode: string): void {
    this.translate.use(languageCode)
      .pipe(take(1))
      .subscribe(() => {
      console.log(`Successfully initialized '${languageCode}' UI language.`);
    }, () => {
      console.error(`Problem with '${languageCode}' UI language initialization.
      Default '${this.configuration.defaultLanguageCode}' UI language is used`);
      this.translate.use(this.configuration.defaultLanguageCode);
    });
  }
}
