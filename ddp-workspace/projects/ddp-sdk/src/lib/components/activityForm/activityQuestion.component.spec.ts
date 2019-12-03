import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivityTextQuestionBlock, WindowRef } from 'ddp-sdk';
import { InputType } from '../../models/activity/inputType';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { ValidationMessage } from '../validationMessage.component';
import { ActivityQuestionComponent } from './activityQuestion.component';
import { SubmissionManager } from '../../services/serviceAgents/submissionManager.service';
import { getTestScheduler, hot } from 'jasmine-marbles';
import { By } from '@angular/platform-browser';
import { ActivityLengthValidationRule } from '../../services/activity/validators/activityLengthValidationRule';

@Component({
  selector: 'ddp-activity-answer',
  template: `
    <div></div>`
})
class FakeActivityActivityAnswerComponent {
  @Output()valueChanged = new EventEmitter();
  @Input()block;
  @Input()readonly;
  @Input()validationRequested;
}

describe('ActivityQuestionComponent', () => {
  let component: ActivityQuestionComponent;
  let answerComponentFixture: DebugElement;
  let answerComponent: FakeActivityActivityAnswerComponent;
  let fixture: ComponentFixture<ActivityQuestionComponent>;
  const submissionManagerSpy = new SubmissionManager(null);
  let submissionResponseSpy: jasmine.Spy;
  let windowRefSpy: jasmine.SpyObj<WindowRef>;

  beforeEach(async(() => {
    windowRefSpy = jasmine.createSpyObj('WindowRef', ['nativeWindow']);
    TestBed.configureTestingModule({
      declarations: [ActivityQuestionComponent, ValidationMessage, FakeActivityActivityAnswerComponent],
      providers: [{provide: SubmissionManager, useValue: submissionManagerSpy}, {provide: WindowRef, useValue: windowRefSpy}],
      imports: [HttpClientTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityQuestionComponent);
    component = fixture.componentInstance;
    const block = new ActivityTextQuestionBlock();
    block.inputType = InputType.Text;
    component.block = block;
    component.readonly = false;
    answerComponentFixture = getAnswerComponentFixture();
    answerComponent = answerComponentFixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(answerComponentFixture).toBeTruthy();
    expect(answerComponent).toBeTruthy();
  });
  it('expect block validation to appear and disappear',  fakeAsync(() => {
    const block = new ActivityTextQuestionBlock();
    block.stableId = '123';
    block.inputType = InputType.Text;
    component.block = block;
    component.ngOnInit();
    fixture.detectChanges();
    // we start with no message
    expect(getValidationMessageFixture()).toBeFalsy();
    block.serverValidationMessages = ['Message!!!'];
    component.block = block;
    fixture.detectChanges();

    // we have a message from initial load
    expect(getValidationMessageFixture()).toBeTruthy();
    component.validationRequested = true;
    fixture.detectChanges();

    block.serverValidationMessages = [];

    fixture.detectChanges();
    // triggered internal validation. Since Validation rules exist, message is cleared
    expect(getValidationMessageFixture()).toBeFalsy();
    block.serverValidationMessages = ['Wrong!!!'];
    fixture.detectChanges();
    expect(getValidationMessageFixture()).toBeTruthy();
  }));

  it('expect block validation to appear and disappear some more',  fakeAsync(() => {
    const block = new ActivityTextQuestionBlock();
    block.stableId = '123';
    block.inputType = InputType.Text;
    component.block = block;
    const rule = new ActivityLengthValidationRule(block, null, 3);
    rule.message = 'Too long!';
    block.validators.push(rule);
    component.ngOnInit();
    fixture.detectChanges();
    // we start with no message
    expect(getValidationMessageFixture()).toBeFalsy();
    block.answer = 'Too long an answer';
    component.validationRequested = true;
    fixture.detectChanges();
    expect(getValidationMessageFixture()).toBeTruthy();
  }));

  it('expect patch response not to trigger message',  fakeAsync(() => {
    const block = new ActivityTextQuestionBlock();
    block.stableId = '123';
    block.inputType = InputType.Text;
    component.block = block;
    component.ngOnInit();
    fixture.detectChanges();
    submissionResponseSpy = spyOnProperty(submissionManagerSpy, 'answerSubmissionResponse$', 'get');
    // stub patch so things don't break
    spyOn(submissionManagerSpy, 'patchAnswer');
    // we start with no message
    expect(getValidationMessageFixture()).toBeFalsy();
    submissionResponseSpy.and.returnValue(
      hot('-a',
        {a:
            ({answers: [{stableId: block.stableId, answerGuid: '321'}],
              blockVisibility: []})}));
    component.ngOnInit();
    getTestScheduler().flush();
    tick();
    fixture.detectChanges();
    expect(getValidationMessageFixture()).toBeFalsy();
  }));

  const getValidationMessageFixture = () => fixture.debugElement.query(By.directive(ValidationMessage));
  const getAnswerComponentFixture = () => fixture.debugElement.query(By.css('ddp-activity-answer'));
});
