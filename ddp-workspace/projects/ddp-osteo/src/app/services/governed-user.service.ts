import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, iif, Observable, of, throwError } from 'rxjs';
import { filter, map, mergeMap, pluck, take, tap } from 'rxjs/operators';

import {
    ActivityPicklistQuestionBlock,
    ActivityServiceAgent,
    ConfigurationService,
    SessionMementoService,
} from 'ddp-sdk';
import { PrequalifierService } from './prequalifier.service';

@Injectable()
export class GovernedUserService {

  private readonly PREQUAL_SELF_DESCRIBE = 'PREQUAL_SELF_DESCRIBE';

    constructor(
        private router: Router,
        private sessionService: SessionMementoService,
        private prequalService: PrequalifierService,
        private activityService: ActivityServiceAgent,
        @Inject('ddp.config') private config: ConfigurationService
    ) {}

    public get checkIfGoverned(): Observable<[]> {
        return this.sessionService.sessionObservable.pipe(
            filter(
                (session) =>
                    !!session && this.sessionService.isAuthenticatedSession()
            ),
            mergeMap(() =>
                this.prequalService.getPrequalifier(this.config.studyGuid).pipe(
                    mergeMap((instanceGuid) =>
                        iif(
                            () => instanceGuid,
                            this.activityService.getActivity(
                                of(this.config.studyGuid),
                                of(instanceGuid?.guid)
                            ),
                            throwError(() => null)
                        )
                    )
                )
            ),
            tap(d => console.log('[MY TAP]', d)),
            pluck('sections'),
            map((sections) => sections[0]),
            pluck('blocks'),
            map((blocks) =>
                blocks.find(
                    (block) =>
                        (block as ActivityPicklistQuestionBlock).stableId ===
                        this.PREQUAL_SELF_DESCRIBE
                )
            ),
            pluck('answer'),
            take(1),
            catchError((errorMessage) => of(errorMessage))
        ) as Observable<[]>;
    }
}
