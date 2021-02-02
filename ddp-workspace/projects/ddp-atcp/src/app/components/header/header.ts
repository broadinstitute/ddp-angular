import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { filter, take } from 'rxjs/operators';

import {
  CompositeDisposable,
  ConfigurationService,
  SessionMementoService,
  UserProfileDecorator,
  LoggingService,
} from 'ddp-sdk';

import * as RouterResource from '../../router-resources';

import { CurrentActivityService } from '../../sdk/services/currentActivity.service';
import { UserPreferencesServiceAgent } from '../../services/serviceAgents/userPreferencesServiceAgent';
import { ActivityCodes } from '../../sdk/constants/activityCodes';
import { MultiGovernedUserService } from '../../services/multi-governed-user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  public RouterResource = RouterResource;
  public isProgressBarVisible = false;
  public isMedicalHistory = false;
  public activitiesToShowProgress = [
    ActivityCodes.MEDICAL_HISTORY,
    ActivityCodes.FEEDING,
  ];
  public isMultiGoverned: boolean;
  
  private prevParticipantGuid: string;
  private userProfileDecorator: UserProfileDecorator;
  private readonly LOG_SOURCE = 'HeaderComponent';
  private anchor = new CompositeDisposable();

  constructor(
    private session: SessionMementoService,
    private logger: LoggingService,
    private translate: TranslateService,
    private currentActivityService: CurrentActivityService,
    @Inject('ddp.config') private configuration: ConfigurationService,
    private userPreferencesServiceAgent: UserPreferencesServiceAgent,
    private multiGovernedUserService: MultiGovernedUserService
  ) {}

  onBeforeLanguageChange(): void {
    if (!this.session.session) {
      return;
    }

    if (this.session.session.participantGuid) {
      this.prevParticipantGuid = this.session.session.participantGuid;
      this.session.setParticipant(null);
    }
  }

  onAfterProfileLanguageChange(): void {
    if (this.prevParticipantGuid) {
      this.session.setParticipant(this.prevParticipantGuid);
      this.prevParticipantGuid = null;
    }
  }

  public ngOnInit(): void {
    const userProfileSubs$ = this.userPreferencesServiceAgent.profile.subscribe(
      (data: UserProfileDecorator) => {
        if (!!data && this.isAuthenticated) {
          this.userProfileDecorator = data;
          this.runTranslator(
            this.userProfileDecorator.profile.preferredLanguage
          );
        }
      }
    );
    this.anchor.addNew(userProfileSubs$);

    const currentActivity$ = this.currentActivityService
      .getCurrentActivity()
      .subscribe(x => {
        this.isProgressBarVisible =
          x &&
          this.activitiesToShowProgress.includes(
            x.activityCode as ActivityCodes
          );
        this.isMedicalHistory =
          x && x.activityCode === ActivityCodes.MEDICAL_HISTORY;
      });
    this.anchor.addNew(currentActivity$);

    this.multiGovernedUserService.isMultiGoverned$
      .pipe(
        filter(value => value !== null),
        take(1)
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
    this.translate
      .use(languageCode)
      .pipe(take(1))
      .subscribe(
        () => {
          this.logger.logEvent(
            `${this.LOG_SOURCE} %s`,
            `Successfully initialized '${languageCode}' UI language.`
          );
        },
        () => {
          this.logger.logError(
            `${this.LOG_SOURCE} %s`,
            `Problem with '${languageCode}' UI language initialization.
        Default '${this.configuration.defaultLanguageCode}' UI language is used`
          );
          this.translate.use(this.configuration.defaultLanguageCode);
        }
      );
  }
}
