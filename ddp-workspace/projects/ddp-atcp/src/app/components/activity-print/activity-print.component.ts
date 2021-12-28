import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Observable, of, Subject } from 'rxjs';
import { catchError, switchMap, take, tap } from 'rxjs/operators';

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
  ActivityGroupBlock,
  ActivityContentBlock,
  CompositeDisposable,
  ConfigurationService,
  ConditionalBlock,
  LanguageService,
  LoggingService,
  SubmissionManager,
} from 'ddp-sdk';

import { MultiGovernedUserService } from '../../services/multi-governed-user.service';

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
  CompositeDivider = 'COMPOSITE_DIVIDER',
}

interface Block {
  type: BlockTypes;
  content: string;
  value?: any;
  additional?: Record<string, any>;
}

@Component({
  selector: 'app-activity-print',
  templateUrl: './activity-print.component.html',
  styleUrls: ['./activity-print.component.scss'],
  providers: [SubmissionManager],
})
export class ActivityPrintComponent implements OnInit, OnDestroy {
  loading: boolean;
  instanceGuid: string;
  studyGuid: string;
  activityForm: ActivityForm;
  blocks: Block[] = [];
  blockTypes = BlockTypes;
  fetchActivityForm$ = new Subject<void>();

  private anchor = new CompositeDisposable();
  private logSource = 'ActivityPrintComponent';

  constructor(
    private route: ActivatedRoute,
    private activityService: ActivityServiceAgent,
    private languageService: LanguageService,
    private loggingService: LoggingService,
    private multiGovernedUserService: MultiGovernedUserService,
    @Inject('ddp.config') private config: ConfigurationService
  ) {}

  ngOnInit(): void {
    this.instanceGuid = this.route.snapshot.params.instanceGuid;
    this.studyGuid = this.config.studyGuid;

    this.setupListener();
    this.setupLanguageListener();

    this.fetchActivityForm$.next();
  }

  ngOnDestroy(): void {
    this.anchor.removeAll();
  }

  onPrintClick(): void {
    window.print();
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  private setupListener(): void {
    this.anchor.addNew(
      this.fetchActivityForm$
        .pipe(switchMap(() => this.fetchActivityForm()))
        .subscribe()
    );
  }

  private setupLanguageListener(): void {
    this.anchor.addNew(
      this.languageService
        .getProfileLanguageUpdateNotifier()
        .subscribe(lang => {
          if (lang !== null) {
            this.fetchActivityForm$.next();
          }
        })
    );
  }

  private fetchActivityForm(): Observable<ActivityForm | void> {
    this.loading = true;

    return this.activityService
      .getActivity(of(this.config.studyGuid), of(this.instanceGuid))
      .pipe(
        take(1),
        tap(activityForm => {
          this.blocks = [];
          this.activityForm = activityForm;
          this.convertActivityForm(activityForm);
          this.loading = false;
        }),
        catchError(err => {
          this.loggingService.logError(this.logSource, err);
          this.multiGovernedUserService.navigateToDashboard();

          return EMPTY;
        })
      );
  }

  private convertActivityForm(activityForm: ActivityForm): void {
    for (const [idx, section] of activityForm.sections
      .filter(formSection => formSection.visible)
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
        this.loggingService.logWarning(
          this.logSource,
          'Cannot determine type of block',
          block
        );
        break;
    }
  }

  private handleGroupBlock(block: ActivityGroupBlock): void {
    for (const nestedBlock of block.nestedBlocks) {
      this.convertBlock(nestedBlock);
    }
  }

  private handleConditionalBlock(block: ConditionalBlock, answer?: any): void {
    if (block.controlQuestion) {
      this.convertBlock(block.controlQuestion);
    }

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
    const booleanBlock = {
      type: BlockTypes.Boolean,
      content: this.getBlockContent(block),
      value: answer || block.answer,
    } as Block;

    if (block.trueContent && block.falseContent) {
      booleanBlock.additional = {
        trueContent: block.trueContent,
        falseContent: block.falseContent,
      };
    }

    this.blocks.push(booleanBlock);
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

    let blockAnswers = block.answer;

    if (!blockAnswers) {
      blockAnswers = [new Array(block.children.length).fill(null)];
    }

    for (let i = 0; i < blockAnswers.length; i++) {
      const answers = blockAnswers[i];

      for (let j = 0; j < answers.length; j++) {
        const childBlock = block.children[j];
        const childBlockAnswer = answers[j];

        this.convertBlock(childBlock, childBlockAnswer);
      }

      if (i !== blockAnswers.length - 1) {
        this.blocks.push({
          type: BlockTypes.CompositeDivider,
          content: block.additionalItemText,
        });
      }
    }
  }

  private handlePicklistQuestionBlock(
    block: ActivityPicklistQuestionBlock,
    answer?: any
  ): void {
    const userAnswers = (answer && answer.value) || block.answer;
    const possibleAnswers = block.picklistOptions;

    let answers;

    if (block.renderMode === 'LIST') {
      answers = Array.isArray(userAnswers)
        ? possibleAnswers.map(possibleAnswer => {
            const associatedUserAnswer = userAnswers.find(
              userAnswer => userAnswer.stableId === possibleAnswer.stableId
            );

            if (!associatedUserAnswer) {
              return possibleAnswer;
            }

            return Object.assign(possibleAnswer, {
              selected: true,
              detail: associatedUserAnswer ? associatedUserAnswer.detail : null,
            });
          })
        : possibleAnswers;
    } else if (block.renderMode === 'DROPDOWN') {
      answers = block.answer
        ? possibleAnswers.find(
            possibleAnswer => possibleAnswer.stableId === block.answer[0].stableId
          ).optionLabel
        : '';
    }

    this.blocks.push({
      type: BlockTypes.Picklist,
      content: this.getBlockContent(block),
      value: answers,
      additional: {
        renderMode: block.renderMode,
        multiple: block.selectMode === 'MULTIPLE',
        possibleOptions: possibleAnswers,
      },
    });
  }

  private handleDateQuestionBlock(
    block: ActivityDateQuestionBlock,
    answer?: any
  ): void {
    const userAnswer = (answer && answer.value) || block.answer;

    let date: Date | string = '';

    if (userAnswer) {
      date = new Date(
        `${userAnswer.year}-${userAnswer.month}-${userAnswer.day}`
      );
    }

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
    return this.stripHtmlTags(block.question || block.placeholder || '');
  }

  private stripHtmlTags(raw: string): string {
    let el = document.createElement('div');
    el.innerHTML = raw;

    const content = (el.textContent || el.innerHTML || '')
      .replace('\u200B', '')
      .replace('*', '')
      .trim();
    el = null;

    return content;
  }
}
