import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import * as _ from 'underscore';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { ActivityEmailQuestionBlock } from '../../models/activity/activityEmailQuestionBlock';
import { distinctUntilChanged, map, skip, startWith, tap } from 'rxjs/operators';
import { NGXTranslateService } from 'ddp-sdk';

@Component({
  selector: 'ddp-activity-email-answer',
  template: `
      <ddp-question-prompt [block]="block"></ddp-question-prompt>
      <mat-form-field class="example-input-field" [floatLabel]="block.label ? 'always' : null">
          <mat-label *ngIf="block.label" [innerHTML]="block.label"></mat-label>
          <input matInput
                 type="email"
                 [formControl]="formControls[0]"
                 [minlength]="block.minLength"
                 [maxlength]="block.maxLength"
                 [placeholder]="placeholder || block.placeholder"
                 [attr.data-ddp-test]="'answer:' + block.stableId">
      </mat-form-field>
      <mat-form-field class="example-input-field">
          <input matInput
                 type="email"
                 [formControl]="formControls[1]"
                 [minlength]="block.minLength"
                 [maxlength]="block.maxLength"
                 [placeholder]="confirmationPlaceholder | async"
                 [attr.data-ddp-test]="'answer:' + block.stableId">
      </mat-form-field>
  `,
  styles: []
})
export class ActivityEmailAnswerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() block: ActivityEmailQuestionBlock;
  @Input() placeholder: string;
  @Input() readonly: boolean;
  @Output() valueChanged: EventEmitter<string | null> = new EventEmitter();
  public formControls: FormControl[];
  public confirmationPlaceholder: Observable<string | null>;
  private subscription: Subscription;

  constructor(private translate: NGXTranslateService) {
  }

  ngOnInit(): void {
    this.initFormControls();
    this.initPlaceholders();
  }

  private initFormControls() {
    this.formControls = [0, 1].map(_ => new FormControl({
      value: this.block.answer,
      disabled: this.readonly
    }, [Validators.email]));
    this.subscription = combineLatest(
      // need to emit some initial values; nothing emitted until all observable in combineLatest emit something
      this.formControls.map(ctrl => ctrl.valueChanges.pipe(startWith(ctrl.value as string)))).pipe(
      tap(([email, confirmVal]) => console.debug('email: %o, confirmVal: %o', email, confirmVal)),
      map((vals) => {
        return vals.map(val => val ? val.trim() : null);
      }),
      tap(([email, confirmVal]) => {
        this.block.email = email;
        this.block.emailConfirmation = confirmVal;
      }),
      // the first time through is just initial setup
      skip(1),
      map(([email, _]) => (this.block.validate() && !!email) ? email : null),
      distinctUntilChanged(),
      tap((val) => this.valueChanged.emit(val))
    ).subscribe();
  }

  private initPlaceholders() {
    const emailPlaceholder = this.emailPlaceHolder();
    if (emailPlaceholder) {
      this.confirmationPlaceholder = this.translate.getTranslation('SDK.EmailEntry.ConfirmationEmailPlaceholder',
        { value: emailPlaceholder }) as Observable<string>;
    } else {
      this.confirmationPlaceholder = of(null);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['block'] && !changes['block'].isFirstChange()) {
      this.formControls.forEach(control => control.patchValue(this.block.answer, { onlySelf: true, emitEvent: false }));
    }
    if (!_.isUndefined(changes['readonly']) && !changes['readonly'].isFirstChange()) {
      this.formControls.forEach(control =>
        this.readonly ?
          control.disable({ onlySelf: true, emitEvent: false }) :
          control.enable({ onlySelf: true, emitEvent: false }));
    }
  }

  public emailPlaceHolder(): string | null {
    return this.placeholder ? this.placeholder : this.block.placeholder;
  }

  ngOnDestroy(): void {
    this.subscription && this.subscription.unsubscribe();
  }

}
