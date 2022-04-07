import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';

import { ActivityTextQuestionBlock } from '../../../../models/activity/activityTextQuestionBlock';
import { TextSuggestion } from '../../../../models/activity/textSuggestion';
import { ConfigurationService } from '../../../../services/configuration.service';

@Component({
  selector: 'ddp-activity-text-input',
  templateUrl: './activityTextInput.component.html',
  styleUrls: ['./activityTextInput.component.scss'],
})
export class ActivityTextInput implements OnInit, OnChanges, OnDestroy {
  @Input() block: ActivityTextQuestionBlock;
  @Input() placeholder: string;
  @Input() readonly: boolean;
  @Output() valueChanged = new EventEmitter<string | null>();
  formGroup: FormGroup;
  controlName: string;
  confirmationControlName: string;
  filteredSuggestions$: Observable<TextSuggestion[]>;
  private sub: Subscription;
  private input$ = new Subject<string>();
  private readonly confirmationControlNamePrefix = 'confirmation_';
  private readonly typeAheadMinInputLength = 3;

  constructor(@Inject('ddp.config') private configuration: ConfigurationService) {
  }

  ngOnInit(): void {
    this.buildForm();
    this.initFilteredSuggestions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.block && !changes.block.isFirstChange()) {
      this.initFilteredSuggestions();
    }

    for (const propName of Object.keys(changes)) {
      if (propName === 'block' && !changes['block'].firstChange) {
        this.buildForm();
      }

      if (propName === 'readonly' && !changes.readonly.firstChange) {
        this.readonly
          ? this.formGroup.disable({ emitEvent: false })
          : this.formGroup.enable({ emitEvent: false });
      }
    }
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  get formClass(): string {
    return `activity-text-input-${this.block.stableId}`;
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
          taggedValue.substring(0, adjustedOffset) +
          openTag +
          taggedValue.substring(adjustedOffset, adjustedOffset + match.length) +
          closeTag +
          taggedValue.substring(adjustedOffset + match.length);

        tagsAddedLength = tagsAddedLength + openTag.length + closeTag.length;
      });

    return taggedValue;
  }

  onEnter(event: Event): void {
    event.preventDefault();
    this.configuration.moveToNextFieldWhileInTextInput && this.prepareElementsToMove(event);
  }

  private prepareElementsToMove(event: Event): void {
      const elementsArray: Element[] = Array.from(document.querySelectorAll(['input', 'mat-select', 'select', 'textarea'].join(',')))
          .filter(input => input.id && (input as HTMLElement)?.style.display !== 'none');
      const elementsObjects: Map<Element, number> = new Map(elementsArray.map((input, i) => [input, i]));
      const pressedElement = event.target as Element;
      this.moveToTheNextField(elementsArray, elementsObjects.get(pressedElement));
  }

  private moveToTheNextField(elements: Element[], elementIndex: number): void {
      const nextElement = elementIndex >= 0 && elements[elementIndex + 1];
      nextElement && (nextElement as HTMLElement).focus();
  }

  private buildForm(): void {
    this.controlName = this.block.stableId;

    const formGroup = new FormGroup(
      {
        [this.controlName]: new FormControl({
          value: this.block.answer,
          disabled: this.readonly,
        }),
      },
      {
        updateOn: this.block.hasUniqueValueValidator ? 'blur' : 'change'
      }
    );

    if (this.block.confirmEntry) {
      this.confirmationControlName = `${this.confirmationControlNamePrefix}${this.block.stableId}`;

      formGroup.addControl(
        this.confirmationControlName,
        new FormControl({
          value: this.block.answer,
          disabled: this.readonly,
        }),
      );
    }

    this.formGroup = formGroup;

    if (this.sub) {
      this.sub.unsubscribe();
    }

    this.sub = this.formGroup.valueChanges
      .pipe(
        debounceTime(300),
        map(values => ({
          [this.controlName]: values[this.controlName]
            ? values[this.controlName].trim()
            : null,
          [this.confirmationControlName]: values[this.confirmationControlName]
            ? values[this.confirmationControlName].trim()
            : null,
        })),
      )
      .subscribe(values => {
        this.block.setAnswer(values[this.controlName]);
        this.block.setConfirmationAnswer(values[this.confirmationControlName]);

        this.valueChanged.emit(values[this.controlName]);
      });
  }

  private initFilteredSuggestions(): void {
    if (!!this.block && this.block.textSuggestionSource) {
      const suggestionSource = this.block.textSuggestionSource;

      this.filteredSuggestions$ = this.input$.pipe(
        debounceTime(200),
        switchMap(query => {
          if (query.length >= this.typeAheadMinInputLength) {
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
}
