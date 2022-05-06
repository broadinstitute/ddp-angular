import { DatePickerValue } from '../datePickerValue';
import { ActivityPicklistAnswerDto } from './activityPicklistAnswerDto';
import { ActivityMatrixAnswerDto } from './activityMatrixAnswerDto';
import { NumericAnswerType } from './numericAnswerType';

export type AnswerValue =
  | boolean
  | string
  | string[]
  | Array<ActivityPicklistAnswerDto>
  | DatePickerValue
  | NumericAnswerType
  | null
  | any[][]
  | ActivityMatrixAnswerDto[];
