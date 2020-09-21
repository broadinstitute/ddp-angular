import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { By } from '@angular/platform-browser';
import { ActivityAgreementQuestionBlock } from '../../models/activity/activityAgreementQuestionBlock';
import { ActivityAgreementAnswer } from './activityAgreementAnswer.component';
import { FormsModule } from '@angular/forms';

fdescribe('ActivityAgreementAnswer', () => {
    const questionBlock = {
        answer: null,
        isRequired: false,
        question: 'I am agree!'
    } as ActivityAgreementQuestionBlock;
    const mode = false;

    @Component({
        template: `
        <ddp-activity-agreement-answer [block]="block"
                                       [readonly]="readonly"
                                       (valueChanged)="changed($event)">
        </ddp-activity-agreement-answer>`
    })
    class TestHostComponent {
        block = questionBlock;
        readonly = mode;

        changed(value: any): void { }
    }

    let component: ActivityAgreementAnswer;
    let fixture: ComponentFixture<ActivityAgreementAnswer>;
    let debugElement: DebugElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatCheckboxModule,
                BrowserAnimationsModule,
                FormsModule
            ],
            declarations: [
                TestHostComponent,
                ActivityAgreementAnswer
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ActivityAgreementAnswer);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        component.block = questionBlock;
        fixture.detectChanges();
    }));

    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('should render checkbox and question', () => {
        const text = debugElement.queryAll(By.css('.ddp-agreement-text'));
        const checkbox = debugElement.queryAll(By.css('mat-checkbox'));
        expect(checkbox.length).toBe(1);
        expect(text.length).toBe(1);
        expect(text[0].properties.innerHTML).toBe(questionBlock.question);
    });

    it('should not add ddp-required-question-prompt css class if question is not required', () => {
        component.block.isRequired = false;
        fixture.detectChanges();
        const required = debugElement.queryAll(By.css('.ddp-required-question-prompt'));
        expect(required.length).toBe(0);
    });

    it('should add ddp-required-question-prompt css class if question is required', () => {
        component.block.isRequired = true;
        fixture.detectChanges();
        const required = debugElement.queryAll(By.css('.ddp-required-question-prompt'));
        expect(required.length).toBe(1);
    });

    it('should change answer by click', () => {
        component.block.answer = false;
        fixture.detectChanges();
        const checkbox = debugElement.queryAll(By.css('mat-checkbox'))[0];
        const inputElement = checkbox.nativeElement.querySelector('input') as HTMLInputElement;
        inputElement.click();
        expect(inputElement.checked).toBe(true);
        expect(component.block.answer).toBe(true);
    });

    it('should change answer by click', () => {
        component.block.answer = true;
        fixture.detectChanges();
        const checkbox = debugElement.queryAll(By.css('mat-checkbox'))[0];
        const inputElement = checkbox.nativeElement.querySelector('input') as HTMLInputElement;
        inputElement.click();
        expect(inputElement.checked).toBe(false);
        expect(component.block.answer).toBe(false);
    });
});
