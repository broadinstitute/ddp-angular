import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { EmbeddedActivityBlockComponent } from './embeddedActivityBlock.component';
import { ActivityForm, ActivityServiceAgent, LoggingService, SubmitAnnouncementService } from 'ddp-sdk';
import { ModalService } from '../../../../services/modal.service';

describe('EmbeddedActivityBlockComponent', () => {
  let component: EmbeddedActivityBlockComponent;
  let fixture: ComponentFixture<EmbeddedActivityBlockComponent>;
  let activityServiceAgentSpy: jasmine.SpyObj<ActivityServiceAgent>;
  let loggingServiceSpy: jasmine.SpyObj<LoggingService>;
  const submitAnnounceService = new SubmitAnnouncementService();

  beforeEach(async() => {
    activityServiceAgentSpy = jasmine.createSpyObj('ActivityServiceAgent', ['getActivity']);
    activityServiceAgentSpy.getActivity.and.returnValue(of(new ActivityForm()));
    loggingServiceSpy = jasmine.createSpyObj('LoggingService', ['logError']);
    await TestBed.configureTestingModule({
      declarations: [ EmbeddedActivityBlockComponent ],
      providers: [
        {provide: ActivityServiceAgent, useValue: activityServiceAgentSpy},
        {provide: LoggingService, useValue: loggingServiceSpy},
        {provide: SubmitAnnouncementService, useValue: submitAnnounceService},
        {provide: MatDialog, useValue: {}},
        ModalService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbeddedActivityBlockComponent);
    component = fixture.componentInstance;
    component.instance = {
      activityCode: '',
      activityDescription: '',
      activityName: '',
      activitySubtitle: undefined,
      activitySubtype: '',
      activitySummary: '',
      activityTitle: '',
      activityType: '',
      canDelete: false,
      instanceGuid: 'xxx',
      isFollowup: false,
      isHidden: false,
      numQuestions: 0,
      numQuestionsAnswered: 0,
      readonly: false,
      statusCode: ''
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
