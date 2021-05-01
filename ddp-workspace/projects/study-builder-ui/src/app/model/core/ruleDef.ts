import { LengthRuleDef } from './lengthRuleDef';
import { RegexRuleDef } from './regexRuleDef';
import { AgeRangeRuleDef } from './ageRuleDef';
import { CompleteRuleDef } from './completeRuleDef';
import { DateFieldRequiredRuleDef } from './dateFieldRequiredRuleDef';
import { IntRangeRuleDef } from './intRangeRuleDef';
import { NumOptionsSelectedRuleDef } from './numOptionsSelectedRuleDef';
import { RequiredRuleDef } from './requiredRuleDef';
import { DateRangeRuleDef } from './dateRangeRuleDef';

export type RuleDef =
  LengthRuleDef
  | RegexRuleDef
  | AgeRangeRuleDef
  | CompleteRuleDef
  | DateFieldRequiredRuleDef
  | IntRangeRuleDef
  | NumOptionsSelectedRuleDef
  | RequiredRuleDef
  | DateRangeRuleDef;
