import { DatePickerValue } from '../datePickerValue';
import { ActivityPicklistAnswerDto } from './activityPicklistAnswerDto';
import { ActivityMatrixAnswerDto } from './activityMatrixAnswerDto';
import { NumericAnswerType } from './numericAnswerType';
import { DecimalAnswer } from './decimalAnswer';

export type AnswerValue =
  | boolean
  | string
  | string[]
  | Array<ActivityPicklistAnswerDto>
  | DatePickerValue
  | NumericAnswerType
  | DecimalAnswer[]
  | null
  | any[][]
  | ActivityMatrixAnswerDto[];
