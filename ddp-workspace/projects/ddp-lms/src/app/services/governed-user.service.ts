import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, iif, Observable, of, tap, throwError } from 'rxjs';
import { filter, map, mergeMap, pluck, take } from 'rxjs/operators';

import {
  ActivityPicklistQuestionBlock,
  ActivityServiceAgent,
  ConfigurationService,
  SessionMementoService,
  UserActivityServiceAgent,
} from 'ddp-sdk';
import { PrequalifierService } from './prequalifier.service';

@Injectable()
export class GovernedUserService {
  private readonly WHO_ENROLLING = 'WHO_ENROLLING';

  constructor(
    private router: Router,
    private sessionService: SessionMementoService,
    private prequalService: PrequalifierService,
    private activityService: ActivityServiceAgent,
    private userActivityServiceAgent: UserActivityServiceAgent,
    @Inject('ddp.config') private config: ConfigurationService
  ) {}

  public get checkIfGoverned(): Observable<[]> {
    return this.sessionService.sessionObservable.pipe(
      filter((session) => !!session && this.sessionService.isAuthenticatedSession()),
      mergeMap(() =>
        this.prequalService.getPrequalifier(this.config.studyGuid).pipe(
          mergeMap((instanceGuid) =>
            iif(
              () => instanceGuid,
              this.activityService.getActivity(of(this.config.studyGuid), of(instanceGuid?.guid)),
              throwError(() => null)
            )
          )
        )
      ),
      pluck('sections'),
      map((sections) => sections[0]),
      pluck('blocks'),
      map((blocks) => blocks.find((block) => (block as ActivityPicklistQuestionBlock).stableId === this.WHO_ENROLLING)),
      pluck('answer'),
      take(1),
      catchError((errorMessage) => of(errorMessage))
    ) as Observable<[]>;
  }
}
