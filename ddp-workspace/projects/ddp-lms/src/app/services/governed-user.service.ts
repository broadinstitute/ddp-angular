import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { filter, map, mergeMap, pluck, take } from 'rxjs/operators';

import {
  ActivityPicklistQuestionBlock,
  ActivityServiceAgent,
  ConfigurationService,
  PrequalifierServiceAgent,
  SessionMementoService,
} from 'ddp-sdk';

@Injectable({
  providedIn: 'root',
})
export class GovernedUserService {
  isGoverned$ = new Subject<boolean>();

  private readonly SELF_DESCRIBE_STABLE_ID = 'WHO_ENROLLING';
  private readonly GOVERNED_USER_ANSWERS_STABLE_ID = 'CHILD_DIAGNOSED';

  constructor(
    private router: Router,
    private sessionService: SessionMementoService,
    private prequalService: PrequalifierServiceAgent,
    private activityService: ActivityServiceAgent,
    @Inject('ddp.config') private config: ConfigurationService
  ) {}

  get isGoverned(): Observable<boolean> {
    return this.isGoverned$;
  }

  checkIfGoverned(): Observable<boolean> {
    return this.sessionService.sessionObservable.pipe(
      filter((session) => !!session && this.sessionService.isAuthenticatedSession()),
      take(1),
      mergeMap((d) => this.prequalService.getPrequalifier(this.config.studyGuid)),
      take(1),
      mergeMap((instanceGuid) => this.activityService.getActivity(of(this.config.studyGuid), of(instanceGuid))),
      pluck('sections'),
      map((sections) => sections[0]),
      pluck('blocks'),
      map((blocks) =>
        blocks.find((block) => (block as ActivityPicklistQuestionBlock).stableId === this.SELF_DESCRIBE_STABLE_ID)
      ),
      pluck('answer'),
      map((answers) => answers.find(({ stableId }) => stableId === this.GOVERNED_USER_ANSWERS_STABLE_ID)),
      map((isGoverned: boolean) => {
        console.log('[isGOVERNED]', isGoverned);
        this.isGoverned$.next(isGoverned);
        return isGoverned;
      })
    ) as Observable<boolean>;
  }
}
