import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { TooltipComponent } from '../../tooltip.component';
import { ActivityPicklistQuestionBlock } from '../../../models/activity/activityPicklistQuestionBlock';
import { NGXTranslateService } from '../../../services/internationalization/ngxTranslate.service';
import { DropdownActivityPicklistQuestion } from './dropdownActivityPicklistQuestion.component';
import { TranslateTestingModule } from '../../../testsupport/translateTestingModule';

describe('DropdownActivityPicklistQuestion', () => {
    const questionBlock = {
        picklistOptions: [
            {
                stableId: 'AAA',
                optionLabel: 'I have received any medications',
                allowDetails: false,
                detailLabel: '',
                exclusive: false,
                groupId: null,
                tooltip: null,
                nestedOptionsLabel: null,
                nestedOptions: null
            },
            {
                stableId: 'BBB',
                optionLabel: 'I have received any medications a little bit',
                allowDetails: false,
                detailLabel: '',
                exclusive: false,
                groupId: null,
                tooltip: null,
                nestedOptionsLabel: null,
                nestedOptions: null
            },
            {
                stableId: 'CCC',
                optionLabel: 'I have not received any medications',
                allowDetails: false,
                detailLabel: '',
                exclusive: true,
                groupId: null,
                tooltip: null,
                nestedOptionsLabel: null,
                nestedOptions: null
            }
        ],
        picklistGroups: [],
        detailMaxLength: 10,
        renderMode: 'DROPDOWN',
        selectMode: ''
    } as ActivityPicklistQuestionBlock;

    @Component({
        template: `
        <ddp-activity-dropdown-picklist-question [block]="block"
                                                 readonly="false"
                                                 (valueChanged)="changed($event)">
        </ddp-activity-dropdown-picklist-question>`
    })
    class TestHostComponent {
        block = questionBlock;
        changed(value: any): void { }
    }

    let component: DropdownActivityPicklistQuestion;
    let fixture: ComponentFixture<DropdownActivityPicklistQuestion>;
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
                MatInputModule,
                MatSelectModule,
                BrowserAnimationsModule,
                TranslateTestingModule,
                MatTooltipModule,
                FormsModule
            ],
            providers: [
                { provide: NGXTranslateService, useValue: ngxTranslateServiceSpy }
            ],
            declarations: [
                TestHostComponent,
                DropdownActivityPicklistQuestion,
                TooltipComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(DropdownActivityPicklistQuestion);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        component.block = questionBlock;
        fixture.detectChanges();
    });

    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('should render native dropdown component with 4 options', () => {
        questionBlock.selectMode = 'SINGLE';
        fixture.detectChanges();
        const select = debugElement.queryAll(By.css('select'));
        const options = debugElement.queryAll(By.css('option'));
        expect(select.length).toBe(1);
        expect(options.length).toBe(4);
    });

    it('native dropdown component contains only one answer', () => {
        questionBlock.selectMode = 'SINGLE';
        questionBlock.answer = [];
        fixture.detectChanges();
        const select = fixture.debugElement.query(By.css('select')).nativeElement;

        select.value = select.options[0].value;
        select.dispatchEvent(new Event('change'));
        expect(component.block.answer).toEqual([]);

        select.value = select.options[1].value;
        select.dispatchEvent(new Event('change'));
        expect(component.block.answer).toEqual([{
            stableId: 'AAA',
            detail: null
        }]);

        select.value = select.options[2].value;
        select.dispatchEvent(new Event('change'));
        expect(component.block.answer).toEqual([{
            stableId: 'BBB',
            detail: null
        }]);
    });

    it('should render material dropdown component with 3 options', () => {
        questionBlock.selectMode = 'MULTIPLE';
        fixture.detectChanges();
        const select = fixture.debugElement.query(By.css('.mat-select-trigger')).nativeElement;
        select.click();
        fixture.detectChanges();
        const options = fixture.debugElement.queryAll(By.css('.mat-option-text'));
        expect(options.length).toEqual(3);
    });

    it('material dropdown component contains multiple answers', () => {
        questionBlock.selectMode = 'MULTIPLE';
        questionBlock.answer = [];
        fixture.detectChanges();
        const select = fixture.debugElement.query(By.css('.mat-select-trigger')).nativeElement;
        select.click();
        fixture.detectChanges();
        const options = fixture.debugElement.queryAll(By.css('.mat-option-text'));
        options[0].nativeElement.click();
        options[1].nativeElement.click();
        fixture.detectChanges();
        expect(component.block.answer).toEqual([{
            stableId: 'AAA',
            detail: null
        }, {
            stableId: 'BBB',
            detail: null
        }]);
    });

    it('material dropdown component exclusive answer should reset previous answers', () => {
        questionBlock.selectMode = 'MULTIPLE';
        questionBlock.answer = [];
        fixture.detectChanges();
        const select = fixture.debugElement.query(By.css('.mat-select-trigger')).nativeElement;
        select.click();
        fixture.detectChanges();
        const options = fixture.debugElement.queryAll(By.css('.mat-option-text'));
        options[0].nativeElement.click();
        fixture.detectChanges();
        options[1].nativeElement.click();
        fixture.detectChanges();
        options[2].nativeElement.click();
        fixture.detectChanges();
        expect(component.block.answer).toEqual([{
            stableId: 'CCC',
            detail: null
        }]);
    });
});
