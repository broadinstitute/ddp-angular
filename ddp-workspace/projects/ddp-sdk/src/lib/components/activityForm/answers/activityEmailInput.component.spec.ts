import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuestionPromptComponent } from './question-prompt/questionPrompt.component';
import { TooltipComponent } from '../../tooltip.component';
import { TranslateTestingModule } from '../../../testsupport/translateTestingModule';
import { ActivityTextQuestionBlock } from '../../../models/activity/activityTextQuestionBlock';
import { ActivityEmailInput } from './activityEmailInput.component';
import { MatInputModule } from '@angular/material/input';

describe('ActivityNumericAnswer', () => {
    const questionBlock = new ActivityTextQuestionBlock();
    const mode = false;
    const VALID_EMAIL = 'foo@bar.baz';
    const INVALID_EMAIL = 'foo@bar';
    const PROMPT = 'Prompt';
    @Component({
        template: `
        <ddp-activity-email-input [block]="block"
                                  [readonly]="false"
                                  (valueChanged)="changed($event)">
        </ddp-activity-email-input>`
    })
    class TestHostComponent {
        block = questionBlock;
        readonly = mode;

        changed(value: any): void { }
    }

    let component: ActivityEmailInput;
    let fixture: ComponentFixture<ActivityEmailInput>;
    let debugElement: DebugElement;

    beforeEach(() => {
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
                ActivityEmailInput,
                QuestionPromptComponent,
                TooltipComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ActivityEmailInput);
        component = fixture.componentInstance;
        component.block = questionBlock;
        fixture.detectChanges();
    });

    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('should render 1 field', () => {
        component.block = new ActivityTextQuestionBlock();
        const field = By.css('input').length;
        expect(field).toBe(1);
    });

    it('should emit email if the answer is valid', fakeAsync(() => {
        component.block = new ActivityTextQuestionBlock();
        fixture.detectChanges();
        spyOn(component.valueChanged, 'emit');
        component.emailForm.controls.email.patchValue(VALID_EMAIL);
        const inputElement: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        inputElement.value = VALID_EMAIL;
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        tick(400);
        fixture.whenStable().then(() => {
            expect(component.block.answer).toBe(VALID_EMAIL);
            expect(component.valueChanged.emit).toHaveBeenCalledWith(VALID_EMAIL);
        });
    }));

    it('should emit null if the answer is invalid', fakeAsync(() => {
        component.block = new ActivityTextQuestionBlock();
        fixture.detectChanges();
        spyOn(component.valueChanged, 'emit');
        component.emailForm.controls.email.patchValue(INVALID_EMAIL);
        const inputElement: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        inputElement.value = INVALID_EMAIL;
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        tick(400);
        fixture.whenStable().then(() => {
            expect(component.block.answer).toBeNull();
            expect(component.valueChanged.emit).toHaveBeenCalledWith(null);
        });
    }));

    it('should render 2 fields with prompt', () => {
        const block = new ActivityTextQuestionBlock();
        block.confirmEntry = true;
        block.confirmPrompt = PROMPT;
        component.block = block;
        component.ngOnInit();
        fixture.detectChanges();
        const fields = fixture.debugElement.queryAll(By.css('input'));
        const prompt = fixture.debugElement.queryAll(By.css('.ddp-question-prompt'));
        expect(fields.length).toBe(2);
        expect(prompt.length).toBe(1);
        expect(prompt[0].nativeElement.innerText).toBe(PROMPT);
    });

    it('should emit null if both fields are invalid', fakeAsync(() => {
        const block = new ActivityTextQuestionBlock();
        block.confirmEntry = true;
        component.block = block;
        component.ngOnInit();
        fixture.detectChanges();
        spyOn(component.valueChanged, 'emit');
        component.emailForm.controls.email.patchValue(INVALID_EMAIL);
        component.emailForm.controls.confirmEmail.patchValue(INVALID_EMAIL);
        const inputElement1: HTMLInputElement = fixture.debugElement.queryAll(By.css('input'))[0].nativeElement;
        inputElement1.value = INVALID_EMAIL;
        inputElement1.dispatchEvent(new Event('input'));
        const inputElement2: HTMLInputElement = fixture.debugElement.queryAll(By.css('input'))[1].nativeElement;
        inputElement2.value = INVALID_EMAIL;
        inputElement2.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        tick(400);
        fixture.whenStable().then(() => {
            expect(component.block.answer).toBeNull();
            expect(component.valueChanged.emit).toHaveBeenCalledWith(null);
        });
    }));

    it('should emit null if only one field was filled', fakeAsync(() => {
        const block = new ActivityTextQuestionBlock();
        block.confirmEntry = true;
        component.block = block;
        component.ngOnInit();
        fixture.detectChanges();
        spyOn(component.valueChanged, 'emit');
        component.emailForm.controls.email.patchValue(VALID_EMAIL);
        const inputElement: HTMLInputElement = fixture.debugElement.queryAll(By.css('input'))[0].nativeElement;
        inputElement.value = VALID_EMAIL;
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        tick(400);
        fixture.whenStable().then(() => {
            expect(component.block.answer).toBeNull();
            expect(component.valueChanged.emit).toHaveBeenCalledWith(null);
        });
    }));

    it('should emit email if both fields are valid', fakeAsync(() => {
        const block = new ActivityTextQuestionBlock();
        block.confirmEntry = true;
        component.block = block;
        component.ngOnInit();
        fixture.detectChanges();
        spyOn(component.valueChanged, 'emit');
        component.emailForm.controls.email.patchValue(VALID_EMAIL);
        component.emailForm.controls.confirmEmail.patchValue(VALID_EMAIL);
        const inputElement1: HTMLInputElement = fixture.debugElement.queryAll(By.css('input'))[0].nativeElement;
        inputElement1.value = VALID_EMAIL;
        inputElement1.dispatchEvent(new Event('input'));
        const inputElement2: HTMLInputElement = fixture.debugElement.queryAll(By.css('input'))[1].nativeElement;
        inputElement2.value = VALID_EMAIL;
        inputElement2.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        tick(400);
        fixture.whenStable().then(() => {
            expect(component.block.answer).toBe(VALID_EMAIL);
            expect(component.valueChanged.emit).toHaveBeenCalledWith(VALID_EMAIL);
        });
    }));
});
