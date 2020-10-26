export interface ActivityPicklistOption {
    stableId: string;
    optionLabel: string;
    allowDetails: boolean;
    detailLabel: string;
    exclusive: boolean;
    tooltip: string | null;
    groupId: string | null;
    subPicklistOptionsLabel: string | null;
    subPicklistOptions: Array<ActivityPicklistOption> | null;
}
