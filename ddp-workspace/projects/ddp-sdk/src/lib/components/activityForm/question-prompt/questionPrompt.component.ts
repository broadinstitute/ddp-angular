import {Component, Input} from '@angular/core';
import {ActivityQuestionBlock} from '../../../models/activity/activityQuestionBlock';

@Component({
    selector: 'ddp-question-prompt',
    template: `
    <div *ngIf="block.question">
        <p class="ddp-question-prompt"
           [ngClass]="{'ddp-required-question-prompt': displayAsRequired}">
           <span [innerHTML]="block.question"></span>
           <ddp-tooltip *ngIf="block.tooltip" class="tooltip" [text]="block.tooltip"></ddp-tooltip>
        </p>
    </div>`
})
export class QuestionPromptComponent {
    /**
     * Content is expected to be an HTML fragment
     */
    @Input() block: ActivityQuestionBlock<any>;

    public get displayAsRequired(): boolean {
        return !!(this.block) && this.block.isRequired && !!(this.block.question) && (this.block.question.trim().length > 0);
    }
}
