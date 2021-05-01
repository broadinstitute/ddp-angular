import { AbstractFormActivityDef } from './abstractFormActivityDef';

export interface BasicActivityDef extends AbstractFormActivityDef {
  formType: 'GENERAL' | 'PREQUALIFIER';
}
