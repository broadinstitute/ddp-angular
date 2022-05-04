import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { QuestionType } from '../../../../models/activity/questionType';
import { ActivityEquationQuestionBlock } from '../../../../models/activity/activityEquationQuestionBlock';
import { ActivityEquationAnswerComponent } from './activityEquationAnswer.component';
import { QuestionPromptComponent } from '../question-prompt/questionPrompt.component';
import { SubmissionManager } from '../../../../services/serviceAgents/submissionManager.service';

describe('ActivityEquationAnswerComponent', () => {
    const questionBlock = {
        answer: null,
        maximumDecimalPlaces: 2,
        question: 'Equation question title',
        questionType: QuestionType.Equation
    } as ActivityEquationQuestionBlock;

    let component: ActivityEquationAnswerComponent;
    let fixture: ComponentFixture<ActivityEquationAnswerComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
                declarations: [
                    ActivityEquationAnswerComponent,
                    QuestionPromptComponent
                ],
                providers: [
                    // TODO: add more tests for updating equations from answerSubmission
                    { provide: SubmissionManager, useValue: {answerSubmissionResponse$: of([])  } }
                ]
            })
            .compileComponents();

        fixture = TestBed.createComponent(ActivityEquationAnswerComponent);
        component = fixture.componentInstance;
        component.block = questionBlock;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have valid prompt', () => {
        const promptElement: HTMLElement = fixture.debugElement.query(By.css('.ddp-question-prompt')).nativeElement;
        expect(promptElement.innerText).toBe('Equation question title');
    });

    it('should not have equation value initially', () => {
        const equationValueElement: HTMLElement = fixture.debugElement.query(By.css('.equation-value')).nativeElement;
        expect(equationValueElement.innerText).toBe('');
    });

    it('should have an initial equation value', () => {
        component.block = {
           ...questionBlock,
           answer: [{value: 12345, scale: 4}]
        } as ActivityEquationQuestionBlock;
        fixture.detectChanges();

        const equationValueElement: HTMLElement = fixture.debugElement.query(By.css('.equation-value')).nativeElement;
        expect(equationValueElement.innerText).toBe('1.23');
    });

    it('should have a formatted equation value', () => {
        component.block = {
            ...questionBlock,
            maximumDecimalPlaces: 3,
            answer: [{value: 12345, scale: 4}]
        } as ActivityEquationQuestionBlock;
        fixture.detectChanges();

        const equationValueElement: HTMLElement = fixture.debugElement.query(By.css('.equation-value')).nativeElement;
        expect(equationValueElement.innerText).toBe('1.234');
    });

    it('should have a formatted equation value when maximumDecimalPlaces field is not set', () => {
        component.block = {
            answer: [{value: 12345, scale: 4}],
            question: 'Equation question title',
            questionType: QuestionType.Equation
        } as ActivityEquationQuestionBlock;
        fixture.detectChanges();

        const equationValueElement: HTMLElement = fixture.debugElement.query(By.css('.equation-value')).nativeElement;
        expect(equationValueElement.innerText).toBe('1.2345');
    });
});
