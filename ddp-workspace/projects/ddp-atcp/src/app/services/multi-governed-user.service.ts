import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, filter, pluck, switchMap, take } from 'rxjs/operators';

import {
  ActivityPicklistQuestionBlock,
  ActivityServiceAgent,
  PrequalifierServiceAgent,
  ConfigurationService,
  SessionMementoService,
  LoggingService,
} from 'ddp-sdk';

import * as RouterResources from '../router-resources';

@Injectable({
  providedIn: 'root',
})
export class MultiGovernedUserService {
  public readonly isMultiGoverned$ = new BehaviorSubject<boolean | null>(null);

  private readonly PREQUAL_SELF_DESCRIBE_STABLE_ID = 'PREQUAL_SELF_DESCRIBE';
  private readonly CHILD_DIAGNOSED_STABLE_ID = 'CHILD_DIAGNOSED';
  private readonly LOG_SOURCE = 'MultiGovernedUserService';

  constructor(
    private router: Router,
    private prequalifierAgent: PrequalifierServiceAgent,
    private activityAgent: ActivityServiceAgent,
    private session: SessionMementoService,
    private loggingService: LoggingService,
    @Inject('ddp.config') private readonly config: ConfigurationService,
  ) {}

  public checkIfMultiGoverned(): void {
    this.session.sessionObservable
      .pipe(
        filter(
          profile => profile !== null && this.session.isAuthenticatedSession(),
        ),
        take(1),
        switchMap(() =>
          this.prequalifierAgent.getPrequalifier(this.config.studyGuid),
        ),
        switchMap(instanceGuid =>
          this.activityAgent.getActivity(
            of(this.config.studyGuid),
            of(instanceGuid),
          ),
        ),
        take(1),
        pluck('sections'),
        map(sections => {
          if (!sections.length) {
            throw new Error(`Prequalifier doesn't have any sections`);
          }

          return sections[0];
        }),
      )
      .subscribe(activitySection => {
        if (activitySection instanceof Observable) {
          return;
        }

        const selfDescribeBlock = activitySection.blocks.find(
          block =>
            block instanceof ActivityPicklistQuestionBlock &&
            block.stableId === this.PREQUAL_SELF_DESCRIBE_STABLE_ID,
        );

        if (!selfDescribeBlock) {
          this.loggingService.logError(
            this.LOG_SOURCE,
            `Cannot find block with stable id of ${this.PREQUAL_SELF_DESCRIBE_STABLE_ID}`,
          );
        }

        const answer = (selfDescribeBlock as ActivityPicklistQuestionBlock)
          .answer[0];

        if (answer && answer.stableId) {
          this.isMultiGoverned$.next(
            answer.stableId === this.CHILD_DIAGNOSED_STABLE_ID,
          );
        }
      });
  }

  public navigateToDashboard(): void {
    const isMultiGoverned = this.isMultiGoverned$.getValue();

    if (isMultiGoverned === null) {
      this.loggingService.logEvent(
        this.LOG_SOURCE,
        'Cannot determine type of user, redirecting to home page',
      );

      this.router.navigateByUrl(RouterResources.Welcome);
    } else {
      this.router.navigateByUrl(
        isMultiGoverned
          ? RouterResources.ParticipantList
          : RouterResources.Dashboard,
      );
    }
  }
}
