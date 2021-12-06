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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.block) {
      const block = changes.block.currentValue;

      this.renderGroups = this.getRenderGroups(block);
    }
  }

  get isSingleMode(): boolean {
    return this.block.selectMode === SelectMode.Single;
  }

  isOptionSelected(question: Question, option: Option): boolean {
    const existingAnswer = this.block.answer?.find(
      a => a.rowStableId === question.stableId && a.optionStableId === option.stableId,
    );

    return !!existingAnswer;
  }

  onOptionChange(question: Question, group: Group, option: Option): void {
    const selectedOption: ActivityMatrixAnswerDto = {
      rowStableId: question.stableId,
      optionStableId: option.stableId,
    };

    this.block.answer = this.composeAnswer(selectedOption, option.exclusive, group.identifier);

    this.valueChanged.emit(this.block.answer);
  }

  anyGroupHasName(groups: RenderGroup[]): boolean {
    return groups.some(group => !!group.name);
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

    return renderGroups;
  }

  private composeAnswer(
    newAnswer: ActivityMatrixAnswerDto,
    isOptionExclusive: boolean = false,
    newOptionGroupStableId: string,
  ): ActivityMatrixAnswerDto[] {
    let answer = this.block.answer ?? [];

    if (this.isSingleMode) {
      /**
       * If `selectMode` is `SINGLE`
       * we remove previously given answer (if there is one)
       * and add newly selected option
       */
      answer = answer.filter(a => a.rowStableId !== newAnswer.rowStableId);

      answer.push(newAnswer);

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
        a => a.rowStableId === newAnswer.rowStableId && a.optionStableId === newAnswer.optionStableId,
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
        answer = answer.reduce<ActivityMatrixAnswerDto[]>((arr, ans) => {
          if (ans.rowStableId === newAnswer.rowStableId) {
            const answeredOptionGroupStableId = this.getGroupStableId(ans.optionStableId);

            if (answeredOptionGroupStableId !== newOptionGroupStableId) {
              /**
               * Only keep answers from other groups
               */
              arr.push(ans);
            }
          } else {
            /**
             * Don't do anything with answers for other questions, just keep
             */
            arr.push(ans);
          }

          return arr;
        }, []);
      } else {
        /**
         * Since selected option is not exclusive,
         * check & remove other selected exclusive options in this group
         */
        answer = answer.reduce<ActivityMatrixAnswerDto[]>((arr, ans) => {
          const answeredOptionGroupStableId = this.getGroupStableId(ans.optionStableId);

          if (
            ans.rowStableId === newAnswer.rowStableId &&
            answeredOptionGroupStableId === newOptionGroupStableId &&
            this.isAnsweredOptionExclusive(ans)
          ) {
            return arr;
          }

          arr.push(ans);

          return arr;
        }, []);
      }

      answer.push(newAnswer);

      return answer;
    }
  }

  private isAnsweredOptionExclusive(answer: ActivityMatrixAnswerDto): boolean {
    const associatedOption = this.block.options.find(option => option.stableId === answer.optionStableId);

    return associatedOption.exclusive;
  }

  private getGroupStableId(optionStableId: string): string {
    const associatedOption = this.block.options.find(option => option.stableId === optionStableId);

    return associatedOption.groupId;
  }
}
