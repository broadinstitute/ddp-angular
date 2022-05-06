import * as _ from 'underscore';
import { DecimalAnswer } from '../models/activity/decimalAnswer';
import { NumericAnswerType } from '../models/activity/numericAnswerType';

export class DecimalHelper {
    static mapDecimalAnswerToNumber(answer: DecimalAnswer): number {
        return answer.value * Math.pow(10, -(answer.scale));
    }

    static isDecimalAnswerType(obj: any): boolean {
        return obj && _.isNumber(obj.value) && _.isNumber(obj.scale);
    }

    static formatDecimalAnswer(answer: NumericAnswerType, decimalPartScale: number, keepDecimalPart: boolean): string {
        const answerAsNumber = _.isNumber(answer) ? answer : DecimalHelper.mapDecimalAnswerToNumber(answer as DecimalAnswer);
        let [
            // eslint-disable-next-line prefer-const
            integerPart = '0',
            decimalPart = '0'.repeat(decimalPartScale)
        ] = String(answerAsNumber).split('.');

        if (decimalPart.length < decimalPartScale) {
            decimalPart += '0'.repeat(decimalPartScale - decimalPart.length);
        }

        decimalPart = decimalPartScale ?
            `.${decimalPart.slice(0, decimalPartScale)}` :
            (keepDecimalPart ? `.${decimalPart}` : '');

        return integerPart + decimalPart;
    }
}
