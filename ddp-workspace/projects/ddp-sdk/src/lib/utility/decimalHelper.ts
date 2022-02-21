import { DecimalAnswer } from '../models/activity/decimalAnswer';
import * as _ from 'underscore';

export  class DecimalHelper {
    static mapDecimalAnswerToNumber(answer: DecimalAnswer ): number {
        return answer.value * Math.pow(10, -(answer.scale));
    }

    static isDecimalAnswerType(obj: any): boolean {
        return obj && _.isNumber(obj.value) && _.isNumber(obj.scale);
    }
}
