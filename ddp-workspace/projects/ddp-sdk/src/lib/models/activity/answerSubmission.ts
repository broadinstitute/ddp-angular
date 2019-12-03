import { AnswerValue } from './answerValue';

export interface AnswerSubmission {
    stableId: string;
    answerGuid?: string | null;
    value: AnswerValue;
}
