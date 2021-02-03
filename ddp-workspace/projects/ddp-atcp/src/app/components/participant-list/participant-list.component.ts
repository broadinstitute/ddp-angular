import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { map, take, switchMap, tap, skipWhile } from 'rxjs/operators';

import {
  SessionMementoService,
  ConfigurationService,
  GovernedParticipantsServiceAgent,
  UserProfile,
  ActivityInstance,
  UserActivityServiceAgent,
  UserManagementServiceAgent,
  WorkflowServiceAgent,
  LanguageService,
  CompositeDisposable,
} from 'ddp-sdk';

import { ActivityService } from '../../services/activity.service';
import * as RouterResources from '../../router-resources';
import { ActivityCodes } from '../../sdk/constants/activityCodes';

export interface Participant {
  guid: string;
  profile: UserProfile;
  activities: ActivityInstance[];
}

@Component({
  selector: 'atcp-participant-list',
  templateUrl: './participant-list.component.html',
  styleUrls: ['./participant-list.component.scss'],
})
export class ParticipantListComponent implements OnInit, OnDestroy {
  participants: Participant[] = [];
  isLoaded = false;
  private anchor = new CompositeDisposable();
  private COMPLETE_STATUS_CODE = 'COMPLETE';

  constructor(
    private readonly router: Router,
    private readonly languageService: LanguageService,
    private readonly activityService: ActivityService,
    private readonly session: SessionMementoService,
    private readonly governedParticipantsAgent: GovernedParticipantsServiceAgent,
    private readonly userActivityAgent: UserActivityServiceAgent,
    private readonly workflowAgent: WorkflowServiceAgent,
    private readonly userManagementService: UserManagementServiceAgent,
    @Inject('ddp.config') private readonly config: ConfigurationService
  ) {}

  ngOnInit(): void {
    this.session.setParticipant(null);

    this.getParticipants();

    this.anchor.addNew(
      this.languageService
        .getProfileLanguageUpdateNotifier()
        .pipe(skipWhile(value => value === null))
        .subscribe(() => {
          this.isLoaded = false;
          this.getParticipants();
        })
    );
  }

  ngOnDestroy(): void {
    this.anchor.removeAll();
  }

  onAddParticipantClick(): void {
    this.governedParticipantsAgent
      .addParticipant(this.config.studyGuid)
      .pipe(
        take(1),
        tap(participantGuid => this.session.setParticipant(participantGuid)),
        switchMap(() => this.workflowAgent.fromParticipantList())
      )
      .subscribe(() => {
        this.activityService.setCurrentActivity(null);
        this.router.navigateByUrl(RouterResources.Survey);
      });
  }

  private getParticipants(): void {
    this.governedParticipantsAgent
      .getGovernedStudyParticipants(this.config.studyGuid)
      .pipe(
        take(1),
        map((participants): Omit<Participant, 'activities'>[] =>
          participants.map(participant => ({
            guid: participant.userGuid,
            profile: participant.userProfile,
          }))
        ),
        map(participants =>
          participants.map(participant =>
            this.fetchParticipantActivity(participant.guid).pipe(
              map(activities => ({ ...participant, activities }))
            )
          )
        ),
        switchMap(participants$ => forkJoin(participants$)),
        switchMap(participants =>
          this.checkAndDeleteAccidentalParticipant(participants)
        )
      )
      .subscribe({
        next: participants => {
          this.participants = participants;
        },
        complete: () => {
          this.session.setParticipant(null);

          this.isLoaded = true;
        },
      });
  }

  private fetchParticipantActivity(
    participantGuid: string
  ): Observable<ActivityInstance[]> {
    return new Observable(observer => {
      this.session.setParticipant(participantGuid);

      this.userActivityAgent
        .getActivities(of(this.config.studyGuid))
        .subscribe(activities => {
          observer.next(activities);
          observer.complete();
        });
    });
  }

  private checkAndDeleteAccidentalParticipant(
    participants: Participant[]
  ): Observable<Participant[]> {
    const accidentalParticipant = participants.find(participant => {
      const registrationActivity = participant.activities.find(
        activity => activity.activityCode === ActivityCodes.REGISTRATION
      );

      return registrationActivity.statusCode !== this.COMPLETE_STATUS_CODE;
    });

    if (!accidentalParticipant) {
      return of(participants);
    }

    return this.userManagementService
      .deleteUser(accidentalParticipant.guid)
      .pipe(
        take(1),
        map(() =>
          participants.filter(p => p.guid !== accidentalParticipant.guid)
        )
      );
  }
}
