import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ActivityBooleanQuestionBlock } from '../../../models/activity/activityBooleanQuestionBlock';
import { ActivityBooleanAnswer } from './activityBooleanAnswer.component';
import { QuestionPromptComponent } from './question-prompt/questionPrompt.component';
import { TooltipComponent } from '../../tooltip.component';
import { TranslateTestingModule } from '../../../testsupport/translateTestingModule';
import { BooleanRenderMode } from '../../../models/activity/booleanRenderMode';

describe('ActivityBooleanAnswer', () => {
    const RENDER_MODE = BooleanRenderMode;
    const questionBlock = {
        answer: null,
        question: 'Are you agree?',
        stableId: 'BOOLEAN_ANSWER',
        trueContent: 'Yes',
        falseContent: 'No',
        renderMode: RENDER_MODE.RADIO_BUTTONS,
    } as ActivityBooleanQuestionBlock;
    const mode = false;
    @Component({
        template: `
        <ddp-activity-boolean-answer [block]="block"
                                     [readonly]="readonly"
                                     (valueChanged)="changed($event)">
        </ddp-activity-boolean-answer>`
    })
    class TestHostComponent {
        block = questionBlock;
        readonly = mode;

        changed(value: any): void { }
    }

    let component: ActivityBooleanAnswer;
    let fixture: ComponentFixture<ActivityBooleanAnswer>;
    let debugElement: DebugElement;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                MatRadioModule,
                BrowserAnimationsModule,
                FormsModule,
                MatTooltipModule,
                TranslateTestingModule
            ],
            declarations: [
                TestHostComponent,
                ActivityBooleanAnswer,
                QuestionPromptComponent,
                TooltipComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ActivityBooleanAnswer);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        component.block = questionBlock;
        fixture.detectChanges();
    }));

    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('should render radio buttons and question', () => {
        const text = debugElement.queryAll(By.css('span'));
        const radioButtons = debugElement.queryAll(By.css('mat-radio-button'));
        const radioGroup = debugElement.queryAll(By.css('mat-radio-group'));
        expect(radioButtons.length).toBe(2);
        expect(radioGroup.length).toBe(1);
        expect(text[0].properties.innerHTML).toBe(questionBlock.question);
    });

    it('should add test attribute', () => {
        const radioGroup = debugElement.queryAll(By.css('mat-radio-group'))[0];
        expect(radioGroup.nativeElement.getAttribute('data-ddp-test')).toBe('answer:BOOLEAN_ANSWER');
    });

    it('should change answer by click', () => {
        const radioButtons = debugElement.queryAll(By.css('mat-radio-button'));
        const yesInputElement = radioButtons[0].nativeElement.querySelector('input') as HTMLInputElement;
        const noInputElement = radioButtons[1].nativeElement.querySelector('input') as HTMLInputElement;
        yesInputElement.click();
        expect(yesInputElement.checked).toBe(true);
        expect(noInputElement.checked).toBe(false);
        expect(component.block.answer).toBe(true);
        noInputElement.click();
        expect(yesInputElement.checked).toBe(false);
        expect(noInputElement.checked).toBe(true);
        expect(component.block.answer).toBe(false);
    });
});
