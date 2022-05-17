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
        expect(DecimalHelper.isDecimalAnswerType({value: {}, scale: null})).toBeFalsy();
        expect(DecimalHelper.isDecimalAnswerType({value: -12})).toBeFalsy();
        expect(DecimalHelper.isDecimalAnswerType({scale: 5})).toBeFalsy();

        expect(DecimalHelper.isDecimalAnswerType({value: 457, scale: 5})).toBeTrue();
        expect(DecimalHelper.isDecimalAnswerType({value: 0, scale: 0})).toBeTrue();
    });

    it('should format decimal answer to display value (equation question cases)', () => {
        expect(DecimalHelper.formatDecimalAnswer({value: 12345, scale: 4 }, 2, true)).toBe('1.23');
        expect(DecimalHelper.formatDecimalAnswer({value: 56789, scale: 4 }, undefined, true)).toBe('5.6789');
    });

    it('should format decimal answer to display value (decimal question cases)', () => {
        expect(DecimalHelper.formatDecimalAnswer({value: 12345, scale: 4 }, 2, false)).toBe('1.23');
        expect(DecimalHelper.formatDecimalAnswer(56.789, 2, false)).toBe('56.78');
        expect(DecimalHelper.formatDecimalAnswer({value: 12345, scale: 2 }, undefined, false)).toBe('123');
    });
});
