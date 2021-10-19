import { PexExpression } from './pexExpression';
import { Template } from './template';

export interface ActivityValidation {
  messageTemplate: Template;
  precondition?: PexExpression | null;
  expression: PexExpression;
  stableIds: Array<string>;

}
