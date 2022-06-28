import { CohortTag } from './cohort-tag.model';

describe('CohortTag', () => {
  it('should create an instance', () => {
    expect(new CohortTag('TestTag', 'TestGUID', 999)).toBeTruthy();
  });
});
