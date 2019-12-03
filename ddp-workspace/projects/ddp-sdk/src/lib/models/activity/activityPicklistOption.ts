export interface ActivityPicklistOption {
    stableId: string;
    optionLabel: string;
    allowDetails: boolean;
    detailLabel: string;
    exclusive: boolean;
    groupId: string | null;
}
