import { Component, Input } from '@angular/core';
import { ActivityQuestionBlock } from '../../../../models/activity/activityQuestionBlock';






@Component({
    selector: 'ddp-question-prompt',
    template: `
    <div *ngIf="block.question">
        <p class="ddp-question-prompt"
           [ngClass]="{'ddp-required-question-prompt': displayAsRequired}">
           <span [innerHTML]="block.question"></span>
           <span *ngIf="block.additionalInfoHeader"
                 [innerHTML]="block.additionalInfoHeader"
                 class="ddp-question-prompt__info-header">
           </span>
           <ddp-tooltip *ngIf="block.tooltip" class="tooltip" [text]="block.tooltip" [icon]="icon"></ddp-tooltip>
        </p>
    </div>`,
    styleUrls: ['questionPrompt.component.scss']
})
export class QuestionPromptComponent {
    /**
     * Content is expected to be an HTML fragment
     */
    @Input() block: ActivityQuestionBlock<any>;

    readonly icon: string = "../../../../../assets/info-circle.svg";

    public get displayAsRequired(): boolean {
        return this.block?.isRequired && this.block?.question && (this.block.question.trim().length > 0);
    }
}
