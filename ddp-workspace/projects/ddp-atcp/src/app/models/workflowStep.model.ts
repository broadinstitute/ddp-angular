export interface WorkflowStep {
    number: number;
    name: string;
    activityCodes: Array<string>;
    isCompleted: boolean;
}
