import { ActivityQuestionBlock } from './activityQuestionBlock';
import { ActivityMatrixAnswerDto } from './activityMatrixAnswerDto';
import { QuestionType } from './questionType';

export interface Question {
  stableId: string;
  questionLabel: string;
  tooltip: string | null;
}

export interface Option {
  stableId: string;
  groupId: string | null;
  optionLabel: string;
  exclusive: boolean;
  tooltip: string | null;
}

export interface Group {
  identifier: string;
  name: string;
}

export enum SelectMode {
  Single = 'SINGLE',
  Multiple = 'MULTIPLE',
}

export class ActivityMatrixQuestionBlock extends ActivityQuestionBlock<ActivityMatrixAnswerDto[]> {
  selectMode: SelectMode;
  questions: Question[] = [];
  options: Option[] = [];
  groups: Group[] = [];

  public get questionType(): QuestionType {
    return QuestionType.Matrix;
  }

  hasAnswer(): boolean {
    const stableIdsMap = new Map<string, boolean>();

    this.questions.forEach(question => stableIdsMap.set(question.stableId, false));

    this.answer?.forEach(answer => stableIdsMap.set(answer.rowStableId, true));

    return Array.from(stableIdsMap.values()).every(Boolean);
  }
}
