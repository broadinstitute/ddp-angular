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
import { ActivityActivityBlock } from '../../models/activity/activityActivityBlock';
import * as _ from 'underscore';
import {
    mockTabularData1,
    mockTabularData2
} from '../../components/activityForm/activity-blocks/tabularBlock/mock-tabular-data';
import { ActivityTabularBlock } from '../../models/activity/activityTabularBlock';

@Injectable()
export class ActivityConverter {
    private blockBuilders: Array<ActivityRule>;
    private readonly LOG_SOURCE = 'ActivityConverter';

    constructor(
        private questionConverter: ActivityQuestionConverter,
        private componentConverter: ActivityComponentConverter,
        private logger: LoggingService
    ) {
        this.initBlockBuilders();
    }

    public convertActivity(input: any): ActivityForm {
        const form = new ActivityForm();
        form.readonly = input.readonly;
        form.isHidden = input.isHidden;
        form.title = input.title;
        form.subtitle = input.subtitle;
        form.formType = input.formType;
        form.activityCode = input.activityCode;
        form.statusCode = input.statusCode;
        form.sectionIndex = input.sectionIndex;
        input.lastUpdatedText && (form.lastUpdatedText = input.lastUpdatedText);
        input.lastUpdated && (form.lastUpdated = input.lastUpdated);
        form.readonlyHint = _.isUndefined(input.readonlyHint) ? null : input.readonlyHint;
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

    private convertContentBlock(input: any): ActivityContentBlock {
        const block = new ActivityContentBlock();
        block.content = input.body;
        block.title = input.title;
        return block;
    }

    private convertGroupBlock(blockJson: any): ActivityGroupBlock {
        const groupBlock = new ActivityGroupBlock();
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
            this.logger.logError(`${this.LOG_SOURCE}.convertConditionalBlock`, 'Could not build control question');
            return null;
        }
        // appears that the control question is always show (there is no "shown" variable for control question in json)
        newBlock.controlQuestion.shown = true;

        this.buildShownField(newBlock, blockJson);
        newBlock.id = blockJson.blockGuid;
        newBlock.nestedGroupBlock = this.createGroupBlock(blockJson.nested);
        return newBlock;
    }

    private createGroupBlock(nestedBlocks: any): ActivityGroupBlock {
        const groupBlock = new ActivityGroupBlock();
        // we don't really get this from the server, but to keep things consistent on client...
        groupBlock.shown = true;
        groupBlock.nestedBlocks = this.buildActivityBlocks(nestedBlocks);
        for (const block of groupBlock.nestedBlocks) {
            if (block.blockType === BlockType.Question) {
                // dependent questions should not show a number
                (block as AbstractActivityQuestionBlock).displayNumber = null;
            }
        }
        // need to set a a list style to keep the group block happy. And we don't want a style
        groupBlock.listStyle = ListStyleHint.NONE;
        return groupBlock;
    }

    private buildActivityBlocks(jsonForBlocks: any): ActivityBlock[] {
        if (!(_.isArray(jsonForBlocks))) {
            return [];
        }
        return (jsonForBlocks as any[]).map((childJson: any) => {
            const blockBuilder = this.blockBuilders.find(x => x.type === childJson.blockType);
            if (!blockBuilder) {
                this.logger.logError(`${this.LOG_SOURCE}.convertConditionalBlock`, 'No builder for block type: ' + childJson.blockType);
                return null;
            }
            const childBlock = blockBuilder.func(childJson);
            if (!childBlock) {
                this.logger.logError(`${this.LOG_SOURCE}.convertConditionalBlock`, 'Could not build block from JSON', childJson);
                return null;
            }
            this.buildShownField(childBlock, childJson);
            childBlock.id = childJson.blockGuid;
            return childBlock;
        });
    }

    private convertActivityBlock(blockJson: any): ActivityActivityBlock {
        const activityBlock = new ActivityActivityBlock();
        activityBlock.title = blockJson.title;
        activityBlock.renderHint = blockJson.renderHint;
        activityBlock.activityCode = blockJson.activityCode;
        activityBlock.allowMultiple = blockJson.allowMultiple;
        activityBlock.addButtonText  = blockJson.addButtonText;
        activityBlock.instances = blockJson.instances;
        return activityBlock;
    }

    private convertTabularBlock(blockJson: any): ActivityTabularBlock {
        const activityBlock = new ActivityTabularBlock();
        activityBlock.title = blockJson.title;
        activityBlock.headers = blockJson.headers;
        activityBlock.numberOfColumns = blockJson.numberOfColumns;
        activityBlock.content = blockJson.content.map(question => this.questionConverter.buildQuestionBlock(question, null));
        return activityBlock;
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

            // add mockTabular data for debug
            // const sectionBlocks = jsonSection.blocks;
            const sectionBlocks = jsonSection.blocks.concat([mockTabularData1, mockTabularData2]);

            for (const inputBlock of sectionBlocks) {
                const blockBuilder = this.blockBuilders.find(x => x.type === inputBlock.blockType);
                if (blockBuilder) {
                    const block = blockBuilder.func(inputBlock);
                    if (!block) {
                        continue;
                    }
                    this.buildShownField(block, inputBlock);
                    this.buildEnabledField(block, inputBlock);
                    block.id = inputBlock.blockGuid;
                    section.blocks.push(block);
                } else {
                    // TODO throw exception here? For now no. Just log it as a problem
                    this.logger.logError(this.LOG_SOURCE, `Received unknown block type with name ${inputBlock.blockType} from server`);
                }
            }
        }
        return section;
    }

    private buildShownField<TBlock extends ActivityBlock>(block: TBlock, inputBlock: any): TBlock {
        block.shown = (inputBlock.shown != null) ? inputBlock.shown : true;
        return block;
    }

    private buildEnabledField<TBlock extends ActivityBlock>(block: TBlock, inputBlock: any): TBlock {
        block.enabled = inputBlock.enabled ?? true;
        return block;
    }

  private initBlockBuilders(): void {
      this.blockBuilders = [
          {
              type: BlockType.Content,
              func: (input) => this.convertContentBlock(input)
          },
          {
              type: BlockType.Question,
              func: (input) => this.questionConverter.buildQuestionBlock(input.question, input.displayNumber)
          },
          {
              type: BlockType.Component,
              func: (input) => this.componentConverter.convertComponent(input)
          },
          {
              type: BlockType.Group,
              func: (input) => this.convertGroupBlock(input)
          },
          {
              type: BlockType.Conditional,
              func: (input) => this.convertConditionalBlock(input)
          },
          {
              type: BlockType.Activity,
              func: (input) => this.convertActivityBlock(input)
          },{
              type: BlockType.Tabular,
              func: (input) => this.convertTabularBlock(input)
          }
      ];
  }
}
