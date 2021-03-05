import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';

import { ActivityTextQuestionBlock } from '../../models/activity/activityTextQuestionBlock';
import { TextSuggestion } from '../../models/activity/textSuggestion';
import { TextSuggestionProvider } from '../../models/activity/textSuggestionProvider';

const MIN_INPUT_LENGTH_FOR_TYPEAHEAD = 3;

@Component({
  selector: 'ddp-activity-text-input',
  template: `
    <form [formGroup]="formGroup">
      <mat-form-field
        class="example-input-field"
        [floatLabel]="block.label ? 'always' : null"
      >
        <mat-label *ngIf="block.label" [innerHTML]="block.label"></mat-label>

        <input
          matInput
          type="text"
          [formControl]="formGroup.get(controlName)"
          [minlength]="block.minLength"
          [maxlength]="block.maxLength"
          [pattern]="block.regexPattern"
          [placeholder]="placeholder || block.placeholder"
          [attr.data-ddp-test]="'answer' + block.stableId"
          [matAutocomplete]="autoCompleteFromSource"
          (input)="onInput($event.target.value)"
        />

        <mat-autocomplete
          #autoCompleteFromSource="matAutocomplete"
          class="autoCompletePanel"
        >
          <mat-option
            *ngFor="let suggestion of filteredSuggestions$ | async"
            class="autoCompleteOption"
            [value]="suggestion.value"
          >
            <span
              class="suggestion"
              [innerHTML]="
                generateSuggestionOptionInnerHtml(
                  suggestion,
                  'span',
                  'suggestion-match'
                )
              "
            ></span>
          </mat-option>
        </mat-autocomplete>
      </mat-form-field>

      <ng-container *ngIf="block.confirmEntry">
        <p
          class="ddp-question-prompt ddp-question-prompt-confirmation"
          [class.ddp-required-question-prompt]="this.block.isRequired"
          [innerHTML]="block.confirmPrompt"
        ></p>

        <mat-form-field class="example-input-field-confirmation">
          <input
            matInput
            type="text"
            [formControl]="formGroup.get(confirmationControlName)"
            [placeholder]="placeholder || block.placeholder"
            [attr.data-ddp-test]="'answer' + block.stableId"
          />

          <mat-error
            *ngIf="shouldShowControlError(confirmationControlName, 'mustMatch') && block.mismatchMessage"
          >
            {{ block.mismatchMessage }}
          </mat-error>
        </mat-form-field>
      </ng-container>
    </form>
  `,
  styles: [
    `
      .example-input-field,
      .example-input-field-confirmation {
        width: 100%;
      }

      ::ng-deep .suggestion-match {
        text-decoration: underline;
      }
    `,
  ],
})
export class ActivityTextInput implements OnInit, OnChanges, OnDestroy {
  @Input() block: ActivityTextQuestionBlock;
  @Input() readonly: boolean;
  @Input() placeholder: string;
  @Output() valueChanged = new EventEmitter<string | null>();
  formGroup: FormGroup;
  filteredSuggestions$: Observable<TextSuggestion[]>;
  controlName: string;
  confirmationControlName: string;
  private subscription: Subscription;
  private input$ = new Subject<string>();

  ngOnInit(): void {
    this.initForm();
    this.initFilteredSuggestions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.block && !changes.block.isFirstChange()) {
      this.initFilteredSuggestions();
    }

    for (const propName of Object.keys(changes)) {
      if (propName === 'block' && !changes['block'].firstChange) {
        this.initForm();
      }

      if (propName === 'readonly' && !changes['readonly'].firstChange) {
        this.readonly
          ? this.formGroup.disable({ emitEvent: false })
          : this.formGroup.enable({ emitEvent: false });
      }
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onInput(enteredValue: string): void {
    this.input$.next(enteredValue);
  }

  generateSuggestionOptionInnerHtml(
    suggestion: TextSuggestion,
    tagName: string,
    styleClass?: string,
  ): string {
    const classString = styleClass ? ` class="${styleClass}"` : '';
    const openTag = `<${tagName}${classString}>`;
    const closeTag = `</${tagName}>`;

    let taggedValue = suggestion.value;
    let tagsAddedLength = 0;

    suggestion.matches
      .sort((a, b) => a.offset - b.offset)
      .forEach(match => {
        const adjustedOffset = tagsAddedLength + match.offset;

        taggedValue =
          taggedValue.substr(0, adjustedOffset) +
          openTag +
          taggedValue.substr(adjustedOffset, match.length) +
          closeTag +
          taggedValue.substr(adjustedOffset + match.length);

        tagsAddedLength = tagsAddedLength + openTag.length + closeTag.length;
      });

    return taggedValue;
  }

  shouldShowControlError(controlName: string, error: string): boolean {
    const control = this.formGroup.get(controlName);
    const showError =
      control.touched && control.errors && control.errors[error];

    return showError;
  }

  private initForm(): void {
    this.controlName = this.block.stableId;

    const formGroup = new FormGroup({
      [this.controlName]: new FormControl({
        value: this.block.answer,
        disabled: this.readonly,
      }),
    });

    if (this.block.confirmEntry) {
      this.confirmationControlName = `${this.block.stableId}_confirmation`;

      formGroup.addControl(
        this.confirmationControlName,
        new FormControl({
          value: this.block.answer,
          disabled: this.readonly,
        }),
      );

      formGroup.setValidators(
        this.fieldsMatcher(this.controlName, this.confirmationControlName),
      );

      if (this.block.answer !== null) {
        /**
         * If value is not null (i.e. this question was already answered before)
         * mark it as touched so that matching error appears right away.
         */
        formGroup.get(this.confirmationControlName).markAsTouched();
      }
    }

    this.formGroup = formGroup;

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.formGroup.valueChanges
      .pipe(
        filter(() => this.formGroup.valid),
        map(data => {
          return data[this.controlName] ? data[this.controlName].trim() : null;
        }),
        distinctUntilChanged(),
        debounceTime(300),
      )
      .subscribe(value => {
        this.block.setAnswer(value, true);
        this.valueChanged.emit(value);
      });
  }

  private initFilteredSuggestions(): void {
    if (!!this.block && this.block.textSuggestionSource) {
      const suggestionSource: TextSuggestionProvider = this.block
        .textSuggestionSource;

      this.filteredSuggestions$ = this.input$.pipe(
        debounceTime(200),
        switchMap(query => {
          if (query.length >= MIN_INPUT_LENGTH_FOR_TYPEAHEAD) {
            return suggestionSource(of(query));
          }

          return of([]);
        }),
      );
    } else {
      /**
       * Removing autocomplete with *ngIf is broken in current version of Angular Material.
       * Empty array produces desired effect.
       */
      this.filteredSuggestions$ = of([]);
    }
  }

  private fieldsMatcher(
    controlName: string,
    confirmationControlName: string,
  ): ValidatorFn {
    return formGroup => {
      const control = formGroup.get(controlName);
      const confirmationControl = formGroup.get(confirmationControlName);

      if (control.value !== confirmationControl.value) {
        confirmationControl.setErrors({ mustMatch: true });
      } else {
        confirmationControl.setErrors(null);
      }

      return confirmationControl.errors;
    };
  }
}
