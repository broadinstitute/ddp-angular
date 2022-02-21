import { DecimalHelper } from './decimalHelper';

describe('DecimalHelper', () => {
    it('should map decimalAnswer to number (scale is not null)', () => {
        expect(DecimalHelper.mapDecimalAnswerToNumber({value: 123, scale: 2})).toBe(1.23);
    });

    it('should map decimalAnswer to number (scale is null)', () => {
        expect(DecimalHelper.mapDecimalAnswerToNumber({value: 456, scale: 0})).toBe(456);
    });

    it('should check if an answer has decimal type', () => {
        expect(DecimalHelper.isDecimalAnswerType(null)).toBeFalsy();
        expect(DecimalHelper.isDecimalAnswerType(undefined)).toBeFalsy();
        expect(DecimalHelper.isDecimalAnswerType(0)).toBeFalsy();
        expect(DecimalHelper.isDecimalAnswerType('some answer')).toBeFalsy();
        expect(DecimalHelper.isDecimalAnswerType({customProperty: 1})).toBeFalsy();
        expect(DecimalHelper.isDecimalAnswerType({value: -12})).toBeFalsy();
        expect(DecimalHelper.isDecimalAnswerType({scale: 5})).toBeFalsy();
        expect(DecimalHelper.isDecimalAnswerType({value:457, scale: 5})).toBeTrue();
    });
});
