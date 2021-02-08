import { ActivityInstance } from 'ddp-sdk';

export interface ActivitySummary extends ActivityInstance {
    canDelete: boolean;
    parentInstanceGuid?: string;
}
