import { AnswerResponse } from './answerResponse';
import { BlockVisibility } from './blockVisibility';
import { ValidationFailure } from './validationFailure';

export interface PatchAnswerResponse {
    answers: Array<AnswerResponse>;
    blockVisibility: Array<BlockVisibility>;
    validationFailures?: Array<ValidationFailure>;
}
