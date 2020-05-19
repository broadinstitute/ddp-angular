import { InvitationCodeInputFormatter } from './invitationCodeInputFormatter';
import { TextInputState } from '../../models/textInputState';

type Formatter = (inputState: TextInputState) => TextInputState;

describe('InvitationCodeFormatterDirective', () => {
    const formatterObject = new InvitationCodeInputFormatter();
    const formatter: Formatter = new InvitationCodeInputFormatter().format;

    beforeAll(() => {
    });
    it('blank works', () => {
        expect(formatter({ value: '', selectionStart: 0 })).toEqual({ value: '', selectionStart: 0 });
    });
    it('short lowercase string ', () => {
        expect(formatter({ value: 'x', selectionStart: 1 })).toEqual({ value: 'X', selectionStart: 1 });
    });
    it('short valid string works', () => {
        expect(formatter({ value: 'X', selectionStart: 1 })).toEqual({ value: 'X', selectionStart: 1 });
    });
    it('filter out bad values, selection at end', () => {
        expect(formatter({ value: 'X%Y', selectionStart: 3 })).toEqual({ value: 'XY', selectionStart: 2 });
    });
    it('filter bad values, selection start backtracks', () => {
        expect(formatter({ value: 'XX%Y', selectionStart: 3 })).toEqual({ value: 'XXY', selectionStart: 2 });
    });
    it('paste full code', () => {
        expect(formatter({ value: 'TB2UZTANRFWN', selectionStart: 12 })).toEqual({
            value: ['TB2U', 'ZTAN', 'RFWN'].join(formatterObject.SEPARATOR),
            selectionStart: 18
        });
    });
    it('split partial code', () => {
        expect(formatter({ value: 'TB2UZTAN', selectionStart: 8 })).toEqual({
            value: ['TB2U', 'ZTAN', ''].join(formatterObject.SEPARATOR),
            selectionStart: 14
        });
    });
    it('valid code works', () => {
        expect(formatter({ value: 'ADQ8PD9 - ', selectionStart: 5 })).toEqual({ value: 'ADQ8 - PD9', selectionStart: 8 });
    });
    it('bigger insert', () => {
        expect(formatter({ value: '12B28LQ8PZA - ', selectionStart: 10 })).toEqual({ value: '12B2 - 8LQ8 - PZA', selectionStart: 16 });
    });
    it('type letter at end of chunk', () => {
        expect(formatter({ value: '12345 - ', selectionStart: 5 })).toEqual({ value: '1234 - 5', selectionStart: 8 });
    });
    it('Big paste with bad characters', () => {
        const value = '123_45*6789&01#2';
        expect(formatter({ value, selectionStart: value.length }))
            .toEqual({ value: '1234 - 5678 - 9012', selectionStart: 18 });
    });
    it('type last letter in chunk, end up on other side of separator', () => {
        expect(formatter({ value: '1234', selectionStart: 4 })).toEqual({ value: '1234 - ', selectionStart: 7 });
    });
    it('backspace removes first char in chunk', () => {
        expect(formatter({ value: '1234 -', selectionStart: 6, isBackSpace: true })).toEqual({ value: '1234 - ', selectionStart: 4 });
    });
    it('filter leaves cursor at last position if cursor', () => {
        expect(formatterObject.filter('1 -', 3)).toEqual({ value: '1', selectionStart: 1 });
    });
    it('easy filter', () => {
        expect(formatterObject.filter('1&', 2)).toEqual({ value: '1', selectionStart: 1 });
    });
    it('filter with cursor before end', () => {
        expect(formatterObject.filter('1&', 1)).toEqual({ value: '1', selectionStart: 1 });
    });

  it('filter with cursor before end', () => {
    expect(formatterObject.filter('12345 - X8', 8)).toEqual({ value: '12345X8', selectionStart: 5 });
  });

  it('filter with cursor before end', () => {
    expect(formatterObject.filter('1 - X8', 4)).toEqual({ value: '1X8', selectionStart: 1 });
  });

  it('format and addding chunk from border', () => {
    expect(formatterObject.addSeparator('1234ZA56', 5)).toEqual({ value: '1234 - ZA56 - ', selectionStart: 8 });
  });
  it('format after hitting backspace on last character', () => {
    expect(formatterObject.addSeparator('XB28LQ8PZNH', 11, true)).toEqual({ value: 'XB28 - LQ8P - ZNH', selectionStart: 17 });
  });


  it('play with default parame', () => {
    const playFunction = (arg: boolean = false) => {
      expect(arg).toBe(true);
    };
    const valObject = {booleanInQuestion: true};
    playFunction(valObject.booleanInQuestion);
  });

});
