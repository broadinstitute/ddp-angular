import { AbstractRuleDef } from './abstractRuleDef';

export interface NumOptionsSelectedRuleDef extends AbstractRuleDef {
  minSelections: number | null;
  maxSelections: number | null;
  ruleType: 'NUM_OPTIONS_SELECTED';
}
