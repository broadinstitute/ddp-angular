import {Inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {catchError, iif, Observable, of, tap, throwError} from 'rxjs';
import {filter, map, mergeMap, pluck, take} from 'rxjs/operators';

import {
  ActivityPicklistQuestionBlock,
  ActivityServiceAgent,
  ConfigurationService,
  SessionMementoService, UserActivityServiceAgent,
} from 'ddp-sdk';
import {PrequalifierService} from './prequalifier.service';

@Injectable()
export class GovernedUserService {

  private readonly WHO_ENROLLING = 'WHO_ENROLLING';
  private readonly PREQUAL = 'PREQUALIFIER';

  constructor(
    private router: Router,
    private sessionService: SessionMementoService,
    private prequalService: PrequalifierService,
    private activityService: ActivityServiceAgent,
    private userActivityServiceAgent: UserActivityServiceAgent,
    @Inject('ddp.config') private config: ConfigurationService
  ) {
  }

  public get checkIfGoverned(): Observable<[]> {
    return this.sessionService.sessionObservable.pipe(
      filter((session) => !!session && this.sessionService.isAuthenticatedSession()),
      mergeMap(() => this.userActivityServiceAgent.getActivities(of(this.config.studyGuid))
        .pipe(catchError(() => throwError(() => 'PREQUALIFIER_ERROR')))),
      mergeMap((userActivities) => iif(() =>
            !userActivities.length || !!userActivities.find(activity => activity.activityCode === this.PREQUAL),
          this.prequalService.getPrequalifier(this.config.studyGuid),
          throwError(() => 'PREQUALIFIER_ERROR')
        )
      ),
      mergeMap((instanceGuid) =>
        this.activityService.getActivity(of(this.config.studyGuid), of(instanceGuid.guid))),
      pluck('sections'),
      map((sections) => sections[0]),
      pluck('blocks'),
      map((blocks) => blocks.find((block) => (block as ActivityPicklistQuestionBlock).stableId === this.WHO_ENROLLING)),
      pluck('answer'),
      take(1),
      catchError(data => {
        console.error(data, '[ERROR]');
        return of(null);
      })
    ) as Observable<[]>;
  }
}
