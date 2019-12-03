import { Input, OnDestroy, OnInit, Component, Output, EventEmitter } from '@angular/core';
import { AnswerValue } from './../../models/activity/answerValue';
import { ConditionalBlock } from '../../models/activity/conditionalBlock';
import { BlockVisibility } from '../../models/activity/blockVisibility';
import { SubmissionManager } from '../../services/serviceAgents/submissionManager.service';
import { CompositeDisposable } from '../../compositeDisposable';

@Component({
    selector: 'ddp-conditional-block',
    template: `
    <ddp-activity-question [block]="block.controlQuestion"
                            [readonly]="readonly"
                            [validationRequested]="validationRequested"
                            [studyGuid]="studyGuid"
                            [activityGuid]="activityGuid"
                            (valueChanged)="handleChange($event)"
                            (visibilityChanged)="updateVisibility($event)">
    </ddp-activity-question>
    <ddp-group-block [block]="block.nestedGroupBlock"
                        [readonly]="readonly"
                        [validationRequested]="validationRequested"
                        [studyGuid]="studyGuid"
                        [activityGuid]="activityGuid"
                        (valueChanged)="handleChange($event)">
    </ddp-group-block>`
})
export class ConditionalBlockComponent implements OnInit, OnDestroy {
    @Input() block: ConditionalBlock;
    @Input() readonly: boolean;
    @Input() validationRequested: boolean;
    @Input() studyGuid: string;
    @Input() activityGuid: string;
    @Output() valueChanged: EventEmitter<AnswerValue> = new EventEmitter();
    private anchor: CompositeDisposable;

    constructor(private submissionManager: SubmissionManager) { }

    public ngOnInit(): void {
        const sub = this.submissionManager.answerSubmissionResponse$.subscribe((response) => {
            this.updateVisibility(response.blockVisibility);
        });
        this.anchor = new CompositeDisposable(sub);
    }

    public ngOnDestroy(): void {
        this.anchor.removeAll();
    }

    public handleChange(value: AnswerValue): void {
        this.valueChanged.emit(value);
    }

    public updateVisibility(visibility: BlockVisibility[]): void {
        visibility.forEach(shownBlockStatus => {
            const matchingBlock = this.block.nestedGroupBlock
                .nestedBlocks.find(nestedBlock => nestedBlock.id === shownBlockStatus.blockGuid);
            if (matchingBlock) {
                matchingBlock.shown = shownBlockStatus.shown;
            }
        });
    }
}
