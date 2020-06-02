export interface ActivityInstance {
    instanceGuid: string;
    activityName: string;
    activityTitle: string;
    activitySubtitle: string | null;
    activityType: string;
    activitySubtype: string;
    activityCode: string;
    activitySummary: string;
    statusCode: string;
    icon: string;
    createdAt: number;
    readonly: boolean;
    numQuestions: number;
    numQuestionsAnswered: number;
}
