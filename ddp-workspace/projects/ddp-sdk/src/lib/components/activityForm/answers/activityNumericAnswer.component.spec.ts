import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuestionPromptComponent } from './question-prompt/questionPrompt.component';
import { TooltipComponent } from '../../tooltip.component';
import { TranslateTestingModule } from '../../../testsupport/translateTestingModule';
import { ActivityNumericQuestionBlock } from '../../../models/activity/activityNumericQuestionBlock';
import { ActivityNumericAnswer } from './activityNumericAnswer.component';
import { MatInputModule } from '@angular/material/input';

describe('ActivityNumericAnswer', () => {
    const questionBlock = {
        answer: null,
        min: 1,
        max: 10
    } as ActivityNumericQuestionBlock;
    const mode = false;

    @Component({
        template: `
        <ddp-activity-numeric-answer [block]="block"
                                     [readonly]="false"
                                     (valueChanged)="changed($event)">
        </ddp-activity-numeric-answer>`
    })
    class TestHostComponent {
        block = questionBlock;
        readonly = mode;

        changed(value: any): void { }
    }

    let component: ActivityNumericAnswer;
    let fixture: ComponentFixture<ActivityNumericAnswer>;
    let debugElement: DebugElement;

  beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                MatInputModule,
                BrowserAnimationsModule,
                FormsModule,
                ReactiveFormsModule,
                MatTooltipModule,
                TranslateTestingModule
            ],
            declarations: [
                TestHostComponent,
                ActivityNumericAnswer,
                QuestionPromptComponent,
                TooltipComponent
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
            max: 11
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
            max: 10
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
