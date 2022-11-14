import { TestBed } from '@angular/core/testing';

import { ParticipantProfileServiceAgentService } from './participant-profile-service-agent.service';

describe('ParticipantProfileServiceAgentService', () => {
  let service: ParticipantProfileServiceAgentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParticipantProfileServiceAgentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
