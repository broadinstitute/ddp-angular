export interface ActivityPicklistOption {
    stableId: string;
    optionLabel: string;
    allowDetails: boolean;
    detailLabel: string;
    exclusive: boolean;
    tooltip: string | null;
    groupId: string | null;
    nestedOptionsLabel: string | null;
    nestedPicklistOptions: Array<ActivityPicklistOption> | null;
}
