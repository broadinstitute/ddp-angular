import { TestBed } from '@angular/core/testing';

import { StudyConfigParserService } from './study-config-parser.service';
import { TestBostonConsent } from '../testdata/testbostonConsent';
import { ConsentActivityDef } from '../model/core/consentActivityDef';

describe('StudyConfigParserService', () => {
  let service: StudyConfigParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudyConfigParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('check json', () => {
    const consent: ConsentActivityDef = TestBostonConsent;
  });
});
