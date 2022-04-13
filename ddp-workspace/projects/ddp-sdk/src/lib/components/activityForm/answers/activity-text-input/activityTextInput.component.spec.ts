import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { InputType } from '../../../../models/activity/inputType';
import { ActivityTextQuestionBlock } from '../../../../models/activity/activityTextQuestionBlock';
import { TextSuggestion } from '../../../../models/activity/textSuggestion';
import { TranslateTestingModule } from '../../../../testsupport/translateTestingModule';
import { ActivityTextInput } from './activityTextInput.component';
import { FuncType } from 'ddp-sdk';

describe('ActivityTextInput', () => {
  let component: ActivityTextInput;
  let fixture: ComponentFixture<ActivityTextInput>;
  let block: ActivityTextQuestionBlock;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ActivityTextInput],
        imports: [
          FormsModule,
          ReactiveFormsModule,
          MatAutocompleteModule,
          NoopAnimationsModule,
          MatFormFieldModule,
          MatInputModule,
          BrowserAnimationsModule,
          TranslateTestingModule,
        ],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityTextInput);

    expect(fixture instanceof ComponentFixture).toBeTrue();
    expect(fixture.componentInstance instanceof ActivityTextInput).toBeTrue();

    block = new ActivityTextQuestionBlock();
    block.inputType = InputType.Text;
    block.question = 'Who are you?';
    block.stableId = 'sample';

    component = fixture.componentInstance;
    component.readonly = false;
    component.placeholder = 'nothing';
    component.block = block;
  });

  it('input change works without autosuggest', fakeAsync(() => {
    const enteredValue = 'New value';

    spyOn(component.valueChanged, 'emit');

    fixture.detectChanges();

    const inputEl: HTMLInputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;

    inputEl.focus();
    inputEl.value = enteredValue;
    inputEl.dispatchEvent(new Event('input'));

    tick(400);

    expect(component.valueChanged.emit).toHaveBeenCalledWith(enteredValue);
  }));

  it('renders 1 input field if "confirmEntry" is falsy', fakeAsync(() => {
    const inputList = fixture.debugElement.queryAll(By.css('input'));

    expect(inputList.length).toEqual(1);
  }));

  it('renders 2 input fields if "confirmEntry" is true', fakeAsync(() => {
    block.confirmEntry = true;

    fixture.detectChanges();

    const inputList = fixture.debugElement.queryAll(By.css('input'));

    expect(inputList.length).toEqual(2);
  }));

  it('passes placeholder to confirmation field if one is provided', fakeAsync(() => {
    const confirmPlaceholder = 'blah';

    block.confirmEntry = true;
    block.confirmPlaceholder = confirmPlaceholder;

    fixture.detectChanges();

    const inputList = fixture.debugElement.queryAll(By.css('input'));
    const confirmInputEl: HTMLInputElement = inputList[1].nativeElement;

    expect(confirmInputEl.dataset.placeholder).toEqual(confirmPlaceholder);
  }));

  it('input field should be disabled if "readonly" prop is true', () => {
    component.readonly = true;

    fixture.detectChanges();

    const inputEl: HTMLInputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;

    expect(inputEl.disabled).toBeTrue();
  });

  it('rebuilds the form if block prop has changed', () => {
    const initialFormGroup = component.formGroup;

    const newBlock = new ActivityTextQuestionBlock();
    newBlock.inputType = InputType.Text;
    newBlock.question = 'Am I new?';
    newBlock.readonly = false;
    newBlock.stableId = 'new';

    component.block = newBlock;

    fixture.detectChanges();

    expect(component.formGroup).not.toEqual(initialFormGroup);
  });

  it('calls suggestion source when input value changed', fakeAsync(() => {
    const enteredValue = 'blah';
    let suggestionSourceCalled = false;

    component.block.textSuggestionSource = (query$: Observable<string>) =>
      query$.pipe(
        map(query => {
          expect(query).toEqual(enteredValue);

          suggestionSourceCalled = true;

          return [];
        }),
      );

    fixture.detectChanges();

    const inputEl: HTMLInputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;

    inputEl.focus();
    inputEl.value = enteredValue;
    inputEl.dispatchEvent(new Event('input'));

    tick(400);

    expect(suggestionSourceCalled).toBeTrue();
  }));

  it('opens suggestions list', fakeAsync(() => {
    const matchingVal = 'Blah';
    const textSuggestions = buildTestTextSuggestions(matchingVal);

    component.block.textSuggestionSource = (query$: Observable<string>) =>
      query$.pipe(
        map(query => {
          if (query === matchingVal) {
            return textSuggestions;
          } else {
            return [];
          }
        }),
      );

    fixture.detectChanges();

    updateInputValue(fixture, 'input', matchingVal);

    tick(300);

    fixture.detectChanges();

    tick(300);

    const autoSuggestPanelEl: HTMLElement = fixture.debugElement.query(
      By.css('.autoCompletePanel'),
    ).nativeElement;
    let suggestionOptions = fixture.debugElement.queryAll(
      By.css('.autoCompleteOption'),
    );

    expect(isElementVisible(autoSuggestPanelEl)).toBeTrue();
    expect(suggestionOptions.length).toEqual(textSuggestions.length);

    updateInputValue(fixture, 'input', 'no match');

    tick(300);

    fixture.detectChanges();

    tick(300);

    suggestionOptions = fixture.debugElement.queryAll(
      By.css('.autoCompleteOption'),
    );

    expect(isElementVisible(autoSuggestPanelEl)).toBeFalse();
    expect(suggestionOptions.length).toEqual(0);
  }));

  it('emits valueChanged event if option selected', fakeAsync(() => {
    const matchingVal = 'Blah';
    const textSuggestions = buildTestTextSuggestions(matchingVal);

    spyOn(component.valueChanged, 'emit');

    component.block.textSuggestionSource = (query$: Observable<string>) =>
      query$.pipe(
        map(query => {
          if (query === matchingVal) {
            return textSuggestions;
          } else {
            return [];
          }
        }),
      );

    fixture.detectChanges();

    updateInputValue(fixture, 'input', matchingVal);

    tick(300);

    fixture.detectChanges();

    tick(300);

    const suggestionOptions = fixture.debugElement.queryAll(
      By.css('.autoCompleteOption'),
    );

    expect(suggestionOptions.length).toEqual(textSuggestions.length);

    const selectedOptionIndex = 1;
    const initialFormValue = component.formGroup.value;

    suggestionOptions[selectedOptionIndex].nativeElement.click();

    tick(300);

    expect(component.formGroup.value).not.toEqual(initialFormValue);
    expect(component.block.answer).toEqual(
      textSuggestions[selectedOptionIndex].value,
    );
    expect(component.valueChanged.emit).toHaveBeenCalledWith(
      textSuggestions[selectedOptionIndex].value,
    );
  }));

  it('computes tagged suggestions', () => {
    let suggestion: TextSuggestion = {
      value: 'Tylenol',
      matches: [{ offset: 0, length: 3 }],
    };

    suggestion = { value: 'Tylenol', matches: [] };
    expect(component.generateSuggestionOptionInnerHtml(suggestion, 'b')).toBe(
      'Tylenol',
    );

    suggestion = {
      value: 'Tylenol',
      matches: [
        { offset: 0, length: 3 },
        { offset: 4, length: 2 },
      ],
    };
    expect(component.generateSuggestionOptionInnerHtml(suggestion, 'b')).toBe(
      '<b>Tyl</b>e<b>no</b>l',
    );

    suggestion = {
      value: 'Tylenol',
      matches: [
        { offset: 0, length: 3 },
        { offset: 4, length: 3 },
      ],
    };
    expect(component.generateSuggestionOptionInnerHtml(suggestion, 'b')).toBe(
      '<b>Tyl</b>e<b>nol</b>',
    );

    suggestion = {
      value: 'Tylenol',
      matches: [
        { offset: 0, length: 3 },
        { offset: 4, length: 3 },
      ],
    };
    expect(
      component.generateSuggestionOptionInnerHtml(suggestion, 'span', 'nice'),
    ).toBe('<span class="nice">Tyl</span>e<span class="nice">nol</span>');
  });
});

const updateInputValue = (
  fixture: ComponentFixture<ActivityTextInput>,
  selector: string,
  value: string,
): void => {
  const inputEl: HTMLInputElement = fixture.debugElement.query(By.css(selector))
    .nativeElement;

  inputEl.focus();
  inputEl.value = value;
  inputEl.dispatchEvent(new Event('input'));
};

const isElementVisible: FuncType<boolean> = (el: HTMLElement) => (el.offsetParent && !el.hidden && el.offsetHeight !== 0);

const buildTestTextSuggestions = (matchingVal: string): TextSuggestion[] => {
  const textMatchValue = 'The Blahney Stone';
  const textMatch: TextSuggestion = {
    value: textMatchValue,
    matches: [
      {
        length: matchingVal.length,
        offset: textMatchValue.indexOf(matchingVal),
      },
    ],
  };
  const textDoesNotMatch: TextSuggestion = {
    value: 'Tylenol',
    matches: [
      { offset: 0, length: 3 },
      { offset: 4, length: 2 },
    ],
  };

  return [textMatch, textDoesNotMatch];
};
