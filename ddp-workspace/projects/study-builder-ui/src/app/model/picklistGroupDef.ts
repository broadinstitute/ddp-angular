import { Template } from './template';
import { PicklistOptionDef } from './picklistOptionDef';

export interface PicklistGroupDef {
  stableId: String;
  nameTemplate: Template;
  options: Array<PicklistOptionDef>;
}
