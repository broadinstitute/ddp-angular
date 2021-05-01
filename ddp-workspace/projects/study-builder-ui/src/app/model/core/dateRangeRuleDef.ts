import { AbstractRuleDef } from './abstractRuleDef';
import { DateString } from './dateString';

export interface DateRangeRuleDef extends AbstractRuleDef{
  startDate: DateString | null;
  endDate: DateString | null;
  useTodayAsEnd: boolean;
  ruleType: 'DATE_RANGE';
}
