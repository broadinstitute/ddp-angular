import { AnswerSubmission } from './answerSubmission';

export interface ActivityInstanceAnswerSubmission extends AnswerSubmission {
    studyGuid: string;
    activityInstanceGuid: string;
    blockGuid: string;
}
