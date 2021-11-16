import { ChangeDetectorRef, SimpleChange } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';

import {
  ActivityMatrixQuestionBlock,
  Group,
  Option,
  Question,
  SelectMode,
} from '../../../../models/activity/activityMatrixQuestionBlock';
import { ActivityMatrixAnswerDto } from '../../../../models/activity/activityMatrixAnswerDto';
import { QuestionPromptComponent } from '../question-prompt/questionPrompt.component';
import { ActivityMatrixAnswer } from './activity-matrix-answer.component';

const mockQuestions: Question[] = [
  {
    stableId: 'Q1',
    questionLabel: 'How often do you eat fruits?',
    tooltip: null,
  },
  {
    stableId: 'Q2',
    questionLabel: 'How often do you eat vegetables?',
    tooltip: null,
  },
];
const mockGroups: Group[] = [
  {
    identifier: 'G1',
    name: 'Group 1',
  },
  {
    identifier: 'G2',
    name: 'Group 2',
  },
];
const mockOptions: Option[] = [
  {
    exclusive: false,
    stableId: 'ONCE_WEEK',
    optionLabel: 'Once a week',
    tooltip: null,
    groupId: mockGroups[0].identifier,
  },
  {
    exclusive: false,
    stableId: 'TWICE_WEEK',
    optionLabel: 'Twice a week',
    tooltip: null,
    groupId: mockGroups[1].identifier,
  },
];
const mockExclusiveOptions: Option[] = [
  {
    exclusive: true,
    stableId: 'O1',
    tooltip: null,
    groupId: mockGroups[0].identifier,
    optionLabel: 'I am exclusive!',
  },
  {
    exclusive: false,
    stableId: 'O2',
    tooltip: null,
    groupId: mockGroups[0].identifier,
    optionLabel: 'I am not exclusive!',
  },
  {
    exclusive: false,
    stableId: 'O3',
    tooltip: null,
    groupId: mockGroups[0].identifier,
    optionLabel: 'I am not exclusive as well!',
  },
  {
    exclusive: false,
    stableId: 'O4',
    tooltip: null,
    groupId: mockGroups[1].identifier,
    optionLabel: 'I am from different group...',
  },
];

describe('ActivityMatrixAnswer', () => {
  let fixture: ComponentFixture<ActivityMatrixAnswer>;
  let block: ActivityMatrixQuestionBlock;
  let component: ActivityMatrixAnswer;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [QuestionPromptComponent, ActivityMatrixAnswer],
        imports: [MatRadioModule, MatCheckboxModule],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityMatrixAnswer);

    block = new ActivityMatrixQuestionBlock();
    block.selectMode = SelectMode.Single;
    block.question = 'Answer following questions';
    block.stableId = 'MATRIX_BLOCK';
    block.questions = [];
    block.groups = [];
    block.options = [];

    component = fixture.componentInstance;
    component.readonly = false;
    component.block = block;
  });

  it('should create component', () => {
    expect(fixture instanceof ComponentFixture).toBeTrue();
    expect(fixture.componentInstance instanceof ActivityMatrixAnswer).toBeTrue();
  });

  it('renders question prompt is one is provided', () => {
    const prompt = 'How are you?';
    block.question = prompt;

    component.ngOnChanges({ block: new SimpleChange(null, block, true) });
    fixture.detectChanges();

    const questionPrompt = fixture.debugElement.query(By.css('.ddp-question-prompt'));

    expect(questionPrompt).not.toBe(null);

    const textPrompt = questionPrompt.nativeElement.textContent.trim();

    expect(textPrompt).toBe(prompt);
  });

  it('renders table element', () => {
    const tableEl = fixture.debugElement.query(By.css('[data-test-id="matrix-answer-table"]'));

    expect(tableEl).not.toBe(null);
  });

  it('renders groups header row if there are any', () => {
    const prevBlock = component.block;

    const newBlock = new ActivityMatrixQuestionBlock();
    newBlock.selectMode = SelectMode.Single;
    newBlock.question = prevBlock.question;
    newBlock.stableId = prevBlock.stableId;
    newBlock.questions = mockQuestions;
    newBlock.groups = mockGroups;
    newBlock.options = mockOptions;

    component.block = newBlock;

    fixture.componentInstance.ngOnChanges({ block: new SimpleChange(prevBlock, newBlock, true) });
    fixture.detectChanges();

    const headerEl = fixture.debugElement.query(By.css('[data-test-id="table-header-groups"]'));

    expect(headerEl).not.toBe(null);
  });

  it('does not render groups header if there are no groups (or only 1 present)', () => {
    const prevBlock = component.block;

    const newBlock = new ActivityMatrixQuestionBlock();
    newBlock.selectMode = SelectMode.Single;
    newBlock.question = prevBlock.question;
    newBlock.stableId = prevBlock.stableId;
    newBlock.questions = mockQuestions;
    newBlock.groups = [];
    newBlock.options = mockOptions.map(mockOption => ({ ...mockOption, groupId: null }));

    component.block = newBlock;

    fixture.componentInstance.ngOnChanges({ block: new SimpleChange(prevBlock, newBlock, true) });
    fixture.detectChanges();

    const headerEl = fixture.debugElement.query(By.css('[data-test-id="table-header-groups"]'));

    expect(headerEl).toBe(null);
  });

  it('renders group names', () => {
    const prevBlock = component.block;

    const newBlock = new ActivityMatrixQuestionBlock();
    newBlock.selectMode = SelectMode.Single;
    newBlock.question = prevBlock.question;
    newBlock.stableId = prevBlock.stableId;
    newBlock.questions = mockQuestions;
    newBlock.groups = mockGroups;
    newBlock.options = mockOptions;

    component.block = newBlock;

    fixture.componentInstance.ngOnChanges({ block: new SimpleChange(prevBlock, newBlock, true) });
    fixture.detectChanges();

    mockGroups.forEach(mockGroup => {
      const cell = fixture.debugElement.query(By.css(`[data-test-id="group-name-cell-${mockGroup.identifier}"]`));

      expect(cell).not.toBe(null);

      const cellTextContent = cell.nativeElement.textContent.trim();

      expect(cellTextContent).toEqual(mockGroup.name);
    });
  });

  it('renders options labels', () => {
    const prevBlock = component.block;

    const newBlock = new ActivityMatrixQuestionBlock();
    newBlock.selectMode = SelectMode.Single;
    newBlock.question = prevBlock.question;
    newBlock.stableId = prevBlock.stableId;
    newBlock.questions = mockQuestions;
    newBlock.groups = mockGroups;
    newBlock.options = mockOptions;

    component.block = newBlock;

    fixture.componentInstance.ngOnChanges({ block: new SimpleChange(prevBlock, newBlock, true) });
    fixture.detectChanges();

    mockOptions.forEach(mockOption => {
      const cell = fixture.debugElement.query(By.css(`[data-test-id="option-label-cell-${mockOption.stableId}"]`));

      expect(cell).not.toBe(null);

      const cellTextContent = cell.nativeElement.textContent.trim();

      expect(cellTextContent).toEqual(mockOption.optionLabel);
    });
  });

  it('renders questions labels', () => {
    const prevBlock = component.block;

    const newBlock = new ActivityMatrixQuestionBlock();
    newBlock.selectMode = SelectMode.Single;
    newBlock.question = prevBlock.question;
    newBlock.stableId = prevBlock.stableId;
    newBlock.questions = mockQuestions;
    newBlock.groups = mockGroups;
    newBlock.options = mockOptions;

    component.block = newBlock;

    fixture.componentInstance.ngOnChanges({ block: new SimpleChange(prevBlock, newBlock, true) });
    fixture.detectChanges();

    mockQuestions.forEach(mockQuestion => {
      const cell = fixture.debugElement.query(By.css(`[data-test-id="question-label-cell-${mockQuestion.stableId}"]`));

      expect(cell).not.toBe(null);

      const cellTextContent = cell.nativeElement.textContent.trim();

      expect(cellTextContent).toEqual(mockQuestion.questionLabel);
    });
  });

  it('renders radio buttons when selectMode = "SINGLE"', () => {
    const prevBlock = component.block;

    const newBlock = new ActivityMatrixQuestionBlock();
    newBlock.selectMode = SelectMode.Single;
    newBlock.question = prevBlock.question;
    newBlock.stableId = prevBlock.stableId;
    newBlock.questions = mockQuestions;
    newBlock.groups = mockGroups;
    newBlock.options = mockOptions;

    component.block = newBlock;

    fixture.componentInstance.ngOnChanges({ block: new SimpleChange(prevBlock, newBlock, true) });
    fixture.detectChanges();

    const radioList = fixture.debugElement.queryAll(By.css('[data-test-id="radio-option"]'));
    const totalRenderedOptionsCount = mockQuestions.length * mockOptions.length;

    expect(radioList.length).toEqual(totalRenderedOptionsCount);

    radioList.forEach(el => {
      expect(el.nativeElement.tagName.toLowerCase()).toEqual('mat-radio-button');
    });
  });

  it('renders checkboxes when selectMode = "MULTIPLE"', () => {
    const prevBlock = component.block;

    const newBlock = new ActivityMatrixQuestionBlock();
    newBlock.selectMode = SelectMode.Multiple;
    newBlock.question = prevBlock.question;
    newBlock.stableId = prevBlock.stableId;
    newBlock.questions = mockQuestions;
    newBlock.groups = mockGroups;
    newBlock.options = mockOptions;

    component.block = newBlock;

    fixture.componentInstance.ngOnChanges({ block: new SimpleChange(prevBlock, newBlock, true) });
    fixture.detectChanges();

    const checkboxList = fixture.debugElement.queryAll(By.css('[data-test-id="checkbox-option"]'));
    const totalRenderedOptionsCount = mockQuestions.length * mockOptions.length;

    expect(checkboxList.length).toEqual(totalRenderedOptionsCount);

    checkboxList.forEach(el => {
      expect(el.nativeElement.tagName.toLowerCase()).toEqual('mat-checkbox');
    });
  });

  it('disables radio buttons in readonly mode', fakeAsync(async () => {
    const prevBlock = component.block;

    const newBlock = new ActivityMatrixQuestionBlock();
    newBlock.selectMode = SelectMode.Single;
    newBlock.question = prevBlock.question;
    newBlock.stableId = prevBlock.stableId;
    newBlock.questions = mockQuestions;
    newBlock.groups = mockGroups;
    newBlock.options = mockOptions;

    component.block = newBlock;

    fixture.componentInstance.ngOnChanges({ block: new SimpleChange(prevBlock, newBlock, true) });
    fixture.detectChanges();

    let radioInputList = fixture.debugElement.queryAll(By.css('.mat-radio-input'));

    radioInputList.forEach(el => {
      expect(el.nativeElement.getAttribute('disabled')).toBe(null);
    });

    component.readonly = true;

    await runOnPushChangeDetection(fixture);

    radioInputList = fixture.debugElement.queryAll(By.css('.mat-radio-input'));

    radioInputList.forEach(el => {
      expect(['', 'true']).toContain(el.nativeElement.getAttribute('disabled'));
    });
  }));

  it('disables checkboxes in readonly mode', fakeAsync(async () => {
    const prevBlock = component.block;

    const newBlock = new ActivityMatrixQuestionBlock();
    newBlock.selectMode = SelectMode.Multiple;
    newBlock.question = prevBlock.question;
    newBlock.stableId = prevBlock.stableId;
    newBlock.questions = mockQuestions;
    newBlock.groups = mockGroups;
    newBlock.options = mockOptions;

    component.block = newBlock;

    fixture.componentInstance.ngOnChanges({ block: new SimpleChange(prevBlock, newBlock, true) });
    fixture.detectChanges();

    let checkboxList = fixture.debugElement.queryAll(By.css('.mat-checkbox-input'));

    checkboxList.forEach(el => {
      expect(el.nativeElement.getAttribute('disabled')).toBe(null);
    });

    component.readonly = true;

    await runOnPushChangeDetection(fixture);

    checkboxList = fixture.debugElement.queryAll(By.css('.mat-checkbox-input'));

    checkboxList.forEach(el => {
      expect(['', 'true']).toContain(el.nativeElement.getAttribute('disabled'));
    });
  }));

  it('emits `valueChanged` event when a radio button is clicked', () => {
    spyOn(component.valueChanged, 'emit');

    const prevBlock = component.block;

    const newBlock = new ActivityMatrixQuestionBlock();
    newBlock.selectMode = SelectMode.Single;
    newBlock.question = prevBlock.question;
    newBlock.stableId = prevBlock.stableId;
    newBlock.questions = mockQuestions;
    newBlock.groups = mockGroups;
    newBlock.options = mockOptions;

    component.block = newBlock;

    fixture.componentInstance.ngOnChanges({ block: new SimpleChange(prevBlock, newBlock, true) });
    fixture.detectChanges();

    const firstRadioOption = fixture.debugElement.query(By.css('.mat-radio-input'));
    const prevAnswer = component.block.answer;

    firstRadioOption.nativeElement.click();

    expect(component.valueChanged.emit).toHaveBeenCalledTimes(1);
    expect(prevAnswer).not.toEqual(component.block.answer);
  });

  it('allows user to answer multiple questions when `selectMode` is `SINGLE`', () => {
    spyOn(component.valueChanged, 'emit');

    const prevBlock = component.block;

    const newBlock = new ActivityMatrixQuestionBlock();
    newBlock.selectMode = SelectMode.Single;
    newBlock.question = prevBlock.question;
    newBlock.stableId = prevBlock.stableId;
    newBlock.questions = mockQuestions;
    newBlock.groups = mockGroups;
    newBlock.options = mockOptions;

    component.block = newBlock;

    fixture.componentInstance.ngOnChanges({ block: new SimpleChange(prevBlock, newBlock, true) });
    fixture.detectChanges();

    const firstQuestionStableId = mockQuestions[0].stableId;
    const secondQuestionStableId = mockQuestions[1].stableId;
    const firstOptionStableId = mockOptions[0].stableId;
    const secondOptionStableId = mockOptions[1].stableId;

    const firstQuestionOption = fixture.debugElement.query(
      By.css(`[data-test-radio-id="radio-option-${firstQuestionStableId}-${firstOptionStableId}"] .mat-radio-input`),
    );
    const secondQuestionOption = fixture.debugElement.query(
      By.css(`[data-test-radio-id="radio-option-${secondQuestionStableId}-${secondOptionStableId}"] .mat-radio-input`),
    );

    expect(firstQuestionOption).not.toBe(null);
    expect(secondQuestionOption).not.toBe(null);

    firstQuestionOption.nativeElement.click();
    secondQuestionOption.nativeElement.click();

    expect(component.valueChanged.emit).toHaveBeenCalledTimes(2);
    expect(component.block.answer.length).toBe(2);
  });

  it('displays previously given answers when `selectMode` is `SINGLE`', () => {
    const prevBlock = component.block;

    const newBlock = new ActivityMatrixQuestionBlock();
    newBlock.selectMode = SelectMode.Single;
    newBlock.question = prevBlock.question;
    newBlock.stableId = prevBlock.stableId;
    newBlock.questions = mockQuestions;
    newBlock.groups = mockGroups;
    newBlock.options = mockOptions;
    newBlock.setAnswer([
      {
        rowStableId: mockQuestions[0].stableId,
        groupStableId: mockGroups[0].identifier,
        optionStableId: mockOptions[0].stableId,
      },
      {
        rowStableId: mockQuestions[1].stableId,
        groupStableId: mockGroups[1].identifier,
        optionStableId: mockOptions[1].stableId,
      },
    ]);

    component.block = newBlock;

    fixture.componentInstance.ngOnChanges({ block: new SimpleChange(prevBlock, newBlock, true) });
    fixture.detectChanges();

    const firstOptionSelector = `[data-test-radio-id="radio-option-${mockQuestions[0].stableId}-${mockOptions[0].stableId}"]`;
    const secondOptionSelector = `[data-test-radio-id="radio-option-${mockQuestions[1].stableId}-${mockOptions[1].stableId}"]`;
    const firstOption = fixture.debugElement.query(By.css(`${firstOptionSelector} .mat-radio-input`));
    const secondOption = fixture.debugElement.query(By.css(`${secondOptionSelector} .mat-radio-input`));

    expect(firstOption).not.toBe(null);
    expect(secondOption).not.toBe(null);

    expect(firstOption.nativeElement.checked).toBeTrue();
    expect(secondOption.nativeElement.checked).toBeTrue();

    const otherOptions = fixture.debugElement.queryAll(
      By.css(`[data-test-id="radio-option"]:not(${firstOptionSelector}):not(${secondOptionSelector}) .mat-radio-input`),
    );

    otherOptions.forEach(el => {
      expect(el.nativeElement.checked).toBeFalse();
    });
  });

  it('allow user to select options when `selectMode` is `MULTIPLE`', () => {
    spyOn(component.valueChanged, 'emit');

    const prevBlock = component.block;

    const newBlock = new ActivityMatrixQuestionBlock();
    newBlock.selectMode = SelectMode.Multiple;
    newBlock.question = prevBlock.question;
    newBlock.stableId = prevBlock.stableId;
    newBlock.questions = mockQuestions;
    newBlock.groups = mockGroups;
    newBlock.options = mockOptions;

    component.block = newBlock;

    fixture.componentInstance.ngOnChanges({ block: new SimpleChange(prevBlock, newBlock, true) });
    fixture.detectChanges();

    mockQuestions.forEach(mockQuestion => {
      mockOptions.forEach(mockOption => {
        const checkbox = fixture.debugElement.query(
          By.css(
            `[data-test-checkbox-id="checkbox-option-${mockQuestion.stableId}-${mockOption.stableId}"] .mat-checkbox-input`,
          ),
        );

        checkbox.nativeElement.click();
      });
    });

    const totalCallCount = mockQuestions.length * mockOptions.length;

    expect(component.valueChanged.emit).toHaveBeenCalledTimes(totalCallCount);
    expect(component.block.answer.length).toBe(totalCallCount);
  });

  it('displays previously given answers when `selectMode` is `MULTIPLE`', () => {
    const prevBlock = component.block;

    const newBlock = new ActivityMatrixQuestionBlock();
    newBlock.selectMode = SelectMode.Multiple;
    newBlock.question = prevBlock.question;
    newBlock.stableId = prevBlock.stableId;
    newBlock.questions = mockQuestions;
    newBlock.groups = mockGroups;
    newBlock.options = mockOptions;

    const [q1, q2] = mockQuestions;
    const [g1, g2] = mockGroups;
    const [o1, o2] = mockOptions;

    newBlock.setAnswer([
      {
        rowStableId: q1.stableId,
        groupStableId: g1.identifier,
        optionStableId: o1.stableId,
      },
      {
        rowStableId: q2.stableId,
        groupStableId: g2.identifier,
        optionStableId: o2.stableId,
      },
    ]);

    component.block = newBlock;

    fixture.componentInstance.ngOnChanges({ block: new SimpleChange(prevBlock, newBlock, true) });
    fixture.detectChanges();

    const checkbox1 = fixture.debugElement.query(
      By.css(`[data-test-checkbox-id="checkbox-option-${q1.stableId}-${o1.stableId}"] .mat-checkbox-input`),
    );
    const checkbox2 = fixture.debugElement.query(
      By.css(`[data-test-checkbox-id="checkbox-option-${q2.stableId}-${o2.stableId}"] .mat-checkbox-input`),
    );

    [checkbox1, checkbox2].forEach(checkbox => {
      expect(checkbox.nativeElement.checked).toBeTrue();
    });
  });

  it('selection of `exclusive` option unchecks other options in same group', () => {
    const prevBlock = component.block;

    const newBlock = new ActivityMatrixQuestionBlock();
    newBlock.selectMode = SelectMode.Multiple;
    newBlock.question = prevBlock.question;
    newBlock.stableId = prevBlock.stableId;
    newBlock.questions = mockQuestions;
    newBlock.groups = mockGroups;
    newBlock.options = mockExclusiveOptions;

    const [q1, q2] = mockQuestions;
    const [g1, g2] = mockGroups;
    const [o1, o2, o3, o4] = mockExclusiveOptions;

    newBlock.setAnswer([
      {
        rowStableId: q1.stableId,
        groupStableId: g1.identifier,
        optionStableId: o2.stableId,
      },
      {
        rowStableId: q1.stableId,
        groupStableId: g1.identifier,
        optionStableId: o3.stableId,
      },
      {
        rowStableId: q1.stableId,
        groupStableId: g2.identifier,
        optionStableId: o4.stableId,
      },
      {
        rowStableId: q2.stableId,
        groupStableId: g1.identifier,
        optionStableId: o1.stableId,
      },
    ]);

    component.block = newBlock;

    fixture.componentInstance.ngOnChanges({ block: new SimpleChange(prevBlock, newBlock, true) });
    fixture.detectChanges();

    const exclusiveCheckbox = fixture.debugElement.query(
      By.css(`[data-test-checkbox-id="checkbox-option-${q1.stableId}-${o1.stableId}"] .mat-checkbox-input`),
    );

    expect(exclusiveCheckbox).not.toBe(null);

    exclusiveCheckbox.nativeElement.click();

    const newAnswer: ActivityMatrixAnswerDto[] = [
      /**
       * Keep answer for second group
       */
      {
        rowStableId: q1.stableId,
        groupStableId: g2.identifier,
        optionStableId: o4.stableId,
      },
      /**
       * Keep answer for second question
       */
      {
        rowStableId: q2.stableId,
        groupStableId: g1.identifier,
        optionStableId: o1.stableId,
      },
      {
        rowStableId: q1.stableId,
        groupStableId: g1.identifier,
        optionStableId: o1.stableId,
      },
    ];

    expect(component.block.answer).toEqual(newAnswer);
  });

  it(`selection of a regular option unchecks exclusive option in same group`, () => {
    const prevBlock = component.block;

    const newBlock = new ActivityMatrixQuestionBlock();
    newBlock.selectMode = SelectMode.Multiple;
    newBlock.question = prevBlock.question;
    newBlock.stableId = prevBlock.stableId;
    newBlock.questions = mockQuestions;
    newBlock.groups = mockGroups;
    newBlock.options = mockExclusiveOptions;

    const [q1, q2] = mockQuestions;
    const [g1] = mockGroups;
    const [o1, o2, o3] = mockExclusiveOptions;

    newBlock.setAnswer([
      {
        rowStableId: q1.stableId,
        groupStableId: g1.identifier,
        optionStableId: o1.stableId,
      },
      {
        rowStableId: q2.stableId,
        groupStableId: g1.identifier,
        optionStableId: o2.stableId,
      },
      {
        rowStableId: q2.stableId,
        groupStableId: g1.identifier,
        optionStableId: o3.stableId,
      },
    ]);

    component.block = newBlock;

    fixture.componentInstance.ngOnChanges({ block: new SimpleChange(prevBlock, newBlock, true) });
    fixture.detectChanges();

    const checkbox = fixture.debugElement.query(
      By.css(`[data-test-checkbox-id="checkbox-option-${q1.stableId}-${o2.stableId}"] .mat-checkbox-input`),
    );

    checkbox.nativeElement.click();

    const newAnswer: ActivityMatrixAnswerDto[] = [
      /**
       * Remove exclusive option, add new second regular one and keep two others for second question
       */
      {
        rowStableId: q2.stableId,
        groupStableId: g1.identifier,
        optionStableId: o2.stableId,
      },
      {
        rowStableId: q2.stableId,
        groupStableId: g1.identifier,
        optionStableId: o3.stableId,
      },
      {
        rowStableId: q1.stableId,
        groupStableId: g1.identifier,
        optionStableId: o2.stableId,
      },
    ];

    expect(component.block.answer).toEqual(newAnswer);
  });
});

const runOnPushChangeDetection = async (fixture: ComponentFixture<ActivityMatrixAnswer>): Promise<any> => {
  const cdr = fixture.debugElement.injector.get(ChangeDetectorRef);

  cdr.detectChanges();

  return fixture.whenStable();
};
