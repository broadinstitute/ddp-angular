import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuestionPromptComponent } from './questionPrompt.component';
import { TooltipComponent } from '../tooltip.component';
import { TranslateTestingModule } from '../../testsupport/translateTestingModule';
import { ActivityTextQuestionBlock } from '../../models/activity/activityTextQuestionBlock';
import { ActivityEmailInput } from './activityEmailInput.component';
import { MatInputModule } from '@angular/material/input';

fdescribe('ActivityNumericAnswer', () => {
    const questionBlock = new ActivityTextQuestionBlock();
    const mode = false;

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
        debugElement = fixture.debugElement;
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
        component.emailForm.controls.email.patchValue('foo@bar.com');
        const inputElement: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        inputElement.value = 'foo@bar.com';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        tick(400);
        fixture.whenStable().then(() => {
            expect(component.block.answer).toBe('foo@bar.com');
            expect(component.valueChanged.emit).toHaveBeenCalledWith('foo@bar.com');
        });
    }));

    it('should emit null if the answer is invalid', fakeAsync(() => {
        component.block = new ActivityTextQuestionBlock();
        fixture.detectChanges();
        spyOn(component.valueChanged, 'emit');
        component.emailForm.controls.email.patchValue('foo@bar');
        const inputElement: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        inputElement.value = 'foo@bar';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        tick(400);
        fixture.whenStable().then(() => {
            expect(component.block.answer).toBeNull();
            expect(component.valueChanged.emit).toHaveBeenCalledWith(null);
        });
    }));

    it('should render 2 fields with ', () => {
        const block = new ActivityTextQuestionBlock();
        block.confirmEntry = true;
        component.block = block;
        component.ngOnInit();
        fixture.detectChanges();
        const fields = fixture.debugElement.queryAll(By.css('input')).length;
        expect(fields).toBe(2);
    });
});
