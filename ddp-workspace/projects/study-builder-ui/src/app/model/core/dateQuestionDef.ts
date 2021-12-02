import { AbstractQuestionDef } from './abstractQuestionDef';
import { Template } from './template';
import { DateRenderMode } from './dateRenderMode';
import { DateFieldType } from './dateFieldType';
import { DatePicklistDef } from './datePicklistDef';

export interface DateQuestionDef extends AbstractQuestionDef {
  renderMode: DateRenderMode;
  displayCalendar: boolean;
  fields: Array<DateFieldType>;
  picklistConfig?: DatePicklistDef | null;
  placeholderTemplate?: Template | null;
  questionType: 'DATE';
}
