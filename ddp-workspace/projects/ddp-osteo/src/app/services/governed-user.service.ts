import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, map, mergeMap, pluck, take } from 'rxjs/operators';

import {
  ActivityPicklistQuestionBlock,
  ActivityServiceAgent,
  ConfigurationService,
  PrequalifierServiceAgent,
  SessionMementoService,
} from 'ddp-sdk';

import { RoutePaths } from './router-resources';

@Injectable({
  providedIn: 'root',
})
export class GovernedUserService {
  isGoverned$ = new BehaviorSubject<boolean | null>(null);

  private readonly SELF_DESCRIBE_STABLE_ID = 'PREQUAL_SELF_DESCRIBE';
  private readonly GOVERNED_USER_ANSWERS_STABLE_IDS = [
    'DIAGNOSED',
    'CHILD_DIAGNOSED',
  ];

  constructor(
    private router: Router,
    private sessionService: SessionMementoService,
    private prequalService: PrequalifierServiceAgent,
    private activityService: ActivityServiceAgent,
    @Inject('ddp.config') private config: ConfigurationService,
  ) {}

  get isGoverned(): boolean {
    return this.isGoverned$.getValue();
  }

  checkIfGoverned(): Observable<boolean> {
    return this.sessionService.sessionObservable.pipe(
      filter(
        session => !!session && this.sessionService.isAuthenticatedSession(),
      ),
      take(1),
      mergeMap(() =>
        this.prequalService.getPrequalifier(this.config.studyGuid),
      ),
      take(1),
      mergeMap(instanceGuid =>
        this.activityService.getActivity(
          of(this.config.studyGuid),
          of(instanceGuid),
        ),
      ),
      pluck('sections'),
      map(sections => sections[0]),
      pluck('blocks'),
      map(blocks =>
        {
          console.log(blocks, "block logs");
          return         blocks.find(
            block =>
              (block as ActivityPicklistQuestionBlock).stableId ===
              this.SELF_DESCRIBE_STABLE_ID,
          );
        }
      ),
      pluck('answer'),
      map(answer => answer[0]),
      pluck('stableId'),
      map(answerStableId =>
        this.GOVERNED_USER_ANSWERS_STABLE_IDS.includes(answerStableId),
      ),
      map((isGoverned: boolean) => {
        this.isGoverned$.next(isGoverned);

        return isGoverned;
      }),
    ) as Observable<boolean>;
  }

  redirectToDashboard(): void {
    this.isGoverned$
      .pipe(
        mergeMap(isGoverned => {
          if (isGoverned === null) {
            return this.checkIfGoverned();
          }

          return of(isGoverned);
        }),
        map(isGoverned =>
          isGoverned ? RoutePaths.ParticipantsList : RoutePaths.Dashboard,
        ),
      )
      .subscribe(path => {
        this.router.navigateByUrl(path);
      });
  }
}
