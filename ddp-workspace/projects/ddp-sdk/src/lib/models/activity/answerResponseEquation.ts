import { DecimalAnswer } from './decimalAnswer';

export interface AnswerResponseEquation {
    stableId: string;
    values: Array<DecimalAnswer>;
}
