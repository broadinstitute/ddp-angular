import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EnrollmentComponent } from './enrollment.component';
import {
  SessionMementoService,
  SubjectInvitationServiceAgent,
  UserProfileServiceAgent,
  WorkflowServiceAgent
} from 'ddp-sdk';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkflowBuilderService } from 'toolkit';

describe('EnrollmentComponent', () => {
  let fixture: ComponentFixture<EnrollmentComponent>;
  let component: EnrollmentComponent;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
          { provide: SessionMementoService, useValue: { session: { } } },
          { provide: UserProfileServiceAgent, useValue: {} },
          { provide: WorkflowServiceAgent, useValue: {} },
          { provide: WorkflowBuilderService, useValue: {} },
          { provide: SubjectInvitationServiceAgent, useValue: {} },
      ],
      declarations: [EnrollmentComponent],
    })
        .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentComponent);
    component = fixture.debugElement.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});
