import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';

import {
  ActivityServiceAgent,
  ConfigurationService,
  SessionMementoService,
} from 'ddp-sdk';

@Injectable()
export class MultiGovernedUserService {
  public readonly isMultiGoverned$ = new BehaviorSubject<boolean | null>(null);

  private readonly PREQUAL_SELF_DESCRIBE_STABLE_ID = 'PREQUAL_SELF_DESCRIBE';
  private readonly CHILD_DIAGNOSED_STABLE_ID = 'CHILD_DIAGNOSED';

  constructor(
    private readonly activityAgent: ActivityServiceAgent,
    private readonly session: SessionMementoService,
    @Inject('ddp.config') private readonly config: ConfigurationService
  ) {
    this.checkIfMultiGoverned();
  }

  private checkIfMultiGoverned(): void {
    this.session.sessionObservable
      .pipe(
        filter(profile => (profile !== null && !this.session.isTemporarySession())),
        take(1),
        switchMap(() =>
          this.activityAgent.getAnswerByQuestionStableId(
            this.config.studyGuid,
            this.PREQUAL_SELF_DESCRIBE_STABLE_ID
          )
        )
      )
      .subscribe(response => {
        if (!response) {
          console.error(
            'Cannot determine type of user, the response is',
            response
          );

          return;
        }

        if (response.value instanceof Array && response.value[0].stableId) {
          const stableId = response.value[0].stableId;

          if (stableId === this.CHILD_DIAGNOSED_STABLE_ID) {
            this.isMultiGoverned$.next(true);
          } else {
            this.isMultiGoverned$.next(false);
          }
        }
      });
  }
}
