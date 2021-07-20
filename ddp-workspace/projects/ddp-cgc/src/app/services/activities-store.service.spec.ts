import { TestBed } from '@angular/core/testing';

import { ActivitiesStoreService } from './activities-store.service';

describe('ActivitiesStoreService', () => {
  let service: ActivitiesStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivitiesStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
