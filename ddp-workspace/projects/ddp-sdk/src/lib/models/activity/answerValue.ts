import { DatePickerValue } from '../datePickerValue';
import { ActivityPicklistAnswerDto } from './activityPicklistAnswerDto';
import { ActivityMatrixAnswerDto } from './activityMatrixAnswerDto';
import { NumericAnswerType } from './activityNumericQuestionBlock';

export type AnswerValue =
  | boolean
  | string
  | Array<ActivityPicklistAnswerDto>
  | DatePickerValue
  | NumericAnswerType
  | null
  | any[][]
  | ActivityMatrixAnswerDto[];
