import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RadioButtonsActivityPicklistQuestion } from './radiobuttonsActivityPicklistQuestion.component';
import { TooltipComponent } from '../../tooltip.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { ActivityPicklistQuestionBlock } from '../../../models/activity/activityPicklistQuestionBlock';
import { By } from '@angular/platform-browser';
import { NGXTranslateService } from '../../../services/internationalization/ngxTranslate.service';
import { TranslateTestingModule } from '../../../testsupport/translateTestingModule';
import { of } from 'rxjs';

describe('RadioButtonsActivityPicklistQuestion', () => {
    const questionBlock = {
        picklistLabel: '',
        picklistOptions: [
            {
                stableId: 'AAA',
                optionLabel: 'I have received medications',
                allowDetails: true,
                detailLabel: '',
                tooltip: 'Helper text'
            },
            {
                stableId: 'BBB',
                optionLabel: 'I have not received any medications',
                allowDetails: false,
                detailLabel: '',
                tooltip: null
            }
        ],
        renderMode: 'LIST',
        selectMode: 'SINGLE'
    } as ActivityPicklistQuestionBlock;
    const mode = false;

    @Component({
        template: `
        <ddp-activity-radiobuttons-picklist-question [block]="block"
                                                     [readonly]="readonly"
                                                     (valueChanged)="changed($event)">
        </ddp-activity-radiobuttons-picklist-question>`
    })
    class TestHostComponent {
        block = questionBlock;
        readonly = mode;

        changed(value: any): void { }
    }

    let component: RadioButtonsActivityPicklistQuestion;
    let fixture: ComponentFixture<RadioButtonsActivityPicklistQuestion>;
    let debugElement: DebugElement;
    const ngxTranslateServiceSpy = jasmine.createSpyObj('NGXTranslateService', ['getTranslation']);
    ngxTranslateServiceSpy.getTranslation.and.callFake(() => {
        return of(['Singular Translation', 'Plural Translation']);
    });
    const configServiceSpy = jasmine.createSpyObj('ddp.config', ['tooltipIconUrl']);
    configServiceSpy.tooltipIconUrl.and.callFake(() => {
        return '/path/';
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatListModule,
                MatRadioModule,
                MatInputModule,
                MatTooltipModule,
                BrowserAnimationsModule,
                TranslateTestingModule
            ],
            providers: [
                { provide: NGXTranslateService, useValue: ngxTranslateServiceSpy },
                { provide: 'ddp.config', useValue: configServiceSpy }
            ],
            declarations: [
                TestHostComponent,
                RadioButtonsActivityPicklistQuestion,
                TooltipComponent
            ]
        }).compileComponents();
    }));

    describe('test as a class', () => {
        beforeEach(() => {
            fixture = TestBed.createComponent(RadioButtonsActivityPicklistQuestion);
            component = fixture.componentInstance;
            debugElement = fixture.debugElement;
            component.block = questionBlock;
            component.block.answer = null;
            component.readonly = mode;
            fixture.detectChanges();
        });

        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should emit valueChanged event', () => {
            const value = spyOn(component.valueChanged, 'emit');
            component.optionChanged(questionBlock.picklistOptions[0]);
            expect(value).toHaveBeenCalledTimes(1);
        });

        it('should emit answer', () => {
            component.optionChanged(questionBlock.picklistOptions[0]);
            expect(component.block.answer).toEqual([{ stableId: 'AAA', detail: null }]);
        });
    });

    describe('stand alone testing', () => {
        beforeEach(() => {
            fixture = TestBed.createComponent(RadioButtonsActivityPicklistQuestion);
            component = fixture.componentInstance;
            debugElement = fixture.debugElement;
            // reinitialize answers after using somewhere else
            questionBlock.answer = null;
            component.block = questionBlock;
        });

        it('should render 2 radiobuttons', () => {
            fixture.detectChanges();
            const count = debugElement.queryAll(By.css('mat-radio-button'));
            expect(count.length).toBe(2);
        });

        it('should render 1 tooltip', () => {
            fixture.detectChanges();
            const count = debugElement.queryAll(By.css('ddp-tooltip'));
            expect(count.length).toBe(1);
        });

        it('should show details field', () => {
            fixture.detectChanges();
            const radioButton = debugElement.queryAll(By.css('mat-radio-button'))[0];
            const inputElement = radioButton.nativeElement.querySelector('input') as HTMLInputElement;
            inputElement.click();
            fixture.detectChanges();
            const field = debugElement.queryAll(By.css('mat-form-field'));
            expect(field.length).toBe(1);
        });

        it('should add detais text to answer', () => {
            fixture.detectChanges();
            component.optionChanged(questionBlock.picklistOptions[0]);
            component.detailTextChanged('Text', 'AAA');
            expect(component.block.answer).toEqual([{ stableId: 'AAA', detail: 'Text' }]);
        });
    });
});
