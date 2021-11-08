import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import {
  ActivityMatrixQuestionBlock,
  Group,
  Option,
  Question,
  SelectMode,
} from '../../../../models/activity/activityMatrixQuestionBlock';
import { ActivityMatrixAnswerDto } from '../../../../models/activity/activityMatrixAnswerDto';

interface RenderGroup extends Group {
  colSpan: number;
  options: Option[];
}

@Component({
  selector: 'ddp-activity-matrix-answer',
  templateUrl: './activity-matrix-answer.component.html',
  styleUrls: ['./activity-matrix-answer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityMatrixAnswer implements OnChanges {
  @Input() block: ActivityMatrixQuestionBlock;
  @Input() readonly: boolean;
  @Output() valueChanged = new EventEmitter<ActivityMatrixAnswerDto[]>();
  renderGroups: RenderGroup[];
  NO_GROUP_IDENTIFIER = 'NO_GROUP';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.block) {
      const block = changes.block.currentValue;

      this.renderGroups = this.getRenderGroups(block);
    }
  }

  get isSingleMode(): boolean {
    return this.block.selectMode === SelectMode.Single;
  }

  isOptionSelected(question: Question, group: Group, option: Option): boolean {
    const existingAnswer = this.block.answer?.find(
      a =>
        a.rowStableId === question.stableId &&
        a.groupStableId === group.identifier &&
        a.optionStableId === option.stableId,
    );

    return !!existingAnswer;
  }

  onOptionChange(question: Question, group: Group, option: Option): void {
    const selectedOption: ActivityMatrixAnswerDto = {
      rowStableId: question.stableId,
      groupStableId: group.identifier === this.NO_GROUP_IDENTIFIER ? null : group.identifier,
      optionStableId: option.stableId,
    };

    this.block.answer = this.composeAnswer(selectedOption, option.exclusive);

    this.valueChanged.emit(this.block.answer);
  }

  private getRenderGroups({ groups, options }: ActivityMatrixQuestionBlock): RenderGroup[] {
    const renderGroups = groups.map(group => {
      const groupOptions = options.filter(option => option.groupId === group.identifier);

      return {
        ...group,
        colSpan: groupOptions.length,
        options: groupOptions,
      };
    });

    const ungroupedOptions = options.filter(option => option.groupId === null);

    renderGroups.unshift({
      identifier: this.NO_GROUP_IDENTIFIER,
      name: null,
      options: ungroupedOptions,
      colSpan: ungroupedOptions.length,
    });

    return renderGroups;
  }

  private composeAnswer(
    option: ActivityMatrixAnswerDto,
    isOptionExclusive: boolean = false,
  ): ActivityMatrixAnswerDto[] {
    let answer = this.block.answer ?? [];

    if (this.block.selectMode === SelectMode.Single) {
      /**
       * If `selectMode` is `SINGLE`
       * we remove previously given answer (if there is one)
       * and add newly selected option
       */
      answer = answer.filter(a => a.rowStableId !== option.rowStableId);

      answer.push(option);

      return answer;
    } else {
      /**
       * If `selectMode` is `MULTIPLE`
       * we allow any number of selected options per group
       * AND also check for option exclusiveness
       */

      /**
       * 1st - check if user tries to remove existing answer
       */
      const existingAnswerIdx = answer.findIndex(
        a =>
          a.rowStableId === option.rowStableId &&
          a.groupStableId === option.groupStableId &&
          a.optionStableId === option.optionStableId,
      );

      if (existingAnswerIdx !== -1) {
        /**
         * User unchecks existing answer
         */
        answer = answer.filter((_, idx) => idx !== existingAnswerIdx);

        return answer;
      }

      /**
       * 2nd - user tries to select new option
       * so we check for option exclusiveness and if an option is exclusive
       * filter out other selected options in this group.
       * Note: options with group of `null` are considered in the same "noname" group
       */
      if (isOptionExclusive) {
        answer = answer.filter(a => a.rowStableId !== option.rowStableId && a.groupStableId !== option.groupStableId);
      }

      answer.push(option);

      return answer;
    }
  }
}
