import { DatePickerValue } from '../datePickerValue';
import { ActivityPicklistAnswerDto } from './activityPicklistAnswerDto';

export type AnswerValue = boolean | string | Array<ActivityPicklistAnswerDto> | DatePickerValue | number | null | any[][];
