import { DatePickerValue } from '../datePickerValue';
import { ActivityPicklistAnswerDto } from './activityPicklistAnswerDto';
import { ActivityMatrixAnswerDto } from './activityMatrixAnswerDto';
import { NumericAnswerType } from './activityDecimalQuestionBlock';

export type AnswerValue =
  | boolean
  | string
  | Array<ActivityPicklistAnswerDto>
  | DatePickerValue
  | NumericAnswerType
  | null
  | any[][]
  | ActivityMatrixAnswerDto[];
