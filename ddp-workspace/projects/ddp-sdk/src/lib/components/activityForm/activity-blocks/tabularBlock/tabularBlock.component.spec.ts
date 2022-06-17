import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { By } from '@angular/platform-browser';

import { TabularBlockComponent } from './tabularBlock.component';
import { mockTabularData1, mockTabularData2 } from './mock-tabular-data';
import { ActivityTabularBlock } from '../../../../models/activity/activityTabularBlock';
import { ActivityQuestionComponent } from '../activityQuestion.component';
import { ActivityAnswerComponent } from '../../answers/activity-answer/activityAnswer.component';
import { SubmissionManager } from '../../../../services/serviceAgents/submissionManager.service';
import { WindowRef } from '../../../../services/windowRef';

describe('TabularBlockComponent (with simple questions)', () => {
    let component: TabularBlockComponent;
    let fixture: ComponentFixture<TabularBlockComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                TabularBlockComponent,
                ActivityQuestionComponent,
                ActivityAnswerComponent
            ],
            imports: [
                FlexLayoutModule
            ],
            providers: [
                { provide: 'ddp.config', useValue: {} },
                { provide: SubmissionManager, useValue: {} },
                { provide: WindowRef, useValue: {} }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TabularBlockComponent);
        component = fixture.componentInstance;
        component.block = mockTabularData1 as ActivityTabularBlock;
        component.readonly = false;
        component.validationRequested = false;
        component.studyGuid = 'studyGuid';
        component.activityGuid = 'activityGuid';
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have title', () => {
        const titleElement = fixture.debugElement.query(By.css('h3')).nativeElement;
        expect(titleElement.textContent).toBe('Simple Tabular block');
    });

    it('should have 2 columns grid', () => {
        const containerElement = fixture.debugElement.query(By.css('.tabular-container')).nativeElement;
        expect(containerElement.style.gridTemplateColumns).toBe('auto auto');
    });

    it('should have 2 headers', () => {
        const headers = fixture.debugElement.queryAll(By.css('.header'));
        expect(headers.length).toBe(2);

        expect(headers[0].nativeElement.textContent.trim()).toBe('Question');
        expect(headers[0].nativeElement.style.gridColumn).toBe('span 1 / auto');

        expect(headers[1].nativeElement.textContent.trim()).toBe('Answer');
        expect(headers[1].nativeElement.style.gridColumn).toBe('span 1 / auto');
    });

    it('should have 3 questions titles', () => {
        const questionTitles = fixture.debugElement.queryAll(By.css('.question-title'));
        expect(questionTitles.length).toBe(3);
        expect(questionTitles[0].nativeElement.textContent.trim()).toBe('First Name');
        expect(questionTitles[1].nativeElement.textContent.trim()).toBe('Last Name');
        expect(questionTitles[2].nativeElement.textContent.trim()).toBe('Date of Birth');
    });

    it('should have 3 questions', () => {
        const questions = fixture.debugElement.queryAll(By.css('.questions-cell'));
        expect(questions.length).toBe(3);
    });

    it('should not have any prompt', () => {
        const questions = fixture.debugElement.queryAll(By.css('ddp-question-prompt'));
        expect(questions.length).toBe(0);
    });
});

describe('TabularBlockComponent (with composite questions)', () => {
    let component: TabularBlockComponent;
    let fixture: ComponentFixture<TabularBlockComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                TabularBlockComponent,
                ActivityQuestionComponent,
                ActivityAnswerComponent
            ],
            imports: [
                FlexLayoutModule
            ],
            providers: [
                { provide: 'ddp.config', useValue: {} },
                { provide: SubmissionManager, useValue: {} },
                { provide: WindowRef, useValue: {} }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TabularBlockComponent);
        component = fixture.componentInstance;
        component.block = mockTabularData2 as ActivityTabularBlock;
        component.readonly = false;
        component.validationRequested = false;
        component.studyGuid = 'studyGuid';
        component.activityGuid = 'activityGuid';
        fixture.detectChanges();
    });

    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('should have title (composite)', () => {
        const titleElement = fixture.debugElement.query(By.css('h3')).nativeElement;
        expect(titleElement.textContent).toBe('Tabular block with Composite');
    });

    it('should have 4 columns grid', () => {
        const containerElement = fixture.debugElement.query(By.css('.tabular-container')).nativeElement;
        expect(containerElement.style.gridTemplateColumns).toBe('auto auto auto auto');
    });

    it('should have 2 headers (composite)', () => {
        const headers = fixture.debugElement.queryAll(By.css('.header'));
        expect(headers.length).toBe(2);

        expect(headers[0].nativeElement.textContent.trim()).toBe('Type');
        expect(headers[0].nativeElement.style.gridColumn).toBe('span 2 / auto');

        expect(headers[1].nativeElement.textContent.trim()).toBe('First onset or event');
        expect(headers[1].nativeElement.style.gridColumn).toBe('span 2 / auto');
    });

    it('should have 10 questions titles', () => {
        const questionTitles = fixture.debugElement.queryAll(By.css('.question-title'));
        expect(questionTitles.length).toBe(10);
        expect(questionTitles[0].nativeElement.textContent.trim()).toBe('Boolean question title');
        expect(questionTitles[1].nativeElement.textContent.trim()).toBe('Ascites requiring paracentesis');
        // other questions are the same (2 questions repeated 5 times in mock data)
    });

    it('should have 10 questions', () => {
        const questions = fixture.debugElement.queryAll(By.css('.questions-cell'));
        expect(questions.length).toBe(10);
    });

    it('should not have any prompt (composite)', () => {
        const questions = fixture.debugElement.queryAll(By.css('ddp-question-prompt'));
        expect(questions.length).toBe(0);
    });
});
