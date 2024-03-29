import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

import { QuestionPromptComponent } from './question-prompt/questionPrompt.component';
import { ActivityNumericQuestionBlock } from '../../../models/activity/activityNumericQuestionBlock';
import { ActivityNumericAnswer } from './activityNumericAnswer.component';
import { QuestionType } from '../../../models/activity/questionType';
import { ActivityDecimalQuestionBlock } from '../../../models/activity/activityDecimalQuestionBlock';

describe('ActivityNumericAnswer (Integer answers)', () => {
    const questionBlock = {
        answer: null,
        min: 1,
        max: 10,
        questionType: QuestionType.Numeric
    } as ActivityNumericQuestionBlock;
    let component: ActivityNumericAnswer;
    let fixture: ComponentFixture<ActivityNumericAnswer>;

  beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                MatInputModule,
                BrowserAnimationsModule,
                ReactiveFormsModule
            ],
            declarations: [
                ActivityNumericAnswer,
                QuestionPromptComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ActivityNumericAnswer);
        component = fixture.componentInstance;
        component.block = questionBlock;
        fixture.detectChanges();
    }));

    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('should init input settings', () => {
        const inputElement: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        expect(inputElement.value).toBe('');
        expect(inputElement.min).toBe('1');
        expect(inputElement.max).toBe('10');
    });

    it('should update input settings', () => {
        component.block = {
            answer: null,
            min: 0,
            max: 11,
            questionType: QuestionType.Numeric
        } as ActivityNumericQuestionBlock;
        fixture.detectChanges();
        const inputElement: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        expect(inputElement.value).toBe('');
        expect(inputElement.min).toBe('0');
        expect(inputElement.max).toBe('11');
    });

    it('should emit valid answer', () => {
        component.block = {
            answer: null,
            min: 0,
            max: 10,
            questionType: QuestionType.Numeric
        } as ActivityNumericQuestionBlock;
        spyOn(component.valueChanged, 'emit');
        fixture.detectChanges();
        const inputElement: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        component.numericField.patchValue(5);
        inputElement.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        expect(component.block.answer).toBe(5);
        expect(component.valueChanged.emit).toHaveBeenCalledWith(5);
    });
});

describe('ActivityNumericAnswer (Decimal answers)', () => {
    const questionBlock = {
        answer: { value: 235, scale: 2 },
        min: null,
        max: null,
        scale: 2,
        questionType: QuestionType.Decimal
    } as ActivityDecimalQuestionBlock;
    let component: ActivityNumericAnswer;
    let fixture: ComponentFixture<ActivityNumericAnswer>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                MatInputModule,
                BrowserAnimationsModule,
                ReactiveFormsModule
            ],
            declarations: [
                ActivityNumericAnswer,
                QuestionPromptComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ActivityNumericAnswer);
        component = fixture.componentInstance;
    }));

    it('should create', () => {
        component.block = questionBlock;
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should init input', () => {
        component.block = questionBlock;
        fixture.detectChanges();
        const inputElement: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        expect(inputElement.value).toBe('2.35');
    });

    it('should update input', () => {
        component.block = {
            answer: { value: 456, scale: 1 },
            min: 10,
            max: 99,
            scale: 2,
            questionType: QuestionType.Decimal
        } as ActivityDecimalQuestionBlock;
        fixture.detectChanges();
        const inputElement: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        expect(inputElement.value).toBe('45.60');
        expect(inputElement.min).toBe('10');
        expect(inputElement.max).toBe('99');
    });

    it('should update input if answer is null', () => {
        component.block = {
            answer: null,
            min: 0,
            max: 10,
            scale: 2,
            questionType: QuestionType.Decimal
        } as ActivityDecimalQuestionBlock;
        fixture.detectChanges();
        const inputElement: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        expect(inputElement.value).toBe('');
        expect(inputElement.min).toBe('0');
        expect(inputElement.max).toBe('10');
    });

    it('should update input with default question scale value (0)', () => {
        component.block = {
            answer: { value: 123, scale: 1 },
            min: 1,
            max: 25,
            questionType: QuestionType.Decimal
        } as ActivityDecimalQuestionBlock;
        fixture.detectChanges();
        const inputElement: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        expect(inputElement.value).toBe('12');
        expect(inputElement.min).toBe('1');
        expect(inputElement.max).toBe('25');
    });

    it('should emit valid decimal answer', () => {
        component.block = {
            answer: null,
            scale: 2,
            questionType: QuestionType.Decimal
        } as ActivityDecimalQuestionBlock;
        spyOn(component.valueChanged, 'emit');
        fixture.detectChanges();
        const inputElement: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        component.numericField.patchValue(5.27);
        inputElement.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        expect(component.block.answer).toEqual({ value: 527, scale: 2 });
        expect(component.valueChanged.emit).toHaveBeenCalledWith({ value: 527, scale: 2 });
    });
});
