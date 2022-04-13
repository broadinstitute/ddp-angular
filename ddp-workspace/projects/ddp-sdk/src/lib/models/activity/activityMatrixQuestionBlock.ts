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
  name: string | null;
}

export enum SelectMode {
  Single = 'SINGLE',
  Multiple = 'MULTIPLE',
}

export enum RenderMode {
  Inline = 'INLINE',
  Modal = 'MODAL',
}

export class ActivityMatrixQuestionBlock extends ActivityQuestionBlock<
  ActivityMatrixAnswerDto[]
> {
  selectMode: SelectMode;
  questions: Question[] = [];
  options: Option[] = [];
  groups: Group[] = [];
  renderMode = RenderMode.Inline;
  openBtnText = 'Open Question'; // Take value from response when backend changes are implemented
  modalTitle = '';

  public get questionType(): QuestionType {
    return QuestionType.Matrix;
  }

  hasAnswer(): boolean {
    const stableIdsMap = new Map<string, boolean>();

    this.questions.forEach(question =>
      stableIdsMap.set(question.stableId, false),
    );

    this.answer?.forEach(answer => stableIdsMap.set(answer.rowStableId, true));

    return Array.from(stableIdsMap.values()).every(Boolean);
  }
}
