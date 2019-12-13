import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivityQuestionBlock } from '../../models/activity/activityQuestionBlock';
import { WindowRef } from '../../services/windowRef';
import { AnswerValue } from '../../models/activity/answerValue';
import { BlockVisibility } from '../../models/activity/blockVisibility';
import { SubmissionManager } from '../../services/serviceAgents/submissionManager.service';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { filter, map, shareReplay, startWith, takeUntil, tap } from 'rxjs/operators';
import { BlockType } from '../../models/activity/blockType';
import { QuestionType } from '../../models/activity/questionType';

@Component({
  selector: 'ddp-activity-question',
  template: `
      <div class="ddp-activity-question" #scrollAnchor [ngClass]="getQuestionClass(block)">
          <ddp-activity-answer
                  [block]="block"
                  [readonly]="readonly"
                  [validationRequested]="validationRequested$ | async"
                  (valueChanged)="enteredValue$.next($event)">
          </ddp-activity-answer>
          <div class="ddp-activity-validation" *ngIf="errorMessage$ | async as errorMsg">
              <ddp-validation-message [message]="errorMsg">
              </ddp-validation-message>
          </div>
      </div>`
})
export class ActivityQuestionComponent implements OnInit, OnDestroy {
  @Input() block: ActivityQuestionBlock<any>;
  @Input() readonly: boolean;
  public enteredValue$ = new Subject<AnswerValue>();
  public validationRequested$ = new BehaviorSubject<boolean>(false);

  @Input() set validationRequested(requested: boolean) {
    this.validationRequested$.next(requested);
  }

  @Input() studyGuid: string;
  @Input() activityGuid: string;
  @Output() valueChanged: EventEmitter<AnswerValue> = new EventEmitter();
  @Output() visibilityChanged: EventEmitter<BlockVisibility[]> = new EventEmitter();
  public errorMessage$: Observable<string | string[] | null>;
  @ViewChild('scrollAnchor', { static: true }) scrollAnchor: ElementRef;
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private submissionManager: SubmissionManager,
    private windowRef: WindowRef) {
  }

  public ngOnInit(): void {
    this.setupErrorMessage();
    this.setupSavingData();
    this.setupScrollToErrorAction();
  }

  private setupErrorMessage(): void {
    const localValidatorMsg$: Observable<string | null> =
      combineLatest([this.enteredValue$.pipe(startWith(this.block.answer as AnswerValue)),
      this.validationRequested$]).pipe(
        // not displaying any local validations until a validation is requested
        filter(([_, validationRequested]) => !!validationRequested),
        map(() => {
          const firstFailedValidator = this.block.validators.find(validator => !validator.recalculate());
          return firstFailedValidator ? firstFailedValidator.result : null;
        }),
        startWith(null as string | null)
      );
    // merge these together and initialize with messages coming from the question definition
    this.errorMessage$ = combineLatest([
      this.block.serverValidationMessages$.pipe(startWith(this.block.serverValidationMessages)),
      localValidatorMsg$]
    ).pipe(
      map(([serverMsg, localMsg]) => {
        const msgs: string[] = [];
        serverMsg && msgs.push(...serverMsg);
        localMsg && msgs.push(localMsg);
        return msgs;
      }),
      shareReplay()
    );
  }

  public setupSavingData(): void {
    this.enteredValue$.pipe(
      filter(() => this.block.canPatch()),
      tap(value =>
        this.submissionManager.patchAnswer(this.studyGuid, this.activityGuid, this.block.stableId, value, this.block.id,
          this.block.answerId)
      ),
      tap(value => this.valueChanged.emit(value)),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();
  }

  private setupScrollToErrorAction(): void {
    this.validationRequested$.pipe(
      filter(validationRequested => validationRequested && this.block.scrollTo),
      tap(() => {
        const top = this.scrollAnchor.nativeElement.getBoundingClientRect().top + this.windowRef.nativeWindow.scrollY - 100;
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
    if (block.blockType !== BlockType.Question) {
      return '';
    }
    return 'Question--' + block.questionType;
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
