import { AbstractRuleDef } from './abstractRuleDef';

export interface IntRangeRuleDef extends AbstractRuleDef {
  min: number | null;
  max: number | null;
  ruleType: 'INT_RANGE';
}
