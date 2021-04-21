import { AbstractRuleDef } from './abstractRuleDef';

export interface RequiredRuleDef extends AbstractRuleDef {
  ruleType: 'REQUIRED';
}
