export interface ActivityInstance {
    instanceGuid: string;
    activityName: string;
    activityType: string;
    activitySubtype: string;
    activityDashboardName: string | null;
    activitySubtitle: string | null;
    activityCode: string;
    activitySummary: string;
    statusCode: string;
    icon: string;
    createdAt: number;
    readonly: boolean;
}
