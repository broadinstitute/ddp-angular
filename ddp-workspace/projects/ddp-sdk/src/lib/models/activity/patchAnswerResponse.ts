import { AnswerResponse } from './answerResponse';
import { BlockVisibility } from './blockVisibility';
import { ValidationFailure } from './validationFailure';
import { AnswerResponseEquation } from './answerResponseEquation';

export interface PatchAnswerResponse {
    answers: Array<AnswerResponse>;
    blockVisibility: Array<BlockVisibility>;
    validationFailures?: Array<ValidationFailure>;
    equations?: Array<AnswerResponseEquation>;
}
