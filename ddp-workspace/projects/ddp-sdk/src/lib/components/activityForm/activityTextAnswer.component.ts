import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { ActivityTextQuestionBlock } from '../../models/activity/activityTextQuestionBlock';
import { InputType } from '../../models/activity/inputType';
import { TextSuggestion } from '../../models/activity/textSuggestion';

@Component({
    selector: 'ddp-activity-text-answer',
    template: `
    <ddp-question-prompt [block]="block"></ddp-question-prompt>
    <ng-container *ngIf="isTextInputType(block)">
        <ddp-activity-text-input
            [block]="block"
            [readonly]="readonly"
            [placeholder]="placeholder"
            (valueChanged)="onChange($event)"
        ></ddp-activity-text-input>
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
        <ddp-activity-email-input [block]="block"
                                  [readonly]="readonly"
                                  [placeholder]="placeholder"
                                  (valueChanged)="onChange($event)">
        </ddp-activity-email-input>
    </ng-container>
    `,
    styles: [
        `
            .example-input-field {
                width: 100%;
            }
        `
    ]
})
export class ActivityTextAnswer {
    @Input() block: ActivityTextQuestionBlock;
    @Input() placeholder: string;
    @Input() readonly: boolean;
    @Output() valueChanged: EventEmitter<string | null> = new EventEmitter();
    public inputSubject = new Subject<string>();
    public filteredSuggestions$: Observable<TextSuggestion[]>;

    public onChange(value: string): void {
        // turns out server will not accept null for text questions
        // send emit empty string for falsy values
        const answer = value ? value : '';
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
}
