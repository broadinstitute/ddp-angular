import {NoDataPipe} from './noData.pipe';
import {expect} from '@angular/flex-layout/_private-utils/testing';

describe('noData Pipe', () => {
  const pipe = new NoDataPipe();

  /*
    Checking if in case of particular type of values, it returns exactly the same value (In case of 0, it returns "0")
   */
  it('Should return value', () => {
    const diffData = [5, 'ddp', '5', 0, true];
    diffData.forEach(value => expect(pipe.transform(value)).toEqual(value === 0 ? value.toString() : value));
  });

  /*
    Checking if in case of falsy value, it returns non-breaking space, in order to display
    empty space properly in HTML
   */
  it('Should return empty space', () => {
    const falsyValues = ['', false, undefined, null];
    const nonBreakingSpace = String.fromCharCode(160);
    falsyValues.forEach(value => expect(pipe.transform(value)).toEqual(nonBreakingSpace));
  });

});
