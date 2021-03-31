import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map, mergeMap, pluck, take } from 'rxjs/operators';

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
  isGoverned$ = new BehaviorSubject<boolean | null>(null);

  private readonly SELF_DESCRIBE_STABLE_ID = 'PREQUAL_SELF_DESCRIBE';
  private readonly GOVERNED_USER_ANSWERS_STABLE_IDS = [
    'DIAGNOSED',
    'CHILD_DIAGNOSED',
  ];

  constructor(
    private sessionService: SessionMementoService,
    private prequalService: PrequalifierServiceAgent,
    private activityService: ActivityServiceAgent,
    @Inject('ddp.config') private config: ConfigurationService,
  ) {}

  get isGoverned(): boolean {
    return this.isGoverned$.getValue();
  }

  checkIfGoverned(): void {
    if (!this.sessionService.isAuthenticatedSession()) {
      return;
    }

    this.prequalService
      .getPrequalifier(this.config.studyGuid)
      .pipe(
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
          blocks.find(
            block =>
              (block as ActivityPicklistQuestionBlock).stableId ===
              this.SELF_DESCRIBE_STABLE_ID,
          ),
        ),
        pluck('answer'),
        map(answer => answer[0]),
        map(answer => answer.stableId),
        map<string, boolean>(answerStableId =>
          this.GOVERNED_USER_ANSWERS_STABLE_IDS.includes(answerStableId),
        ),
      )
      .subscribe((isGoverned: boolean) => {
        this.isGoverned$.next(isGoverned);
      });
  }
}
