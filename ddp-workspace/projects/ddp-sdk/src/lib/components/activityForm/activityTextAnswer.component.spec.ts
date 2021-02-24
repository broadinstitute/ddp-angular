import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ActivityTextQuestionBlock } from '../../models/activity/activityTextQuestionBlock';
import { TranslateTestingModule } from '../../testsupport/translateTestingModule';
import { InputType } from '../../models/activity/inputType';
import { TooltipComponent } from '../tooltip.component';
import { ActivityEmailInput } from './activityEmailInput.component';
import { QuestionPromptComponent } from './questionPrompt.component';
import { ActivityTextInput } from './activityTextInput.component';
import { ActivityTextAnswer } from './activityTextAnswer.component';

describe('ActivityTextAnswer', () => {
  let component: ActivityTextAnswer;
  let fixture: ComponentFixture<ActivityTextAnswer>;
  const configServiceSpy = jasmine.createSpyObj('ddp.config', [
    'tooltipIconUrl',
  ]);
  configServiceSpy.tooltipIconUrl.and.callFake(() => {
    return '/path/';
  });

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          ActivityTextAnswer,
          ActivityTextInput,
          ActivityEmailInput,
          QuestionPromptComponent,
          TooltipComponent,
        ],
        imports: [
          HttpClientTestingModule,
          FormsModule,
          MatAutocompleteModule,
          ReactiveFormsModule,
          NoopAnimationsModule,
          MatFormFieldModule,
          MatInputModule,
          BrowserAnimationsModule,
          TranslateTestingModule,
          MatTooltipModule,
        ],
        providers: [{ provide: 'ddp.config', useValue: configServiceSpy }],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityTextAnswer);
    expect(fixture instanceof ComponentFixture).toBe(true);
    expect(fixture.componentInstance instanceof ActivityTextAnswer).toBe(true);
    component = fixture.componentInstance;
    const block = new ActivityTextQuestionBlock();
    block.inputType = InputType.Text;
    block.question = 'Who are you?';
    block.tooltip = 'Helper text';
    block.stableId = 'stable_id';
    component.readonly = false;
    component.placeholder = 'nothing';
    component.block = block;
  });

  it('should render 1 tooltip', () => {
    fixture.detectChanges();
    const count = fixture.debugElement.queryAll(By.css('ddp-tooltip'));
    expect(count.length).toBe(1);
  });

  it('input and change work without autosuggest', fakeAsync(() => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
    const questionComponent = fixture.debugElement.query(
      By.directive(QuestionPromptComponent),
    );
    expect(questionComponent).not.toBeNull();
    console.log(fixture.debugElement);
    const inputElement: HTMLInputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;
    expect(inputElement).not.toBeFalsy();
    const valueToEmit = 'Boohoo';

    let valueChangedEmitted = false;

    // this is how we get the value out of component
    component.valueChanged.subscribe(val => {
      expect(val).toBe(valueToEmit);
      valueChangedEmitted = true;
      console.log('I got a value and it was' + val);
    });

    // sequence here of focus, set value, dispatch input and then change needed for test to work
    // ok as this is sort of how it will happen in actual component
    inputElement.focus();
    inputElement.value = valueToEmit;
    // got to do both of these events for things to work. OK as user will do same
    inputElement.dispatchEvent(new Event('input'));
    inputElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    // tick to allow subscription to be executed
    tick();
    expect(valueChangedEmitted).toBe(true);
  }));
});
