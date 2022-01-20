import { SimpleChange } from '@angular/core';
import { ActivityPicklistQuestionBlock } from '../../../models/activity/activityPicklistQuestionBlock';
import { BaseActivityPicklistQuestion } from './baseActivityPicklistQuestion.component';
import { of } from 'rxjs';

describe('BaseActivityPicklistQuestion', () => {
    let component: BaseActivityPicklistQuestion;
    let ngxTranslateServiceSpy;

    beforeEach(() => {
        ngxTranslateServiceSpy = jasmine.createSpyObj('NGXTranslateService', ['getTranslation']);
        ngxTranslateServiceSpy.getTranslation.and.callFake(() => of({
            'SDK.DetailsPlaceholder.PluralForm': 'characters remaining',
            'SDK.DetailsPlaceholder.SingularForm': 'character remaining'
        }));

        component = new BaseActivityPicklistQuestion(ngxTranslateServiceSpy);
        component.block = {
            picklistOptions: [
                {
                    stableId: 'AAA',
                    optionLabel: 'I have not received any medications',
                    allowDetails: true,
                    detailLabel: '',
                    exclusive: false,
                    groupId: null,
                    tooltip: null
                },
                {
                    stableId: 'BBB',
                    optionLabel: 'I have received any medications',
                    allowDetails: true,
                    detailLabel: '',
                    exclusive: false,
                    groupId: null,
                    tooltip: null
                }
            ],
            answer: [{
                detail: 'TEST TEST',
                stableId: 'BBB'
            }],
            picklistGroups: [],
            detailMaxLength: 10
        } as ActivityPicklistQuestionBlock;
    });

    it('should create base component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize characters and message data if questions allow details', () => {
        component.ngOnChanges({
            block: new SimpleChange(null, component.block, true)
        });
        expect(component.questionIdToCharactersLeft).toEqual({
            AAA: 10,
            BBB: 1
        });
        expect(component.questionIdToCharacterLeftMsg).toEqual({
            AAA: ' characters remaining',
            BBB: ' character remaining'
        });
    });

    it('should not initialize characters and message text if questions do not allow details', () => {
        component.block.picklistOptions[0].allowDetails = false;
        component.block.picklistOptions[1].allowDetails = false;
        component.block.answer = null;
        component.ngOnChanges({
            block: new SimpleChange(null, component.block, true)
        });
        expect(component.questionIdToCharactersLeft).toEqual({});
        expect(component.questionIdToCharacterLeftMsg).toEqual({});
    });

    it('should recalculate characters and message text', () => {
        component.ngOnChanges({
            block: new SimpleChange(null, component.block, true)
        });
        component.block.answer[0].detail = 'T';
        component.updateCharactersLeftIndicator('BBB');
        expect(component.questionIdToCharactersLeft['BBB']).toBe(9);
        expect(component.questionIdToCharacterLeftMsg['BBB']).toBe(' characters remaining');
    });

    it('should return false if exclusive option was not selected', () => {
        expect(component.hasSelectedExclusiveOption()).toBeFalsy();
    });

    it('should return true if exclusive option was selected', () => {
        component.block.picklistOptions[1].exclusive = true;
        expect(component.hasSelectedExclusiveOption()).toBeTruthy();
    });

    it('should return answer detail text', () => {
        expect(component.getAnswerDetailText('BBB')).toBe('TEST TEST');
    });

    it('should return null if there is no answer with such stableId', () => {
        expect(component.getAnswerDetailText('STABLE_ID')).toBe(null);
    });
});
