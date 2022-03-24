import { AnswerSubmissionErrorType } from './answerSubmissionErrorType';

export class AnswerSubmissionError extends Error {
    constructor(
        public errorType: AnswerSubmissionErrorType,
        public originError: Error
    ) {
        super('AnswerSubmissionError ' + originError.message ?? '');
    }
}
