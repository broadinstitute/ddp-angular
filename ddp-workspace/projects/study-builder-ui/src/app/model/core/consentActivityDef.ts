import { PexExpression } from './pexExpression';
import { ConsentElectionDef } from './consentElectionDef';
import { AbstractFormActivityDef } from './abstractFormActivityDef';

export interface ConsentActivityDef extends AbstractFormActivityDef {
  formType: 'CONSENT';
  consentedExpr: PexExpression;
  elections: Array<ConsentElectionDef>;
}
