import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { of } from 'rxjs';

import { ActivityDynamicSelectQuestionBlock } from '../../../../models/activity/activityDynamicSelectQuestionBlock';
import { DynamicSelectAnswerService } from '../../../../services/serviceAgents/dynamicSelectAnswer.service';
import { QuestionPromptComponent } from '../question-prompt/questionPrompt.component';
import { ActivityDynamicSelectAnswer } from './activity-dynamic-select-answer.component';

describe('ActivityDynamicSelectAnswer', () => {
  let fixture: ComponentFixture<ActivityDynamicSelectAnswer>;
  let block: ActivityDynamicSelectQuestionBlock;
  let component: ActivityDynamicSelectAnswer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityDynamicSelectAnswer, QuestionPromptComponent],
      imports: [
        NoopAnimationsModule,
        MatFormFieldModule,
        MatSelectModule,
        BrowserAnimationsModule,
      ],
      providers: [
        {
          provide: DynamicSelectAnswerService,
          useValue: {
            getOptions: () =>
              of([
                {
                  answerGuid: 'ANSWERGUID1',
                  answerValue: 'Bob',
                },
                {
                  answerGuid: 'ANSWERGUID2',
                  answerValue: 'Alice',
                },
              ]),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityDynamicSelectAnswer);

    expect(fixture instanceof ComponentFixture).toBeTrue();
    expect(
      fixture.componentInstance instanceof ActivityDynamicSelectAnswer,
    ).toBeTrue();

    block = new ActivityDynamicSelectQuestionBlock();
    block.stableId = 'STABLE_ID';

    component = fixture.componentInstance;
    component.readonly = false;
    component.block = block;
  });

  it('should create without errors', () => {
    expect(component).toBeDefined();
  });

  it('renders question prompt if one is provided', () => {
    const questionPrompt = 'How are you?';

    block.question = questionPrompt;

    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.textContent).toContain(
      questionPrompt,
    );
  });

  it('renders label if one is provided', () => {
    const label = 'Provide your answer';

    block.label = label;

    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('mat-label'));

    expect(el).toBeDefined();
    expect(el.nativeElement.textContent).toContain(label);
  });

  it('renders placeholder if one is provided', () => {
    const placeholderContent = 'Select option';

    block.placeholder = placeholderContent;

    fixture.detectChanges();

    const matPlaceholder = fixture.debugElement.query(
      By.css('.mat-select-placeholder'),
    );

    expect(matPlaceholder).not.toBeNull();
    expect(matPlaceholder.nativeElement.textContent).toContain(
      placeholderContent,
    );
  });

  it('disables input if readonly flag is true', () => {
    component.readonly = true;

    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('.mat-select'));

    expect(el).not.toBeNull();
    expect(el.attributes['aria-disabled']).toEqual('true');
  });

  it('tries to get options on first render', done => {
    component.options$.subscribe(options => {
      if (options.length) {
        done();
      }
    });

    component.ngOnInit();
  });

  it('tries to get options when panel is opened', () => {
    component.ngOnInit();

    const initialOptions = component.options$.getValue();

    expect(initialOptions.length).toEqual(2);

    (component as any).dynamicSelectAnswerService = {
      getOptions: () =>
        of([
          {
            answerGuid: 'ANSWERGUID1',
            answerValue: 'Bob',
          },
          {
            answerGuid: 'ANSWERGUID2',
            answerValue: 'Alice',
          },
          {
            answerGuid: 'ANSWERGUID3',
            answerValue: 'Jackie',
          },
        ]),
    };

    component.onOpen();

    const updatedOptions = component.options$.getValue();

    expect(initialOptions.length).not.toEqual(updatedOptions.length);
  });

  it('renders options', () => {
    component.ngOnInit();

    fixture.detectChanges();

    const selectTrigger = fixture.debugElement.query(
      By.css('.mat-select-trigger'),
    );

    expect(selectTrigger).not.toBeNull();

    selectTrigger.nativeElement.click();

    fixture.detectChanges();

    const selectPanel = fixture.debugElement.query(By.css('.mat-select-panel'));

    expect(selectPanel).not.toBeNull();

    const options = fixture.debugElement.queryAll(By.css('.mat-option'));

    expect(options.length).toEqual(2);
  });

  it('emits `valueChanged` event when option is selected', () => {
    const value = spyOn(component.valueChanged, 'emit');

    component.ngOnInit();

    fixture.detectChanges();

    const selectTriggerEl = fixture.debugElement.query(
      By.css('.mat-select-trigger'),
    ).nativeElement;

    selectTriggerEl.click();

    fixture.detectChanges();

    const firstOption = fixture.debugElement.query(By.css('.mat-option'));

    firstOption.nativeElement.click();

    expect(value).toHaveBeenCalledTimes(1);

    const options = component.options$.getValue();
    const firstOptionValue = options[0].answerGuid;

    expect(value).toHaveBeenCalledWith(firstOptionValue);
  });

  it('correctly updates rendered text if option was selected', () => {
    component.ngOnInit();

    fixture.detectChanges();

    const selectTriggerEl = fixture.debugElement.query(
      By.css('.mat-select-trigger'),
    ).nativeElement;

    selectTriggerEl.click();

    fixture.detectChanges();

    const firstOption = fixture.debugElement.query(By.css('.mat-option'));

    firstOption.nativeElement.click();

    fixture.detectChanges();

    const displayedText = fixture.debugElement
      .query(By.css('.mat-select-value-text'))
      .nativeElement.textContent.trim();
    const firstOptionText = component.options$.getValue()[0].answerValue;

    expect(displayedText).toEqual(firstOptionText);
  });
});
