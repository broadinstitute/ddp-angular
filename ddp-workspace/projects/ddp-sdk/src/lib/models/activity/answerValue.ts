import { DatePickerValue } from '../datePickerValue';
import { ActivityPicklistAnswerDto } from './activityPicklistAnswerDto';
import { ActivityMatrixAnswerDto } from './activityMatrixAnswerDto';

export type AnswerValue =
  | boolean
  | string
  | Array<ActivityPicklistAnswerDto>
  | DatePickerValue
  | number
  | null
  | any[][]
  | ActivityMatrixAnswerDto[];
