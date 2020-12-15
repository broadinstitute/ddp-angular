import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';

import {
  ActivityAgreementQuestionBlock,
  ActivityBooleanQuestionBlock,
  ActivityCompositeQuestionBlock,
  ActivityDateQuestionBlock,
  ActivityForm,
  ActivityNumericQuestionBlock,
  ActivityPicklistQuestionBlock,
  ActivityServiceAgent,
  ActivityTextQuestionBlock,
  ConfigurationService,
  SubmissionManager,
} from 'ddp-sdk';

import { MultiGovernedUserService } from '../../services/multi-governed-user.service';
import { ActivityGroupBlock } from 'projects/ddp-sdk/src/lib/models/activity/activityGroupBlock';
import { ConditionalBlock } from 'projects/ddp-sdk/src/lib/models/activity/conditionalBlock';
import { ActivityContentBlock } from 'projects/ddp-sdk/src/lib/models/activity/activityContentBlock';

enum BlockTypes {
  Section = 'SECTION',
  Content = 'CONTENT',
  Boolean = 'BOOLEAN',
  Numeric = 'NUMERIC',
  Conditional = 'CONDITIONAL',
  Text = 'TEXT',
  Composite = 'COMPOSITE',
  Picklist = 'PICKLIST',
  Date = 'DATE',
  Agreement = 'AGREEMENT',
}

interface Block {
  type: BlockTypes;
  content: string;
  value?: any;
}

@Component({
  selector: 'atcp-activity-print',
  templateUrl: './activity-print.component.html',
  styleUrls: ['./activity-print.component.scss'],
  providers: [SubmissionManager],
})
export class ActivityPrintComponent implements OnInit {
  loading: boolean;
  instanceGuid: string;
  studyGuid: string;
  activityForm: ActivityForm;
  blocks: Block[] = [];
  blockTypes = BlockTypes;

  @ViewChild('printContainer', { static: false }) printContainer: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private activityService: ActivityServiceAgent,
    private multiGovernedUserService: MultiGovernedUserService,
    @Inject('ddp.config') private config: ConfigurationService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.instanceGuid = this.route.snapshot.params.instanceGuid;
    this.studyGuid = this.config.studyGuid;

    this.activityService
      .getActivity(of(this.config.studyGuid), of(this.instanceGuid))
      .pipe(take(1))
      .subscribe(
        activityForm => {
          this.activityForm = activityForm;
          this.convertActivityForm(activityForm);
          this.loading = false;
        },
        () => {
          this.multiGovernedUserService.navigateToDashboard();
        }
      );
  }

  onPrintClick(): void {
    window.print();
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  private convertActivityForm(activityForm: ActivityForm): void {
    console.log({ activityForm });

    for (const [idx, section] of activityForm.sections
      .filter(section => section.visible)
      .entries()) {
      if (idx !== 0) {
        this.blocks.push({
          type: BlockTypes.Section,
          content: '',
        });
      }

      for (const block of section.blocks) {
        this.convertBlock(block);
      }
    }

    console.log(this.blocks);
  }

  private convertBlock(block: any, answer?: any): void {
    if (block && block.shown === false) {
      return;
    }

    switch (block.constructor) {
      case ActivityGroupBlock:
        return this.handleGroupBlock(block);
      case ConditionalBlock:
        return this.handleConditionalBlock(block, answer);
      case ActivityContentBlock:
        return this.handleContentBlock(block);
      case ActivityBooleanQuestionBlock:
        return this.handleBooleanQuestionBlock(block, answer);
      case ActivityNumericQuestionBlock:
        return this.handleNumericQuestionBlock(block, answer);
      case ActivityTextQuestionBlock:
        return this.handleTextQuestionBlock(block, answer);
      case ActivityCompositeQuestionBlock:
        return this.handleCompositeQuestionBlock(block);
      case ActivityPicklistQuestionBlock:
        return this.handlePicklistQuestionBlock(block, answer);
      case ActivityDateQuestionBlock:
        return this.handleDateQuestionBlock(block, answer);
      case ActivityAgreementQuestionBlock:
        return this.handleAgreementQuestionBlock(block);
      default:
        console.log('Cannot determine type of this block', block);
    }
  }

  private handleGroupBlock(block: ActivityGroupBlock): void {
    for (const nestedBlock of block.nestedBlocks) {
      this.convertBlock(nestedBlock);
    }
  }

  private handleConditionalBlock(block: ConditionalBlock, answer?: any): void {
    const userAnswers = answer || block.controlQuestion.answer;
    const possibleAnswers = (block.controlQuestion as any).picklistOptions;
    const answers = userAnswers.map(answer =>
      possibleAnswers.find(a => a.stableId === answer.stableId)
    );

    this.blocks.push({
      type: BlockTypes.Conditional,
      content: this.getBlockContent(block.controlQuestion),
      value: answers,
    });

    if (block.nestedGroupBlock) {
      this.convertBlock(block.nestedGroupBlock);
    }
  }

  private handleContentBlock(block: ActivityContentBlock): void {
    this.blocks.push({
      type: BlockTypes.Content,
      content: this.stripHtmlTags(block.content),
    });
  }

  private handleBooleanQuestionBlock(
    block: ActivityBooleanQuestionBlock,
    answer?: any
  ): void {
    this.blocks.push({
      type: BlockTypes.Boolean,
      content: this.getBlockContent(block),
      value: answer || block.answer,
    });
  }

  private handleNumericQuestionBlock(
    block: ActivityNumericQuestionBlock,
    answer?: any
  ): void {
    this.blocks.push({
      type: BlockTypes.Numeric,
      content: this.getBlockContent(block),
      value: answer || block.answer,
    });
  }

  private handleTextQuestionBlock(
    block: ActivityTextQuestionBlock,
    answer?: any
  ): void {
    this.blocks.push({
      type: BlockTypes.Text,
      content: this.getBlockContent(block),
      value: (answer && answer.value) || block.answer,
    });
  }

  private handleCompositeQuestionBlock(
    block: ActivityCompositeQuestionBlock
  ): void {
    this.blocks.push({
      type: BlockTypes.Composite,
      content: this.getBlockContent(block),
    });

    for (let i = 0; i < block.answer.length; i++) {
      const answers = block.answer[i];

      for (let j = 0; j < answers.length; j++) {
        const childBlock = block.children[j];
        const childBlockAnswer = answers[j];

        this.convertBlock(childBlock, childBlockAnswer);
      }
    }
  }

  private handlePicklistQuestionBlock(
    block: ActivityPicklistQuestionBlock,
    answer?: any
  ): void {
    const userAnswers = (answer && answer.value) || block.answer;
    const possibleAnswers = block.picklistOptions;
    const answers = Array.isArray(userAnswers)
      ? userAnswers.map(answer =>
          possibleAnswers.find(a => a.stableId === answer.stableId)
        )
      : [];

    this.blocks.push({
      type: BlockTypes.Picklist,
      content: this.getBlockContent(block),
      value: answers,
    });
  }

  private handleDateQuestionBlock(
    block: ActivityDateQuestionBlock,
    answer?: any
  ): void {
    const userAnswer = (answer && answer.value) || block.answer;
    const date = new Date(
      `${userAnswer.year}-${userAnswer.month}-${userAnswer.day}`
    );

    this.blocks.push({
      type: BlockTypes.Date,
      content: this.getBlockContent(block),
      value: date,
    });
  }

  private handleAgreementQuestionBlock(
    block: ActivityAgreementQuestionBlock
  ): void {
    this.blocks.push({
      type: BlockTypes.Agreement,
      content: this.getBlockContent(block),
      value: block.answer,
    });
  }

  private getBlockContent(block: any): string {
    return (
      this.stripHtmlTags(block.question) ||
      this.stripHtmlTags(block.placeholder) ||
      ''
    );
  }

  private stripHtmlTags(raw: string): string {
    let el = document.createElement('div');
    el.innerHTML = raw;

    let content = (el.textContent || el.innerHTML || '')
      .replace('\u200B', '')
      .replace('*', '')
      .trim();
    el = null;

    return content;
  }
}
