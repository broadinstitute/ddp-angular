import { RuleType } from './ruleType';
import { Template } from './template';

export interface AbstractRuleDef {
  ruleType: RuleType;
  hintTemplate?: Template | null;
  allowSave?: boolean;
}
