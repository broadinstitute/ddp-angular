import { TestBed } from '@angular/core/testing';

import { ActivityDefinitionEditorService } from './activity-definition-editor.service';

describe('ActivityDefinitionEditorService', () => {
  let service: ActivityDefinitionEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityDefinitionEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
