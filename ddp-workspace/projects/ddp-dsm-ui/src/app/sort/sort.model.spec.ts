import { Sort } from './sort.model';

describe('Sort', () => {
  it('should create an instance', () => {
    expect(new Sort("TEXT", null, "k", "testResult", "isCorrected", "ASC")).toBeTruthy();
  });
});
