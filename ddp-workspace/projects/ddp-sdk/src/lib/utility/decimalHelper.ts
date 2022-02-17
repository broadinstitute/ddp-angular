import { DecimalAnswer } from '../models/activity/decimalAnswer';

export  class DecimalHelper {
    static mapDecimalAnswerToNumber(answer: DecimalAnswer ): number {
        return answer.value * Math.pow(10, -(answer.scale));
    }

    static isDecimalAnswerType(obj: any): boolean {
        return obj?.value && !!obj.scale;
    }
}
