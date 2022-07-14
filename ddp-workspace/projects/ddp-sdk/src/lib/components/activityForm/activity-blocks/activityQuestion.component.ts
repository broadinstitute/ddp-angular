import { Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import {
    debounceTime,
    delay,
    filter,
    map,
    shareReplay,
    startWith,
    takeUntil,
    tap,
} from 'rxjs/operators';

import { ActivityQuestionBlock } from '../../../models/activity/activityQuestionBlock';
import { WindowRef } from '../../../services/windowRef';
import { AnswerValue } from '../../../models/activity/answerValue';
import { SubmissionManager } from '../../../services/serviceAgents/submissionManager.service';
import { ConfigurationService } from '../../../services/configuration.service';
import { ActivityValidationResult } from '../../../models/activity/activityValidationResult';
import { LayoutType } from '../../../models/layout/layoutType';

@Component({
    selector: 'ddp-activity-question',
    template: `
        <div class="ddp-activity-question" #scrollAnchor [ngClass]="getQuestionClass(block)">
            <ddp-activity-answer
                [block]="block"
                [readonly]="isReadonly"
                [validationRequested]="validationRequested$ | async"
                [studyGuid]="studyGuid"
                [activityGuid]="activityGuid"
                [layoutType]="layoutType"
                (valueChanged)="enteredValue$.next($event)"
                (componentBusy)="componentBusy.next($event)">
            </ddp-activity-answer>
            <ng-container *ngIf="block.shown && block.enabled">
                <div class="ddp-activity-validation" *ngIf="errorMessage$ | async as errorMsg">
                    <ddp-validation-message [message]="errorMsg" [translationParams]="errorMessageTranslationParams$ | async">
                    </ddp-validation-message>
                </div>
            </ng-container>
        </div>`
})
export class ActivityQuestionComponent implements OnInit, OnDestroy {
    @Input() block: ActivityQuestionBlock<any>;
    @Input() readonly: boolean;
    @Input() layoutType: LayoutType = LayoutType.DEFAULT;
    public enteredValue$ = new Subject<AnswerValue>();
    public validationRequested$ = new BehaviorSubject<boolean>(false);

    @Input() set validationRequested(requested: boolean) {
        this.validationRequested$.next(requested);
    }

    @Input() studyGuid: string;
    @Input() activityGuid: string;
    @Output() valueChanged: EventEmitter<AnswerValue> = new EventEmitter();
    @Output() componentBusy = new EventEmitter<boolean>();
    public errorMessage$: Observable<string | string[] | null>;
    public errorMessageTranslationParams$: Observable<{[key: string]: string} | null>;
    @ViewChild('scrollAnchor', {static: true}) scrollAnchor: ElementRef;
    private ngUnsubscribe = new Subject<void>();

    static isActivityValidationResult(result: ActivityValidationResult | string | null): result is ActivityValidationResult {
        return !!(result && (result as ActivityValidationResult).message);
    }

    constructor(
        @Inject('ddp.config') public config: ConfigurationService,
        private submissionManager: SubmissionManager,
        private windowRef: WindowRef) {
    }

    get isReadonly(): boolean {
        return this.readonly || this.block.readonly;
    }

    public ngOnInit(): void {
        this.setupErrorMessage();
        this.setupSavingData();
        this.setupScrollToErrorAction();
    }

    private setupErrorMessage(): void {
        const firstFailedValidator$ =  combineLatest([
            this.enteredValue$.pipe(startWith(this.block.answer as AnswerValue)),
            this.validationRequested$
        ]).pipe(
            // not displaying any local validations until a validation is requested
            filter(([_, validationRequested]) => !!validationRequested),
            map(() => {
                const firstFailedValidator = this.block.validators.find(validator => !validator.recalculate());
                return firstFailedValidator ? firstFailedValidator.result : null;
            })
        );
        const localValidatorMsg$: Observable<string | null> =
            firstFailedValidator$.pipe(
                map((result) =>
                    ActivityQuestionComponent.isActivityValidationResult(result) ? result.message : result
                ),
                startWith(null as string | null)
            );

        this.errorMessageTranslationParams$ = firstFailedValidator$.pipe(
            map((result) =>
                ActivityQuestionComponent.isActivityValidationResult(result) ? result.params : null
            )
        );

        // merge these together and initialize with messages coming from the question definition
        this.errorMessage$ = combineLatest([
            this.block.serverValidationMessages$.pipe(startWith(this.block.serverValidationMessages)),
            localValidatorMsg$]
        ).pipe(
            // delay() needed to "prevent expression has changed after it was checked error"
            delay(0),
            map(([serverMsg, localMsg]) => {
                const msgs: string[] = [];
                serverMsg && msgs.push(...serverMsg);
                localMsg && msgs.push(localMsg);
                return msgs.length ? msgs : null;
            }),
            shareReplay()
        );
    }

    public setupSavingData(): void {
        this.enteredValue$.pipe(
            filter(() => this.block.canPatch()),
            tap(value =>
                this.submissionManager.patchAnswer(
                    this.studyGuid,
                    this.activityGuid,
                    this.block.stableId,
                    value,
                    this.block.id,
                    this.block.answerId
                )
            ),
            tap(value => this.valueChanged.emit(value)),
            takeUntil(this.ngUnsubscribe)
        ).subscribe();
    }

    private setupScrollToErrorAction(): void {
        this.validationRequested$.pipe(
            filter(validationRequested => validationRequested && this.block.scrollTo),
            debounceTime(300),
            tap(() => {
                const headerOffset = this.config.scrollToErrorOffset;
                const top = this.scrollAnchor.nativeElement.getBoundingClientRect().top
                    + this.windowRef.nativeWindow.scrollY - headerOffset;
                this.windowRef.nativeWindow.scrollTo({
                    top,
                    behavior: 'smooth'
                });
                this.block.scrollTo = false;
            }),
            takeUntil(this.ngUnsubscribe)
        ).subscribe();
    }

    public getQuestionClass(block: ActivityQuestionBlock<any>): string {
        return 'Question--' + block.questionType;
    }

    public ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
