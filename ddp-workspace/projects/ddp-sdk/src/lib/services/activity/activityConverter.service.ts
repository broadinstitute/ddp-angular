import { Injectable } from '@angular/core';
import { LoggingService } from '../logging.service';
import { ActivityQuestionConverter } from './activityQuestionConverter.service';
import { ActivityComponentConverter } from './activityComponentConverter.service';
import { ActivityRule } from '../../models/activity/activityRule';
import { ActivityContentBlock } from '../../models/activity/activityContentBlock';
import { ActivityForm } from '../../models/activity/activityForm';
import { ActivitySection } from '../../models/activity/activitySection';
import { ActivityBlock } from '../../models/activity/activityBlock';
import { ActivityGroupBlock } from '../../models/activity/activityGroupBlock';
import { ConditionalBlock } from '../../models/activity/conditionalBlock';
import { ListStyleHint } from '../../models/activity/listStyleHint';
import { BlockType } from '../../models/activity/blockType';
import { AbstractActivityQuestionBlock } from '../../models/activity/abstractActivityQuestionBlock';
import * as _ from 'underscore';

@Injectable()
export class ActivityConverter {
    private blockBuilders: Array<ActivityRule>;

    constructor(
        private questionConverter: ActivityQuestionConverter,
        private componentConverter: ActivityComponentConverter,
        private logger: LoggingService) {
        this.blockBuilders = [
            {
                type: 'CONTENT', func: (input) => {
                    const block = new ActivityContentBlock();
                    block.content = input.body;
                    block.title = input.title;
                    return block;
                }
            },
            {
                type: 'QUESTION', func: (input) => this.questionConverter.buildQuestionBlock(
                    input.question,
                    input.displayNumber)
            },
            { type: 'COMPONENT', func: (input) => this.componentConverter.convertComponent(input) },
            { type: 'GROUP', func: (input) => this.convertGroupBlock(input) },
            { type: 'CONDITIONAL', func: (input) => this.convertConditionalBlock(input) }
        ];
    }

    public convertActivity(input: any): ActivityForm {
        const form = new ActivityForm();
        form.readonly = input.readonly;
        form.title = input.title;
        form.subtitle = input.subtitle;
        form.formType = input.formType;
        form.activityCode = input.activityCode;
        form.sectionIndex = input.sectionIndex;
        input.lastUpdatedText && (form.lastUpdatedText = input.lastUpdatedText);
        input.lastUpdated && (form.lastUpdated = input.lastUpdated);
        if (_.isUndefined(input.readonlyHint)) {
            form.readonlyHint = null;
        } else {
            form.readonlyHint = input.readonlyHint;
        }
        for (const inputSection of input.sections) {
            const section = this.convertActivitySection(inputSection);
            form.sections.push(section);
        }
        if (input.introduction) {
            form.introduction = this.convertActivitySection(input.introduction);
        }
        if (input.closing) {
            form.closing = this.convertActivitySection(input.closing);
        }
        form.recalculateSectionsVisibility();
        return form;
    }

    private convertGroupBlock(blockJson: any): ActivityBlock {
        const groupBlock: ActivityGroupBlock = new ActivityGroupBlock();
        groupBlock.title = blockJson.title;
        groupBlock.nestedBlocks = this.buildActivityBlocks(blockJson.nested);
        groupBlock.shown = blockJson.shown;
        groupBlock.listStyle = ListStyleHint[blockJson.listStyleHint as string];
        return groupBlock;
    }

    private convertConditionalBlock(blockJson: any): ConditionalBlock | null {
        const newBlock = new ConditionalBlock();
        newBlock.displayNumber = blockJson.displayNumber;
        newBlock.controlQuestion = this.questionConverter.buildQuestionBlock(blockJson.control, null);
        if (!newBlock.controlQuestion) {
            this.logger.logError('ActivityConverter.convertConditionalBlock', 'Could not build control question');
            return null;
        }
        // appears that the control question is always show (there is no "shown" variable for control question in json)
        newBlock.controlQuestion.shown = true;
        const nestedGroupBlock = new ActivityGroupBlock();
        // we don't really get this from the server, but to keep things consistent on client...
        nestedGroupBlock.shown = true;
        nestedGroupBlock.nestedBlocks = this.buildActivityBlocks(blockJson.nested);
        for (const block of nestedGroupBlock.nestedBlocks) {
            if (block.blockType === BlockType.Question) {
                // dependent questions should not show a number
                (block as AbstractActivityQuestionBlock).displayNumber = null;
            }
        }
        // need to set a a list style to keep the group block happy. And we don't want a style
        nestedGroupBlock.listStyle = ListStyleHint['NONE'];
        this.buildShownField(newBlock, blockJson).id = blockJson.blockGuid;
        newBlock.nestedGroupBlock = nestedGroupBlock;
        return newBlock;
    }

    private buildActivityBlocks(jsonForBlocks: any | null | undefined): ActivityBlock[] {
        if (!(_.isArray(jsonForBlocks))) {
            return [];
        }
        return (jsonForBlocks as any[]).map((childJson: any) => {
            const blockBuilder = this.blockBuilders.find(x => x.type === childJson.blockType);
            if (!blockBuilder) {
                this.logger.logError('ActivityConverter.convertConditionalBlock', 'No builder for block type: '
                    + childJson.blockType);
                return null;
            }
            const childBlock = blockBuilder.func(childJson);
            if (!childBlock) {
                this.logger.logError('ActivityConverter.convertConditionalBlock', 'Could not build block from JSON'
                    + JSON.stringify(childJson));
                return null;
            }
            this.buildShownField(childBlock, childJson).id = childJson.blockGuid;
            return childBlock;
        });
    }

    private convertActivitySection(jsonSection: any): ActivitySection {
        const section = new ActivitySection();
        if (!_.isUndefined(jsonSection) && jsonSection) {
            section.name = jsonSection.name;
            section.icons = [];
            for (const inputIcon of jsonSection.icons) {
                const icon = {
                    state: inputIcon.state,
                    icon: inputIcon['1x']
                };
                section.icons.push(icon);
            }
            for (const inputBlock of jsonSection.blocks) {
                const blockBuilder = this.blockBuilders.find(x => x.type === inputBlock.blockType);
                if (blockBuilder) {
                    const block = blockBuilder.func(inputBlock);
                    if (!block) {
                        continue;
                    }
                    this.buildShownField(block, inputBlock).id = inputBlock.blockGuid;
                    section.blocks.push(block);
                } else {
                    // TODO throw exception here? For now no. Just log it as a problem
                    this.logger.logError(
                        `ActivityConverter`,
                        `Received unknown block type with name ${inputBlock.blockType} from server`);
                }
            }
        }
        return section;
    }

    private buildShownField<TBlock extends ActivityBlock>(block: TBlock, inputBlock: any): TBlock {
        if (inputBlock.shown != null) {
            block.shown = inputBlock.shown;
        } else {
            block.shown = true;
        }
        return block;
    }
}
