import { Template } from './template';

export interface PicklistOptionDef {
  stableId: String;
  optionLabelTemplate: Template;
  tooltipTemplate?: Template;
  detailLabelTemplate?: Template;
  allowDetails?: boolean;
  exclusive?: boolean;
}
