import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange } from '@angular/core';
import { ActivityTextQuestionBlock } from '../../models/activity/activityTextQuestionBlock';
import { InputType } from '../../models/activity/inputType';
import { TextSuggestion } from '../../models/activity/textSuggestion';
import { SuggestionMatch } from '../../models/suggestionMatch';
import { TextSuggestionProvider } from '../../models/activity/textSuggestionProvider';
import { Observable, Subject, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

const MIN_INPUT_LENGTH_FOR_TYPEAHEAD = 3;

@Component({
    selector: 'ddp-activity-text-answer',
    template: `
    <ddp-question-prompt [block]="block"></ddp-question-prompt>
    <ng-container *ngIf="isTextInputType(block)">
        <mat-form-field  class="example-input-field" [floatLabel]="block.label ? 'always' : null">
            <mat-label *ngIf="block.label" [innerHTML]="block.label"></mat-label>
            <input matInput [(ngModel)]="block.answer"
                [minlength]="block.minLength"
                [maxlength]="block.maxLength"
                [pattern]="block.regexPattern"
                [placeholder]="placeholder || block.placeholder"
                [disabled]="readonly"
                [attr.data-ddp-test]="'answer:' + block.stableId"
                (input)="inputSubject.next(textInput.value)"
                (change)="onChange(textInput.value)"
                [matAutocomplete]="autoCompleteFromSource"
                #textInput="ngModel">
            <mat-autocomplete #autoCompleteFromSource="matAutocomplete"
                (optionSelected)="onChange(textInput.value)" class="autoCompletePanel">
                    <mat-option *ngFor="let suggestion of filteredSuggestions$ | async"
                        [value]="suggestion.value" class="autoCompleteOption">
                        <span class="suggestion" [innerHTML]="generateOptionInnerHtml(suggestion,'span', 'suggestion-match')"></span>
                    </mat-option>
            </mat-autocomplete>
        </mat-form-field>
    </ng-container>
    <ng-container *ngIf="isEssayInputType(block)">
        <mat-form-field  class="example-input-field ddp-textarea-block" [floatLabel]="block.label ? 'always' : null">
          <mat-label *ngIf="block.label" [innerHTML]="block.label"></mat-label>
          <textarea matInput matTextareaAutosize matAutosizeMinRows="3"
                    [(ngModel)]="block.answer"
                    [minlength]="block.minLength"
                    [maxlength]="block.maxLength"
                    [pattern]="block.regexPattern"
                    [placeholder]="placeholder || block.placeholder"
                    [disabled]="readonly"
                    [attr.data-ddp-test]="'answer:' + block.stableId"
                    (change)="onChange(textInput.value)"
                    #textInput="ngModel"
                    class="ddp-textarea">
            </textarea>
        </mat-form-field>
    </ng-container>
    <ng-container *ngIf="isEmailInputType(block)">
        <ddp-activity-email-input></ddp-activity-email-input>
    </ng-container>
    `,
    styles: [
        `.example-input-field {
            width: 100%;
        }
        ::ng-deep .suggestion-match {
            text-decoration: underline;
        }`
    ]
})
export class ActivityTextAnswer implements OnChanges, OnInit {
    @Input() block: ActivityTextQuestionBlock;
    @Input() placeholder: string;
    @Input() readonly: boolean;
    @Output() valueChanged: EventEmitter<string | null> = new EventEmitter();
    public inputSubject = new Subject<string>();
    public filteredSuggestions$: Observable<TextSuggestion[]>;

    public ngOnInit(): void {
        this.initFilteredSuggestions();
    }

    public ngOnChanges(changes: { [propKey: string]: SimpleChange }): void {
        // want to be able to update from here for benefit of sandbox "update"
        if (changes.block && !changes.block.isFirstChange()) {
            this.initFilteredSuggestions();
        }
    }

    public onChange(value: string): void {
        const answer = value ? value : null;
        this.valueChanged.emit(answer);
    }

    public isTextInputType(block: ActivityTextQuestionBlock): boolean {
        return block.inputType === InputType.Text || block.inputType === InputType.Signature;
    }

    public isEssayInputType(block: ActivityTextQuestionBlock): boolean {
        return block.inputType === InputType.Essay;
    }

    public isEmailInputType(block: ActivityTextQuestionBlock): boolean {
        return block.inputType === InputType.Email;
    }

    // Turn the text suggestion into html snippet where text match surrounded by tag
    // no need to convert special characters like < or &. DOM does that for us
    public generateOptionInnerHtml(suggestion: TextSuggestion, tagName: string, styleClass?: string): string {
        let taggedValue = suggestion.value;
        const classString = styleClass ? ` class="${styleClass}"` : '';
        const openTag = `<${tagName}${classString}>`;
        const closeTag = `</${tagName}>`;
        let tagsAddedLength = 0;
        suggestion.matches.sort((a, b) => a.offset - b.offset)
            .forEach((match: SuggestionMatch) => {
                const adjustedOffset = tagsAddedLength + match.offset;
                taggedValue = taggedValue.substr(0, adjustedOffset)
                    + openTag + taggedValue.substr(adjustedOffset, match.length) + closeTag
                    + taggedValue.substr(adjustedOffset + match.length);
                tagsAddedLength = tagsAddedLength + openTag.length + closeTag.length;
            });
        return taggedValue;
    }

    private initFilteredSuggestions(): void {
        if (!!this.block && this.block.textSuggestionSource) {
            const suggestionSource: TextSuggestionProvider = this.block.textSuggestionSource;
            this.filteredSuggestions$ = this.inputSubject.pipe(
                debounceTime(200),
                switchMap((queryVal) => {
                    if (queryVal.length >= MIN_INPUT_LENGTH_FOR_TYPEAHEAD) {
                        return suggestionSource(of(queryVal));
                    } else {
                        return of([]);
                    }
                })
            );
        } else {
            // removing autocomplete with *ngIf is broken in current version of Material
            // empty array produces desired effect
            this.filteredSuggestions$ = of([]);
        }
    }
}
