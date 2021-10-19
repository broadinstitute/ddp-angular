import { FormType } from './formType';
import { ListStyleHint } from './listStyleHint';
import { FormSectionDef } from './formSectionDef';
import { Template } from './template';
import { DateString } from './dateString';
import { AbstractActivityDef } from './abstractActivityDef';

export interface AbstractFormActivityDef extends AbstractActivityDef {
  formType: FormType;
  listStyleHint: ListStyleHint;
  introduction: FormSectionDef | null;
  closing: FormSectionDef | null;
  sections: Array<FormSectionDef>;
  lastUpdatedTextTemplate?: Template | null;
  lastUpdated?: DateString | null;
  snapshotSubstitutionsOnSubmit: boolean;
}
