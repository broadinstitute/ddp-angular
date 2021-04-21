import { AbstractRuleDef } from './abstractRuleDef';

export interface RegexRuleDef extends AbstractRuleDef {
  pattern: string;
  ruleType: 'REGEX';
}
