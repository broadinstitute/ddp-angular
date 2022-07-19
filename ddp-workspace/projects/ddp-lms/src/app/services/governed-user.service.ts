import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
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
        @Inject('ddp.config') private config: ConfigurationService
    ) {}

    get isGoverned(): boolean {
        return this.isGoverned$.getValue();
    }

    checkIfGoverned(): Observable<boolean> {
        return this.sessionService.sessionObservable.pipe(
            tap((d) => console.log('FIRST', d)),
            filter(
                (session) =>
                    !!session && this.sessionService.isAuthenticatedSession()
            ),
            take(1),
            tap((d) => console.log('SECOND', d)),
            mergeMap((d) => {
                console.log(this.config);
                return this.prequalService.getPrequalifier(
                    this.config.studyGuid
                );
            }),

            take(1),
            mergeMap((instanceGuid) =>
                this.activityService.getActivity(
                    of(this.config.studyGuid),
                    of(instanceGuid)
                )
            ),
            pluck('sections'),
            map((sections) => sections[0]),
            pluck('blocks'),
            map((blocks) =>
                blocks.find(
                    (block) =>
                        (block as ActivityPicklistQuestionBlock).stableId ===
                        this.SELF_DESCRIBE_STABLE_ID
                )
            ),
            pluck('answer'),
            map((answer) => answer[0]),
            pluck('stableId'),
            map((answerStableId) =>
                this.GOVERNED_USER_ANSWERS_STABLE_IDS.includes(answerStableId)
            ),
            map((isGoverned: boolean) => {
                this.isGoverned$.next(isGoverned);

                return isGoverned;
            })
        ) as Observable<boolean>;
    }
}
