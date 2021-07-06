import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
    WindowRef,
    ValidationMessage,
    ActivityQuestionComponent,
    SubmissionManager,
    ConfigurationService,
    ActivityPicklistQuestionBlock,
    ActivityTextQuestionBlock
} from 'ddp-sdk';
import { InputType } from '../../../models/activity/inputType';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { getTestScheduler, hot } from 'jasmine-marbles';
import { By } from '@angular/platform-browser';
import { ActivityLengthValidationRule } from '../../../services/activity/validators/activityLengthValidationRule';
import { TranslateTestingModule } from '../../../testsupport/translateTestingModule';
import { ActivityAbstractValidationRule } from '../../../services/activity/validators/activityAbstractValidationRule';

@Component({
    selector: 'ddp-activity-answer',
    template: `
        <div></div>`
})
class FakeActivityActivityAnswerComponent {
    @Output() valueChanged = new EventEmitter();
    @Input() block;
    @Input() readonly;
    @Input() validationRequested;
    @Input() studyGuid;
    @Input() activityGuid;
}

describe('ActivityQuestionComponent', () => {
    let component: ActivityQuestionComponent;
    let answerComponentFixture: DebugElement;
    let answerComponent: FakeActivityActivityAnswerComponent;
    let fixture: ComponentFixture<ActivityQuestionComponent>;
    const submissionManagerSpy = new SubmissionManager(null);
    let submissionResponseSpy: jasmine.Spy;
    let windowRefSpy: jasmine.SpyObj<WindowRef>;
    let configServiceSpy: jasmine.SpyObj<ConfigurationService>;

    beforeEach(waitForAsync(() => {
        windowRefSpy = jasmine.createSpyObj('WindowRef', ['nativeWindow']);
        configServiceSpy = jasmine.createSpyObj('ddp.config', ['scrollToErrorOffset']);
        TestBed.configureTestingModule({
            declarations: [
                ActivityQuestionComponent,
                ValidationMessage,
                FakeActivityActivityAnswerComponent
            ],
            providers: [
                { provide: SubmissionManager, useValue: submissionManagerSpy },
                { provide: WindowRef, useValue: windowRefSpy },
                { provide: 'ddp.config', useValue: configServiceSpy }
            ],
            imports: [
                HttpClientTestingModule,
                TranslateTestingModule
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ActivityQuestionComponent);
        component = fixture.componentInstance;
        const block = new ActivityTextQuestionBlock();
        block.inputType = InputType.Text;
        block.shown = true;
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

    it('expect block validation to appear and disappear', fakeAsync(() => {
        const block = new ActivityTextQuestionBlock();
        block.stableId = '123';
        block.inputType = InputType.Text;
        block.shown = true;
        component.block = block;
        component.ngOnInit();
        // these tick(1) needed because of delay(0) used in message observable definition
        tick(1);
        fixture.detectChanges();
        // we start with no message
        expect(getValidationMessageFixture()).toBeFalsy();
        block.serverValidationMessages = ['Message!!!'];
        component.block = block;
        tick(1);
        fixture.detectChanges();

        // we have a message from initial load
        expect(getValidationMessageFixture()).toBeTruthy();
        component.validationRequested = true;
        fixture.detectChanges();

        block.serverValidationMessages = [];
        tick(1);
        fixture.detectChanges();
        // triggered internal validation. Since Validation rules exist, message is cleared
        expect(getValidationMessageFixture()).toBeFalsy();
        block.serverValidationMessages = ['Wrong!!!'];
        tick(1);
        fixture.detectChanges();
        expect(getValidationMessageFixture()).toBeTruthy();
    }));

    it('expect block validation to appear and disappear some more', fakeAsync(() => {
        const block = new ActivityTextQuestionBlock();
        block.stableId = '123';
        block.inputType = InputType.Text;
        block.shown = true;
        component.block = block;
        const rule = new ActivityLengthValidationRule(block, null, 3);
        rule.message = 'Too long!';
        block.validators.push(rule);
        component.ngOnInit();
        tick(1);
        fixture.detectChanges();
        // we start with no message
        expect(getValidationMessageFixture()).toBeFalsy();
        block.answer = 'Too long an answer';
        component.validationRequested = true;
        tick(1);
        fixture.detectChanges();
        expect(getValidationMessageFixture()).toBeTruthy();
    }));

    it('expect block validation to appear for validator which returns object as result', fakeAsync(() => {
        const block = new ActivityPicklistQuestionBlock();
        block.shown = true;
        component.block = block;
        const rule = {
            recalculate(): boolean {
                this.result = { message: 'some message', params: { control: 'control' } };
                return false;
            }
        } as ActivityAbstractValidationRule;
        block.validators.push(rule);
        component.ngOnInit();
        tick(1);
        fixture.detectChanges();
        // we start with no message
        expect(getValidationMessageFixture()).toBeFalsy();
        block.answer = [{ detail: 'custom', stableId: null }];
        component.validationRequested = true;
        tick(1);
        fixture.detectChanges();
        expect(getValidationMessageFixture()).toBeTruthy();
    }));

    it('expect patch response not to trigger message', fakeAsync(() => {
        const block = new ActivityTextQuestionBlock();
        block.stableId = '123';
        block.inputType = InputType.Text;
        block.shown = true;
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
                {
                    a: ({
                        answers: [{ stableId: block.stableId, answerGuid: '321' }],
                        blockVisibility: []
                    })
                }));
        component.ngOnInit();
        getTestScheduler().flush();
        fixture.detectChanges();
        tick(1);
        expect(getValidationMessageFixture()).toBeFalsy();
    }));

    const getValidationMessageFixture = () => fixture.debugElement.query(By.directive(ValidationMessage));
    const getAnswerComponentFixture = () => fixture.debugElement.query(By.css('ddp-activity-answer'));
});
