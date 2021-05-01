import { AbstractRuleDef } from './abstractRuleDef';

export interface LengthRuleDef extends AbstractRuleDef {
  minLength?: number | null;
  maxLength?: number | null;
  ruleType: 'LENGTH';
}
