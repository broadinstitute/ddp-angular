import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    TooltipComponent,
    CheckboxesActivityPicklistQuestion,
    ActivityPicklistQuestionBlock,
    NGXTranslateService,
    ActivityPicklistAnswer,
    QuestionPromptComponent,
    DropdownActivityPicklistQuestion,
    RadioButtonsActivityPicklistQuestion, PicklistSortingPolicy
} from 'ddp-sdk';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { TranslateTestingModule } from '../../../testsupport/translateTestingModule';
import { of } from 'rxjs';
import { AutocompleteActivityPicklistQuestion } from './autocompleteActivityPicklistQuestion.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PicklistRenderMode } from '../../../models/activity/picklistRenderMode';
import { SearchHighlightPipe } from '../../../pipes/searchHighlight.pipe';

describe('ActivityPicklistAnswer', () => {
    const questionBlock = {
        picklistOptions: [
            {
                stableId: 'AAA',
                optionLabel: 'I have not received any medications',
                allowDetails: false,
                detailLabel: '',
                exclusive: false,
                groupId: null,
                tooltip: null
            }
        ],
        picklistGroups: [],
        answer: null
    } as ActivityPicklistQuestionBlock;

    @Component({
        template: `
            <ddp-activity-picklist-answer [block]="block"
                                          [readonly]="false"
                                          (valueChanged)="onChange()">
            </ddp-activity-picklist-answer>`
    })
    class TestHostComponent {
        block = questionBlock;
        onChange(): void { }
    }

    let component: ActivityPicklistAnswer;
    let fixture: ComponentFixture<ActivityPicklistAnswer>;
    let debugElement: DebugElement;
    let ngxTranslateServiceSpy;

    beforeEach(() => {
        ngxTranslateServiceSpy = jasmine.createSpyObj('NGXTranslateService', ['getTranslation']);
        ngxTranslateServiceSpy.getTranslation.and.callFake(() => of({
            'SDK.DetailsPlaceholder.PluralForm': 'characters remaining',
            'SDK.DetailsPlaceholder.SingularForm': 'character remaining'
        }));

        TestBed.configureTestingModule({
            imports: [
                MatListModule,
                MatCheckboxModule,
                MatInputModule,
                MatTooltipModule,
                BrowserAnimationsModule,
                TranslateTestingModule,
                MatSelectModule,
                MatRadioModule,
                MatAutocompleteModule,
                FormsModule,
                ReactiveFormsModule,
            ],
            providers: [
                { provide: NGXTranslateService, useValue: ngxTranslateServiceSpy },
                { provide: PicklistSortingPolicy, useValue: new PicklistSortingPolicy() },
                { provide: 'ddp.config', useValue: { notSortedPicklistAutocompleteStableIds: [] } }
            ],
            declarations: [
                TestHostComponent,
                ActivityPicklistAnswer,
                QuestionPromptComponent,
                CheckboxesActivityPicklistQuestion,
                DropdownActivityPicklistQuestion,
                RadioButtonsActivityPicklistQuestion,
                AutocompleteActivityPicklistQuestion,
                TooltipComponent,
                SearchHighlightPipe
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ActivityPicklistAnswer);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
    });

    it('should not render any questions', () => {
        component.block = {
            ...questionBlock,
            question: '',
            renderMode: 'RANDOM',
            selectMode: 'RANDOM'
        } as ActivityPicklistQuestionBlock;
        fixture.detectChanges();
        const radiobuttons = debugElement.queryAll(By.css('ddp-activity-radiobuttons-picklist-question'));
        const checkboxes = debugElement.queryAll(By.css('ddp-activity-checkboxes-picklist-question'));
        const dropdowns = debugElement.queryAll(By.css('ddp-activity-dropdown-picklist-question'));
        const questions = [
            ...radiobuttons,
            ...checkboxes,
            ...dropdowns
        ];
        expect(questions.length).toBe(0);
    });

    it('should render prompt and question', () => {
        component.block = {
            ...questionBlock,
            question: 'Random question',
            renderMode: 'LIST',
            selectMode: 'SINGLE'
        } as ActivityPicklistQuestionBlock;
        fixture.detectChanges();
        const question = debugElement.queryAll(By.css('ddp-activity-radiobuttons-picklist-question'));
        const prompt = debugElement.queryAll(By.css('ddp-question-prompt'));
        expect(question.length).toBe(1);
        expect(prompt.length).toBe(1);
    });

    it('should render RadioButtonsActivityPicklistQuestion', () => {
        component.block = {
            ...questionBlock,
            renderMode: 'LIST',
            selectMode: 'SINGLE'
        } as ActivityPicklistQuestionBlock;
        fixture.detectChanges();
        const question = debugElement.queryAll(By.css('ddp-activity-radiobuttons-picklist-question'));
        expect(question.length).toBe(1);
    });

    it('should render CheckboxesActivityPicklistQuestion  in SINGLE mode', () => {
        component.block = {
            ...questionBlock,
            renderMode: 'LIST',
            selectMode: 'MULTIPLE'
        } as ActivityPicklistQuestionBlock;
        fixture.detectChanges();
        const question = debugElement.queryAll(By.css('ddp-activity-checkboxes-picklist-question'));
        expect(question.length).toBe(1);
    });

    it('should render RadioButtonsActivityPicklistQuestion in CHECKBOX_LIST mode', () => {
        component.block = {
            ...questionBlock,
            renderMode: 'CHECKBOX_LIST'
        } as ActivityPicklistQuestionBlock;
        fixture.detectChanges();
        const question = debugElement.queryAll(By.css('ddp-activity-checkboxes-picklist-question'));
        expect(question.length).toBe(1);
    });

    it('should render DropdownActivityPicklistQuestion', () => {
        component.block = {
            ...questionBlock,
            renderMode: 'DROPDOWN'
        } as ActivityPicklistQuestionBlock;
        fixture.detectChanges();
        const question = debugElement.queryAll(By.css('ddp-activity-dropdown-picklist-question'));
        expect(question.length).toBe(1);
    });

    it('should render AutocompleteActivityPicklistQuestion', () => {
        component.block = {
            ...questionBlock,
            renderMode: PicklistRenderMode.AUTOCOMPLETE
        } as ActivityPicklistQuestionBlock;
        fixture.detectChanges();
        const question = debugElement.queryAll(By.css('ddp-activity-autocomplete-picklist-question'));
        expect(question.length).toBe(1);
    });
});
