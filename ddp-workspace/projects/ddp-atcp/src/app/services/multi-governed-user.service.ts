import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, filter, pluck, switchMap, take } from 'rxjs/operators';

import {
  ActivityPicklistQuestionBlock,
  ActivityServiceAgent,
  PrequalifierServiceAgent,
  ConfigurationService,
  SessionMementoService,
} from 'ddp-sdk';

@Injectable({
  providedIn: 'root',
})
export class MultiGovernedUserService {
  public readonly isMultiGoverned$ = new BehaviorSubject<boolean | null>(null);

  private readonly PREQUAL_SELF_DESCRIBE_STABLE_ID = 'PREQUAL_SELF_DESCRIBE';
  private readonly CHILD_DIAGNOSED_STABLE_ID = 'CHILD_DIAGNOSED';

  constructor(
    private prequalifierAgent: PrequalifierServiceAgent,
    private activityAgent: ActivityServiceAgent,
    private readonly session: SessionMementoService,
    @Inject('ddp.config') private readonly config: ConfigurationService
  ) {}

  public checkIfMultiGoverned(): void {
    this.session.sessionObservable
      .pipe(
        filter(
          profile => profile !== null && !this.session.isTemporarySession()
        ),
        take(1),
        switchMap(() =>
          this.prequalifierAgent.getPrequalifier(this.config.studyGuid)
        ),
        switchMap(instanceGuid =>
          this.activityAgent.getActivity(
            of(this.config.studyGuid),
            of(instanceGuid)
          )
        ),
        pluck('sections'),
        map(sections => {
          if (!sections.length) {
            return throwError("Prequalifier doesn't have any sections");
          }

          return sections[0];
        })
      )
      .subscribe(activitySection => {
        if (activitySection instanceof Observable) {
          return;
        }

        const selfDescribeBlock = activitySection.blocks.find(
          block =>
            block instanceof ActivityPicklistQuestionBlock &&
            block.stableId === this.PREQUAL_SELF_DESCRIBE_STABLE_ID
        );

        if (!selfDescribeBlock) {
          console.error(
            `Cannot find block with stable id of ${this.PREQUAL_SELF_DESCRIBE_STABLE_ID}`
          );
        }

        const answer = (selfDescribeBlock as ActivityPicklistQuestionBlock)
          .answer[0];

        if (answer && answer.stableId) {
          this.isMultiGoverned$.next(
            answer.stableId === this.CHILD_DIAGNOSED_STABLE_ID
          );
        }
      });
  }
}
