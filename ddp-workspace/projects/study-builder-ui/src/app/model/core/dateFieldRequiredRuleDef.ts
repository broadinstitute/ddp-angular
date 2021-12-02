import { AbstractRuleDef } from './abstractRuleDef';

export interface DateFieldRequiredRuleDef extends AbstractRuleDef {
  ruleType: 'YEAR_REQUIRED' | 'MONTH_REQUIRED' | 'DAY_REQUIRED';
}
