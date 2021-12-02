import { Template } from './template';
import { PicklistOptionDef } from './picklistOptionDef';

export interface PicklistGroupDef {
    stableId: string;
    nameTemplate: Template;
    options: Array<PicklistOptionDef>;
}
