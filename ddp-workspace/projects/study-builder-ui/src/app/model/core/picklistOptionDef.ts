import { Template } from './template';

export interface PicklistOptionDef {
    stableId: string;
    optionLabelTemplate: Template;
    tooltipTemplate?: Template;
    detailLabelTemplate?: Template;
    allowDetails?: boolean;
    exclusive?: boolean;
    nestedOptions?: PicklistOptionDef[];
    nestedOptionsLabel?: string;
}
