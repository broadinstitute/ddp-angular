export interface ActivityInstance { // Activity.Summary for Family History is the same
    instanceGuid: string;
    activityName: string;
    activityTitle: string;
    activitySubtitle: string | null;
    activityType: string;
    activitySubtype: string;
    activityCode: string;
    activitySummary: string;
    activityDescription: string;
    statusCode: string;
    icon?: string;
    createdAt?: number;
    readonly: boolean;
    numQuestions: number;
    numQuestionsAnswered: number;
    isFollowup: boolean;
    isHidden: boolean;
    previousInstanceGuid?: string | null;
    canDelete: boolean;
    parentInstanceGuid?: string;
}
