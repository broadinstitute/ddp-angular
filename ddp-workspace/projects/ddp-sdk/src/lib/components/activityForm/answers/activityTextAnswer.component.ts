import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { ActivityTextQuestionBlock } from '../../../models/activity/activityTextQuestionBlock';
import { InputType } from '../../../models/activity/inputType';
import { LayoutType } from '../../../models/layout/layoutType';

@Component({
    selector: 'ddp-activity-text-answer',
    template: `
        <ddp-question-prompt [block]="block" *ngIf="!isGridLayout()"></ddp-question-prompt>
        <ng-container *ngIf="isTextInputType(block)">
            <ddp-activity-text-input
              [block]="block"
              [placeholder]="placeholder"
              [readonly]="readonly"
              (valueChanged)="onChange($event)"
            ></ddp-activity-text-input>
        </ng-container>
        <ng-container *ngIf="isEssayInputType(block)">
            <mat-form-field class="example-input-field ddp-textarea-block" [floatLabel]="block.label ? 'always' : null">
                <mat-label *ngIf="block.label" [innerHTML]="block.label"></mat-label>
                <textarea matInput matTextareaAutosize matAutosizeMinRows="3"
                          [(ngModel)]="block.answer"
                          [minlength]="block.minLength"
                          [maxlength]="block.maxLength"
                          [pattern]="block.regexPattern"
                          [placeholder]="placeholder || block.placeholder"
                          [disabled]="readonly"
                          [attr.data-ddp-test]="'answer:' + block.stableId"
                          (input)="inputSubject.next(textInput.value)"
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
    styles: [`
        .example-input-field {
          width: 100%;
        }
    `]
})
export class ActivityTextAnswer implements OnInit, OnDestroy {
    @Input() block: ActivityTextQuestionBlock;
    @Input() placeholder: string;
    @Input() readonly: boolean;
    @Input() layoutType: LayoutType = LayoutType.DEFAULT;
    @Output() valueChanged: EventEmitter<string | null> = new EventEmitter();
    public inputSubject = new Subject<string>();
    private subscription: Subscription;

    public ngOnInit(): void {
        this.initTextInputChangesEmitter();
    }

    public onChange(value: string): void {
        // turns out server will not accept null for text questions
        // send emit empty string for falsy values
        const answer = value || '';
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

    public isGridLayout(): boolean {
        return this.layoutType === LayoutType.GRID;
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private initTextInputChangesEmitter(): void {
        this.subscription = this.inputSubject.pipe(
            debounceTime(300),
            distinctUntilChanged()
            )
            .subscribe((value: string) => {
                this.valueChanged.emit(value);
            });
    }
}
