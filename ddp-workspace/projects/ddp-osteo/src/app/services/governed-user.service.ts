import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, map, mergeMap, pluck, take, tap } from 'rxjs/operators';

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

  private readonly WHO_ENROLLING = 'WHO_ENROLLING';

  constructor(
    private router: Router,
    private sessionService: SessionMementoService,
    private prequalService: PrequalifierServiceAgent,
    private activityService: ActivityServiceAgent,
    @Inject('ddp.config') private config: ConfigurationService
  ) {}

  public get checkIfGoverned(): Observable<[]> {
    return this.sessionService.sessionObservable.pipe(
        tap((data) => {
            console.log(data);
        }),
        filter(
            (session) =>
                !!session && this.sessionService.isAuthenticatedSession()
        ),
        mergeMap(() =>
            this.prequalService.getPrequalifier(this.config.studyGuid)
        ),
        mergeMap((instanceGuid) =>
            this.activityService.getActivity(
                of(this.config.studyGuid),
                of(instanceGuid)
            )
        ),
        pluck("sections"),
        map((sections) => sections[0]),
        pluck("blocks"),
        map((blocks) =>
            blocks.find(
                (block) =>
                    (block as ActivityPicklistQuestionBlock).stableId ===
                    this.WHO_ENROLLING
            )
        ),
        pluck("answer"),
        take(1)
    ) as Observable<[]>;
  }
}
