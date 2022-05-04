import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import { Subscription } from 'rxjs';

import { ActivitySection } from '../../models/activity/activitySection';
import { ActivityBlock } from '../../models/activity/activityBlock';
import { BlockType } from '../../models/activity/blockType';
import { BlockVisibility } from '../../models/activity/blockVisibility';
import { ConfigurationService } from '../../services/configuration.service';
import { ActivityActivityBlock } from '../../models/activity/activityActivityBlock';
import { SubmissionManager } from '../../services/serviceAgents/submissionManager.service';
import { ActivityInstance } from '../../models/activityInstance';
import { AnswerResponseEquation } from '../../models/activity/answerResponseEquation';
import { ActivityEquationQuestionBlock } from '../../models/activity/activityEquationQuestionBlock';
import { ActivityCompositeQuestionBlock, AnswerContainer } from '../../models/activity/activityCompositeQuestionBlock';
import { ActivityQuestionBlock } from '../../models/activity/activityQuestionBlock';

@Component({
    selector: 'ddp-activity-section',
    templateUrl: './activitySection.component.html'
})
export class ActivitySectionComponent implements OnInit, OnDestroy {
    @Input() public section: ActivitySection;
    @Input() public readonly: boolean;
    @Input() public validationRequested = false;
    @Input() public studyGuid: string;
    @Input() public activityGuid: string;
    @Output() embeddedComponentsValidationStatus: EventEmitter<boolean> = new EventEmitter();
    @Output() componentBusy: EventEmitter<boolean> = new EventEmitter(true);

    // triggerChanges is a flag to pass through child components
    // in order to update a composite question in the section
    // that has equations (derived) questions
    // Any value of triggerChanges will trigger the composite question update/re-rendering
    triggerChanges: boolean;

    private subscription: Subscription;
    private embeddedValidationStatus = new Map();

    readonly BlockType= BlockType;
    // Block guids and instance guids are generated separately,
    // there is a small possibility that they can have the same ids.
    // Prepended an unique `idPrefix` as to prevent a case with the same blockId & instanceId.
    readonly idPrefix = {
        block: 'b-',
        instance: 'i-'
    };

    constructor(@Inject('ddp.config') public config: ConfigurationService,
                private submissionManager: SubmissionManager,
                private readonly cdr: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.subscription = this.submissionManager.answerSubmissionResponse$.subscribe(response => {
            this.updateVisibilityAndValidation(response.blockVisibility);
            if (response.equations) {
                this.updateEquationQuestions(response.equations);
            }
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public onBlockVisibilityChanged(blockVisibility: BlockVisibility[]): void {
        this.updateVisibilityAndValidation(blockVisibility);
    }

    public updateValidationStatusInSection(id: string, isValid: boolean): void {
        this.embeddedValidationStatus.set(id, isValid);
        const reducedValidationStatus = Array.from(this.embeddedValidationStatus.values()).every(value => value);
        this.embeddedComponentsValidationStatus.next(reducedValidationStatus);
    }

    public shouldBlockBeShown(block: ActivityBlock, type: BlockType): boolean {
        return block.blockType === type && block.shown;
    }

    private updateVisibilityAndValidation(visibility: BlockVisibility[]): void {
        let blockStateChanged = false;
        visibility.forEach(element => {
            this.section.allChildBlocks().forEach(block => {
                if (block.id === element.blockGuid) {
                    if (block.shown !== element.shown) {
                        block.shown = element.shown;
                        blockStateChanged = true;
                    }
                    if (block.enabled !== element.enabled) {
                        block.enabled = element.enabled;
                        blockStateChanged = true;
                    }
                    if (block.blockType === BlockType.Activity && !block.shown) {
                        this.updateValidationForHiddenEmbeddedActivity(block as ActivityActivityBlock);
                    }
                }
            });
        });
        if (blockStateChanged) {
            this.cdr.detectChanges();
        }
    }

    private updateValidationForHiddenEmbeddedActivity(block: ActivityActivityBlock): void {
        block.instances.forEach((instance: ActivityInstance) => {
            this.updateValidationStatusInSection(this.idPrefix.instance + instance.instanceGuid, true);
        });
    }

    private updateEquationQuestions(equations: AnswerResponseEquation[]): void {
        const equationQuestionBlocks = this.section.allChildBlocks()
            .filter(block => block instanceof ActivityEquationQuestionBlock) as ActivityEquationQuestionBlock[];
        this.updateSingleEquations(equations, equationQuestionBlocks);

        const compositesWithEquations = this.section.allChildBlocks()
            .filter(block =>
                block instanceof ActivityCompositeQuestionBlock &&
                block.children.some(child => child instanceof ActivityEquationQuestionBlock)
            ) as ActivityCompositeQuestionBlock[];
        this.updateEquationsInComposites(equations, compositesWithEquations);
    }

    private updateSingleEquations(equations: AnswerResponseEquation[],
                                         equationQuestionBlocks: ActivityEquationQuestionBlock[]): void {
        for (const equation of equations) {
            for (const block of equationQuestionBlocks) {
                if (block.stableId === equation.stableId) {
                    block.setAnswer(equation.values, false);
                    this.triggerChanges = !this.triggerChanges;
                }
            }
        }
    }

    private updateEquationsInComposites(equations: AnswerResponseEquation[],
                                        compositesWithEquations: ActivityCompositeQuestionBlock[]): void {
        let shouldTriggerChanges = false;

        for (const equation of equations) {
            for (const composite of compositesWithEquations) {
                const innerEquationToUpdate = composite.children
                    .find((child: ActivityQuestionBlock<any>) => child.stableId === equation.stableId);

                if (innerEquationToUpdate) {
                    innerEquationToUpdate.setAnswer(equation.values, false);

                    const prevAnswer: AnswerContainer[][] = composite.answer;
                    const newAnswer: AnswerContainer[][] = prevAnswer.map((answerRow: AnswerContainer[], index) =>
                        // eslint-disable-next-line arrow-body-style
                        answerRow.map((answer: AnswerContainer) => {
                            return (answer.stableId === innerEquationToUpdate.stableId) ? {
                                ...answer,
                                value: [equation.values[index]]
                            } : answer;
                        })
                    );
                    composite.setAnswer(newAnswer, false);
                    shouldTriggerChanges = true;
                }
            }
        }

        if (shouldTriggerChanges) {
            this.triggerChanges = !this.triggerChanges;
        }
    }
}
