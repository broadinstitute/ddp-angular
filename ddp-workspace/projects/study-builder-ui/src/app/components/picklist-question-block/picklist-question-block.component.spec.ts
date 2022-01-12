import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { PicklistQuestionBlockComponent } from './picklist-question-block.component';
import { PicklistQuestionDef } from '../../model/core/picklistQuestionDef';

const definitionBlock = {
    blockType: 'QUESTION' as any,
    question: {
        stableId: '',
        isRestricted: false,
        isDeprecated: false,
        promptTemplate: {
            templateText: '$__template__',
            templateType: 'HTML',
            variables: [
                {
                    name: '__template__',
                    translations: [
                        {
                            language: 'en',
                            text: ''
                        }
                    ]
                }
            ]
        },
        validations: [],
        hideNumber: false,
        questionType: 'PICKLIST',
        selectMode: 'SINGLE',
        renderMode: 'LIST',
        picklistLabelTemplate: {
            templateText: '$__template__',
            templateType: 'HTML',
            variables: [
                {
                    name: '__template__',
                    translations: [
                        {
                            language: 'en',
                            text: ''
                        }
                    ]
                }
            ]
        },
        groups: [],
        picklistOptions: []
    } as PicklistQuestionDef,
    id: '1'
};

describe('PicklistQuestionBlockComponent', () => {
  let component: PicklistQuestionBlockComponent;
  let fixture: ComponentFixture<PicklistQuestionBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PicklistQuestionBlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PicklistQuestionBlockComponent);
    component = fixture.componentInstance;
    component.definitionBlock$ = of(definitionBlock);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
