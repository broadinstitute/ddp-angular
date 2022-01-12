import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { TextQuestionBlockComponent } from './text-question-block.component';
import { TextQuestionDef } from '../../model/core/textQuestionDef';

const definitionBlock = {
    blockType: 'QUESTION' as any,
    question: {
        stableId: '',
        isRestricted: false,
        isDeprecated: false,
        promptTemplate: {
            templateType: 'HTML',
            templateText: '$__template__',
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
        questionType: 'TEXT',
        inputType: 'TEXT',
        suggestionType: 'NONE',
        placeholderTemplate: {
            templateType: 'HTML',
            templateText: '$__template__',
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
        suggestions: []
    } as TextQuestionDef,
    id: '1'
};

describe('TextQuestionBlockComponent', () => {
  let component: TextQuestionBlockComponent;
  let fixture: ComponentFixture<TextQuestionBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextQuestionBlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextQuestionBlockComponent);
    component = fixture.componentInstance;
    component.definitionBlock$ = of(definitionBlock);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
