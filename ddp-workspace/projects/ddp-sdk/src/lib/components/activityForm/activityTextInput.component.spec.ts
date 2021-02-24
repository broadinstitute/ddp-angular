import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ActivityTextQuestionBlock } from '../../models/activity/activityTextQuestionBlock';
import { InputType } from '../../models/activity/inputType';
import { TextSuggestion } from '../../models/activity/textSuggestion';
import { ActivityTextInput } from './activityTextInput.component';

/**
 * Link to test that panel is open
 * https://github.com/angular/material2/blob/106d274ef99533779ff8674597e844308a95131f/src/lib/autocomplete/autocomplete.spec.ts#L99-L123
 */

describe('ActivityTextInput', () => {
  let component: ActivityTextInput;
  let fixture: ComponentFixture<ActivityTextInput>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          FormsModule,
          ReactiveFormsModule,
          MatAutocompleteModule,
          MatFormFieldModule,
          MatInputModule,
          NoopAnimationsModule,
        ],
        declarations: [ActivityTextInput],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityTextInput);

    expect(fixture instanceof ComponentFixture).toBeTruthy();
    expect(fixture.componentInstance instanceof ActivityTextInput).toBeTruthy();

    component = fixture.componentInstance;

    const block = new ActivityTextQuestionBlock();
    block.inputType = InputType.Text;
    block.question = 'Test question';
    block.stableId = 'test_question';

    component.block = block;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('input and change work without autosuggest', fakeAsync(() => {
    expect(component).toBeTruthy();

    fixture.detectChanges();

    const inputEl: HTMLInputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;

    expect(inputEl).not.toBeFalsy();

    const valueToEmit = 'Enter me';
    let valueChangedEmitted = false;

    component.valueChanged.subscribe(value => {
      expect(value).toBe(valueToEmit);

      valueChangedEmitted = true;
    });

    inputEl.focus();
    inputEl.value = valueToEmit;
    inputEl.dispatchEvent(new Event('input'));
    inputEl.dispatchEvent(new Event('change'));

    fixture.detectChanges();

    tick(400);

    expect(valueChangedEmitted).toBeTruthy();
  }));

  it('expect suggestion source to be called when input entered', fakeAsync(() => {
    const enteredValue = 'Enter me';
    let dataSourceProviderExecuted = false;

    component.block.textSuggestionSource = (query$: Observable<string>) =>
      query$.pipe(
        map(query => {
          expect(query).toBe(enteredValue);

          dataSourceProviderExecuted = true;

          return [];
        }),
      );

    fixture.detectChanges();

    const inputDebugEl = fixture.debugElement.query(By.css('input'));

    setInputValue(inputDebugEl, enteredValue);

    fixture.detectChanges();

    tick(400);

    expect(dataSourceProviderExecuted).toBeTrue();
  }));

  it('autosuggest options are opened at right time', fakeAsync(() => {
    const matchingValue = 'Blah';
    const textSuggestions = buildTestTextSuggestions(matchingValue);

    component.block.textSuggestionSource = (query$: Observable<string>) =>
      query$.pipe(
        map(query => (query === matchingValue ? textSuggestions : [])),
      );

    fixture.detectChanges();

    const inputDebugEl = fixture.debugElement.query(By.css('input'));

    setInputValue(inputDebugEl, 'No match');

    fixture.detectChanges();

    const autoCompletePanel = fixture.debugElement.query(
      By.css('.autoCompletePanel'),
    );
    let autoCompleteOptions = fixture.debugElement.query(
      By.css('.autoCompleteOption'),
    );

    expect(autoCompletePanel).toBeTruthy();
    expect(isElementVisible(autoCompletePanel.nativeElement)).toBeFalsy();
    expect(autoCompleteOptions).toBeFalsy();

    // Set matching input
    setInputValue(inputDebugEl, matchingValue);

    fixture.detectChanges();
    tick(400);
    fixture.detectChanges();

    expect(isElementVisible(autoCompletePanel.nativeElement)).toBeTruthy();

    autoCompleteOptions = fixture.debugElement.query(
      By.css('.autoCompleteOption'),
    );

    expect(autoCompleteOptions).toBeTruthy();
    expect(autoCompletePanel.nativeElement.children.length).toEqual(
      textSuggestions.length,
    );

    setInputValue(inputDebugEl, 'empty');

    fixture.detectChanges();
    tick(400);
    fixture.detectChanges();

    expect(isElementVisible(autoCompletePanel.nativeElement)).toBeFalse();
    expect(autoCompletePanel.nativeElement.children.length).toEqual(0);

    tick(10000);
  }));

  it('select matching option from list', fakeAsync(() => {
    const matchingValue = 'Blah';
    const textSuggestions = buildTestTextSuggestions(matchingValue);

    component.block.textSuggestionSource = (query$: Observable<string>) =>
      query$.pipe(
        map(query => (query === matchingValue ? textSuggestions : [])),
      );

    fixture.detectChanges();

    const inputDebugEl = fixture.debugElement.query(By.css('input'));

    setInputValue(inputDebugEl, matchingValue);

    fixture.detectChanges();
    tick(400);
    fixture.detectChanges();

    const autoCompletePanel = fixture.debugElement.query(
      By.css('.autoCompletePanel'),
    );

    expect(isElementVisible(autoCompletePanel.nativeElement));

    const selectedOptionIdx = 1;
    let valueChanged = false;

    component.valueChanged.subscribe(value => {
      expect(value).toEqual(textSuggestions[selectedOptionIdx].value);

      valueChanged = true;
    });

    inputDebugEl.nativeElement.dispatchEvent(new Event('focusin'));

    fixture.detectChanges();
    tick();

    const suggestionOptionEl = fixture.debugElement.queryAll(
      By.css('.autoCompleteOption'),
    )[selectedOptionIdx];

    suggestionOptionEl.nativeElement.click();

    fixture.detectChanges();
    tick(400);

    expect(valueChanged).toBeTrue();
  }));

  it('Compute tagged text suggestion', fakeAsync(() => {
    let suggestion: TextSuggestion = {
      value: 'Tylenol',
      matches: [{ offset: 0, length: 3 }],
    };
    expect(component.generateSuggestionOptionInnerHtml(suggestion, 'b')).toBe(
      '<b>Tyl</b>enol',
    );

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
  }));

  it('should render 1 field if confirmRetry is false', () => {
    component.block.confirmEntry = false;

    fixture.detectChanges();

    const inputCount = fixture.debugElement.queryAll(By.css('input')).length;

    expect(inputCount).toEqual(1);
  });

  it('should render confirm input field if confirmEntry is true', () => {
    component.block.confirmEntry = true;

    fixture.detectChanges();

    const inputCount = fixture.debugElement.queryAll(By.css('input')).length;

    expect(inputCount).toEqual(2);
  });

  it('should emit value if both fields are filled', fakeAsync(() => {
    const valueToEnter = 'test';
    let valueEmitted = false;

    component.block.confirmEntry = true;

    fixture.detectChanges();

    component.valueChanged.subscribe(emittedValue => {
      valueEmitted = true;

      expect(emittedValue).toEqual(valueToEnter);
    });

    component.formGroup.controls[component.block.stableId].patchValue(
      valueToEnter,
    );
    component.formGroup.controls[
      `${component.block.stableId}_confirmation`
    ].patchValue(valueToEnter);

    tick(400);

    expect(valueEmitted).toBeTrue();
  }));

  it('should not emit any value if confirmation field is not filled', fakeAsync(() => {
    const valueToEnter = 'test';
    let valueEmitted = false;

    component.block.confirmEntry = true;

    fixture.detectChanges();

    component.valueChanged.subscribe(emittedValue => {
      valueEmitted = true;
    });

    component.formGroup.controls[component.block.stableId].patchValue(
      valueToEnter,
    );

    tick(10);

    expect(valueEmitted).toBeFalse();
  }));

  it('selecting an option from suggestion list should update forms value', fakeAsync(() => {
    const matchingValue = 'Blah';
    const textSuggestions = buildTestTextSuggestions(matchingValue);

    component.block.textSuggestionSource = (query$: Observable<string>) =>
      query$.pipe(
        map(query => (query === matchingValue ? textSuggestions : [])),
      );

    fixture.detectChanges();

    const inputDebugEl = fixture.debugElement.query(By.css('input'));

    setInputValue(inputDebugEl, matchingValue);

    const formControl = component.formGroup.get(component.block.stableId);

    expect(formControl.value).toEqual(matchingValue);

    fixture.detectChanges();
    tick(400);
    fixture.detectChanges();

    inputDebugEl.nativeElement.dispatchEvent(new Event('focusin'));

    tick(10);

    const suggestions = fixture.debugElement.queryAll(
      By.css('.autoCompleteOption'),
    );

    expect(suggestions.length).toEqual(textSuggestions.length);

    const selectedOptionIdx = 0;

    suggestions[selectedOptionIdx].nativeElement.click();

    tick(400);

    expect(formControl.value).toEqual(textSuggestions[selectedOptionIdx].value);
  }));
});

const buildTestTextSuggestions = (matchingValue: string): TextSuggestion[] => {
  const match = 'The Blahney Stone';

  return [
    {
      value: match,
      matches: [
        { length: matchingValue.length, offset: match.indexOf(matchingValue) },
      ],
    },
    {
      value: 'Tylenol',
      matches: [
        { length: 3, offset: 0 },
        { length: 2, offset: 4 },
      ],
    },
  ];
};

const setInputValue = (inputDebugEl: DebugElement, value: string): void => {
  inputDebugEl.nativeElement.focus();
  inputDebugEl.nativeElement.value = value;
  inputDebugEl.nativeElement.dispatchEvent(new Event('input'));
};

const isElementVisible = (el: any): boolean =>
  el.offsetParent && el.hidden === false && el.offsetHeight !== 0;
