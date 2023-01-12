import {DateRangeErrorPipe} from './dateRangeError.pipe';
import {DateRangeErrorMessages} from './constants/dateRange-error.messages';
import {expect} from '@angular/flex-layout/_private-utils/testing';

describe('dateRangeError Pipe', () => {
  const pipe = new DateRangeErrorPipe();
  const {startDate, endDate} = DateRangeErrorMessages;

  it('Should return startDate error messages accordingly', () => {
    const startDateErrors = Object.entries(startDate);

    startDateErrors.forEach(([errorKey, errorMsg]: [string, string]) =>
      expect(pipe.transform(errorKey, 'startDate')).toEqual(errorMsg));
  });

  it('Should return endDate error messages accordingly', () => {
    const endDateErrors = Object.entries(endDate);

    endDateErrors.forEach(([errorKey, errorMsg]: [string, string]) =>
      expect(pipe.transform(errorKey, 'endDate')).toEqual(errorMsg));
  });

});
