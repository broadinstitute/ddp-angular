import { ActivityPicklistOption, ActivityPicklistNormalizedGroup } from 'ddp-sdk';

export interface PicklistParameters {
    readonly: boolean;
    shown: true;
    options: Array<ActivityPicklistOption>;
    renderMode: string;
    selectMode: string;
    groups: Array<ActivityPicklistNormalizedGroup>;
    detailMaxLength: number;
    picklistLabel: string;
}
