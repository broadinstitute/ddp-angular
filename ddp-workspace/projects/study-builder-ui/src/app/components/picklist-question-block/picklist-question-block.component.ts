import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { QuestionBlockDef } from '../../model/core/questionBlockDef';
import { ActivityPicklistNormalizedGroup, ActivityPicklistOption, ActivityPicklistQuestionBlock } from 'ddp-sdk';
import { Observable } from 'rxjs';
import { ConfigurationService } from '../../configuration.service';
import { filter, map, tap } from 'rxjs/operators';
import { SimpleTemplate } from '../../model/core-extended/simpleTemplate';
import { PicklistQuestionDef } from '../../model/core/picklistQuestionDef';
import { PicklistOptionDef } from '../../model/core/picklistOptionDef';
import { StudyConfigObjectFactory } from '../../model/core-extended/studyConfigObjectFactory';
import { PicklistGroupDef } from '../../model/core/picklistGroupDef';

@Component({
    selector: 'app-picklist-question-block',
    templateUrl: './picklist-question-block.component.html',
    styleUrls: ['./picklist-question-block.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PicklistQuestionBlockComponent implements OnInit {
    @Input()
    definitionBlock$: Observable<QuestionBlockDef<PicklistQuestionDef>>;
    angularClientBlock$: Observable<ActivityPicklistQuestionBlock>;

    private factory: StudyConfigObjectFactory;
    constructor(private config: ConfigurationService) {
        this.factory = new StudyConfigObjectFactory(config);
    }

    ngOnInit(): void {
        this.angularClientBlock$ = this.definitionBlock$.pipe(
            tap(defBlock => console.log('getting defblock: %o', defBlock)),
            filter(block => !!block),
            map(defBlock => this.buildFromDef(defBlock)));
    }

    private buildFromDef(defBlock: QuestionBlockDef<PicklistQuestionDef>): ActivityPicklistQuestionBlock {
        const newClientBlock = new ActivityPicklistQuestionBlock();
        const questionDef = defBlock.question;
        newClientBlock.selectMode = questionDef.selectMode;
        newClientBlock.renderMode = questionDef.renderMode;
        newClientBlock.isRequired = questionDef.validations.some(val => val.ruleType === 'REQUIRED');
        newClientBlock.stableId = questionDef.stableId;
        newClientBlock.question = new SimpleTemplate(questionDef.promptTemplate).getTranslationText(this.config.defaultLanguageCode);
        newClientBlock.picklistLabel =
            new SimpleTemplate(questionDef.picklistLabelTemplate).getTranslationText(this.config.defaultLanguageCode);
        newClientBlock.picklistOptions =
            questionDef.picklistOptions.map(picklistOption => this.convertOptionDefToActivityOption(picklistOption));
        newClientBlock.picklistGroups = questionDef.groups.map(group => this.convertGroupDefToActivityGroup(group));
        newClientBlock.detailMaxLength = 500;
        return newClientBlock;
    }

    private convertOptionDefToActivityOption(option: PicklistOptionDef): ActivityPicklistOption {
        return {
            ...option,
            optionLabel: new SimpleTemplate(option.optionLabelTemplate).getTranslationText(this.config.defaultLanguageCode),
            detailLabel: option.detailLabelTemplate
                ? new SimpleTemplate(option.detailLabelTemplate).getTranslationText(this.config.defaultLanguageCode)
                : '',
            tooltip: option.tooltipTemplate
                && new SimpleTemplate(option.tooltipTemplate).getTranslationText(this.config.defaultLanguageCode),
            allowDetails: !!option.allowDetails,
            exclusive: !!option.exclusive,
            groupId: null,
            nestedOptionsLabel: option.nestedOptionsLabel,
            nestedOptions: (option.nestedOptions || []).map(nestedOption => this.convertOptionDefToActivityOption(nestedOption)),
        };
    }

    private convertGroupDefToActivityGroup(group: PicklistGroupDef): ActivityPicklistNormalizedGroup {
        return {
            name: new SimpleTemplate(group.nameTemplate).getTranslationText(this.config.defaultLanguageCode),
            options: group.options.map(option => this.convertOptionDefToActivityOption(option))
        };
    }
}
