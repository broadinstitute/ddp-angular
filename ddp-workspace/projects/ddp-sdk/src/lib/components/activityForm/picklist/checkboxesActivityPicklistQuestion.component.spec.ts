import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckboxesActivityPicklistQuestion } from './checkboxesActivityPicklistQuestion.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { ActivityPicklistQuestionBlock } from './../../../models/activity/activityPicklistQuestionBlock';
import { By } from '@angular/platform-browser';

describe('CheckboxesActivityPicklistQuestion', () => {
    const questionBlock = {
        picklistLabel: '',
        picklistOptions: [
            {
                stableId: 'AAA',
                optionLabel: 'I have not recived any medications',
                allowDetails: true,
                detailLabel: '',
                exclusive: true,
                groupId: null
            }
        ],
        picklistGroups: [
            {
                name: 'Category 01',
                options: [
                    {
                        stableId: 'BBB',
                        optionLabel: 'letrozole (Femara)',
                        allowDetails: false,
                        detailLabel: '',
                        exclusive: false,
                        groupId: 'category_1'
                    }
                ]
            },
            {
                name: 'Category 02',
                options: [
                    {
                        stableId: 'CCC',
                        optionLabel: 'doxorubicin (adriamycin)',
                        allowDetails: false,
                        detailLabel: '',
                        exclusive: false,
                        groupId: 'category_2'
                    }
                ]
            }
        ],
        renderMode: 'CHECKBOX_LIST',
        selectMode: 'MULTIPLE'
    } as ActivityPicklistQuestionBlock;
    const mode = false;

    @Component({
        template: `
        <ddp-activity-checkboxes-picklist-question [block]="block"
                                                   [readonly]="readonly"
                                                   (valueChanged)="changed($event)">
        </ddp-activity-checkboxes-picklist-question>`
    })
    class TestHostComponent {
        block = questionBlock;
        readonly = mode;

        changed(value: any): void { }
    }

    let component: CheckboxesActivityPicklistQuestion;
    let fixture: ComponentFixture<CheckboxesActivityPicklistQuestion>;
    let debugElement: DebugElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatListModule,
                MatCheckboxModule,
                MatInputModule,
                BrowserAnimationsModule
            ],
            declarations: [
                TestHostComponent,
                CheckboxesActivityPicklistQuestion
            ]
        }).compileComponents();
    }));

    describe('test as a class', () => {
        beforeEach(() => {
            fixture = TestBed.createComponent(CheckboxesActivityPicklistQuestion);
            component = fixture.componentInstance;
            debugElement = fixture.debugElement;
            component.block = questionBlock;
            component.readonly = mode;
            fixture.detectChanges();
        });

        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should emit valueChanged event', () => {
            const value = spyOn(component.valueChanged, 'emit');
            component.select(true, 'AAA', true);
            expect(value).toHaveBeenCalledTimes(1);
        });

        it('should emit answer', () => {
            component.select(true, 'AAA', true);
            expect(component.block.answer).toEqual([{ stableId: 'AAA', detail: null }]);
        });
    });

    describe('stand alone testing', () => {
        beforeEach(() => {
            fixture = TestBed.createComponent(CheckboxesActivityPicklistQuestion);
            component = fixture.componentInstance;
            debugElement = fixture.debugElement;
            component.block = questionBlock;
        });

        it('should render 3 checkboxes', () => {
            fixture.detectChanges();
            const count = debugElement.queryAll(By.css('mat-list-item'));
            expect(count.length).toBe(3);
        });

        it('should show details field', () => {
            fixture.detectChanges();
            const checkbox = debugElement.queryAll(By.css('.mat-checkbox-label'))[0];
            checkbox.triggerEventHandler('click', null);
            const filed = debugElement.queryAll(By.css('mat-form-field'));
            expect(filed.length).toBe(1);
        });

        it('should add detais text to answer', () => {
            fixture.detectChanges();
            component.select(true, 'AAA', true);
            component.detailTextChanged('Text', 'AAA');
            expect(component.block.answer).toEqual([{ stableId: 'AAA', detail: 'Text' }]);
        });
    });
});
