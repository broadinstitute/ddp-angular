import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, take } from 'rxjs/operators';

import { CompositeDisposable, LanguageService, SessionMementoService } from 'ddp-sdk';

import * as RouterResource from '../../router-resources';

import { CurrentActivityService } from '../../sdk/services/currentActivity.service';
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
  private anchor = new CompositeDisposable();

  constructor(
    private session: SessionMementoService,
    private currentActivityService: CurrentActivityService,
    private multiGovernedUserService: MultiGovernedUserService,
    private languageService: LanguageService
  ) {}

  onBeforeLanguageChange(): void {
    if (!this.session.session) {
      return;
    }

    if (this.session.session.participantGuid) {
      this.prevParticipantGuid = this.session.session.participantGuid;
      this.languageService.notifyParticipantGuidBeforeLanguageChange(this.prevParticipantGuid);
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
    const currentActivity$ = this.currentActivityService
      .getCurrentActivity()
      .subscribe(x => {
        this.isProgressBarVisible =
          x &&
          this.activitiesToShowProgress.includes(
            x.activityCode as ActivityCodes,
          );
        this.isMedicalHistory =
          x && x.activityCode === ActivityCodes.MEDICAL_HISTORY;
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
}
