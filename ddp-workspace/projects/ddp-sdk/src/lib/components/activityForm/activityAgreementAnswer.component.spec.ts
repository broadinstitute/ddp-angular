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
    }));

    it('should create component', () => {
        expect(component).toBeTruthy();
    });
});
