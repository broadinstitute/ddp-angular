import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { ActivityBooleanQuestionBlock } from '../../../../models/activity/activityBooleanQuestionBlock';
import { QuestionPromptComponent } from './questionPrompt.component';
import { TooltipComponent } from '../../../tooltip.component';
import { TranslateTestingModule } from '../../../../testsupport/translateTestingModule';

describe('QuestionPromptComponent', () => {
    const questionBlock = {
        question: '',
        tooltip: null,
        isRequired: false
    } as ActivityBooleanQuestionBlock;

    @Component({
        template: `
        <ddp-question-prompt [block]="block" *ngIf="!isGridLayout()"></ddp-question-prompt>`
    })
    class TestHostComponent {
        block = questionBlock;
    }

    let component: QuestionPromptComponent;
    let fixture: ComponentFixture<QuestionPromptComponent>;
    let debugElement: DebugElement;

    let configServiceSpy;

    beforeEach(waitForAsync(() => {
        configServiceSpy = jasmine.createSpyObj('ddp.config', ['tooltipIconUrl']);
        configServiceSpy.tooltipIconUrl.and.callFake(() => '/path/');

        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                MatTooltipModule,
                TranslateTestingModule
            ],
            declarations: [
                TestHostComponent,
                QuestionPromptComponent,
                TooltipComponent
            ],
            providers: [
                { provide: 'ddp.config', useValue: configServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(QuestionPromptComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        component.block = questionBlock;
        fixture.detectChanges();
    }));

    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('should not render anything if question text is empty', () => {
        component.block.question = '';
        fixture.detectChanges();
        const question = debugElement.queryAll(By.css('div'));
        expect(question.length).toBe(0);
    });

    it('should render optional question without tooltip', () => {
        component.block.question = 'How are you?';
        component.block.isRequired = false;
        component.block.tooltip = null;
        fixture.detectChanges();
        const text = debugElement.queryAll(By.css('span'));
        const question = debugElement.queryAll(By.css('div'));
        const tooltip = debugElement.queryAll(By.css('ddp-tooltip'));
        const required = debugElement.queryAll(By.css('.ddp-required-question-prompt'));
        expect(text[0].properties.innerHTML).toBe('How are you?');
        expect(question.length).toBe(1);
        expect(tooltip.length).toBe(0);
        expect(required.length).toBe(0);
    });

    it('should render required question with tooltip', () => {
        component.block.question = 'How are you?';
        component.block.isRequired = true;
        component.block.tooltip = 'I can help you!';
        fixture.detectChanges();
        const text = debugElement.queryAll(By.css('span'));
        const question = debugElement.queryAll(By.css('div'));
        const tooltip = debugElement.queryAll(By.css('ddp-tooltip'));
        const required = debugElement.queryAll(By.css('.ddp-required-question-prompt'));
        expect(text[0].properties.innerHTML).toBe('How are you?');
        expect(question.length).toBe(1);
        expect(tooltip.length).toBe(1);
        expect(required.length).toBe(1);
    });
});
