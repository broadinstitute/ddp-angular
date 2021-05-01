import { AbstractRuleDef } from './abstractRuleDef';

export interface AgeRangeRuleDef extends AbstractRuleDef {
  minAge: number | null;
  maxAge: number | null;
  ruleType: 'AGE_RANGE';
}
