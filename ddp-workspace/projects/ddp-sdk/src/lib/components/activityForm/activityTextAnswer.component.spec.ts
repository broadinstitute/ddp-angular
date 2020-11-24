import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivityTextAnswer } from './activityTextAnswer.component';
import { ActivityTextQuestionBlock } from '../../models/activity/activityTextQuestionBlock';
import { QuestionPromptComponent } from './questionPrompt.component';
import { InputType } from '../../models/activity/inputType';
import { TextSuggestion } from '../../models/activity/textSuggestion';
import { ActivityEmailInput } from './activityEmailInput.component';
import { TooltipComponent } from '../tooltip.component';
import { TranslateTestingModule } from '../../testsupport/translateTestingModule';

describe('ActivityTextAnswer', () => {
    let component: ActivityTextAnswer;
    let fixture: ComponentFixture<ActivityTextAnswer>;
    const configServiceSpy = jasmine.createSpyObj('ddp.config', ['tooltipIconUrl']);
    configServiceSpy.tooltipIconUrl.and.callFake(() => {
        return '/path/';
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ActivityTextAnswer,
                ActivityEmailInput,
                QuestionPromptComponent,
                TooltipComponent
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
                MatTooltipModule
            ],
            providers: [
                { provide: 'ddp.config', useValue: configServiceSpy }
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ActivityTextAnswer);
        expect(fixture instanceof ComponentFixture).toBe(true);
        expect(fixture.componentInstance instanceof ActivityTextAnswer).toBe(true);
        component = fixture.componentInstance;
        const block = new ActivityTextQuestionBlock();
        block.inputType = InputType.Text;
        block.question = 'Who are you?';
        block.tooltip = 'Helper text';
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
        const questionComponent = fixture.debugElement.query(By.directive(QuestionPromptComponent));
        expect(questionComponent).not.toBeNull();
        const inputElement: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
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

    it('expect suggestion source to be called when input entered', fakeAsync(() => {
        const enteredValue = 'Blah';
        let dataSourceProviderExecuted = false;

        component.block.textSuggestionSource = (queryObservable: Observable<string>) => {
            return queryObservable.pipe(map((queryVal) => {
                expect(queryVal).toBe(enteredValue);
                dataSourceProviderExecuted = true;
                return [];
            }));
        };
        component.block = component.block;

        fixture.detectChanges();
        const inputElement: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        inputElement.focus();
        inputElement.value = enteredValue;

        inputElement.dispatchEvent(new Event('input'));

        fixture.detectChanges();

        // need to wait. we are debouncing in component
        tick(400);
        expect(dataSourceProviderExecuted).toBe(true);
    }));

    it('Check autosuggest options opened at right time', fakeAsync(() => {
        const matchingVal = 'Blah';

        const textSuggestions = buildTestTextSuggestions(matchingVal);

        component.block.textSuggestionSource = (queryObservable: Observable<string>) => {
            return queryObservable.pipe(map((queryVal) => {
                if (queryVal === matchingVal) {
                    return textSuggestions;
                } else {
                    return [];
                }
            }));
        };
        component.block = component.block;

        fixture.detectChanges();
        const inputDebugElement: DebugElement = fixture.debugElement.query(By.css('input'));

        inputValue(inputDebugElement, 'Nothing that will match');
        fixture.detectChanges();

        // need to wait. we are debouncing in component
        tick(400);

        fixture.detectChanges();
        // check that panel is not visible when nothing returned from match provider
        const autocompletePanel: DebugElement = fixture.debugElement.query(By.css('.autoCompletePanel'));
        let autocompleteOptions: DebugElement = fixture.debugElement.query(By.css('.autoCompleteOption'));
        expect(autocompletePanel).toBeTruthy();
        expect(isElementVisible(autocompletePanel.nativeElement)).toBe(false);
        // No options!
        expect(autocompleteOptions).toBeFalsy();

        // Setting input to the value that will match some options
        inputValue(inputDebugElement, matchingVal);
        fixture.detectChanges();
        tick(400);

        fixture.detectChanges();
        // panel should be visible now
        expect(isElementVisible(autocompletePanel.nativeElement)).toBe(true);
        autocompleteOptions = fixture.debugElement.query(By.css('.autoCompleteOption'));
        expect(autocompleteOptions).toBeTruthy();

        // should have some options (panel children) that correspond to number of suggestions
        expect(autocompletePanel.nativeElement.children.length).toBe(textSuggestions.length);

        // update again and panel should go away
        inputValue(inputDebugElement, 'another bogus entry');
        fixture.detectChanges();
        tick(400);
        fixture.detectChanges();
        expect(isElementVisible(autocompletePanel.nativeElement)).toBe(false);
        expect(autocompletePanel.nativeElement.children.length).toEqual(0);
        tick(10000);
    }));

    it('select matching option from list', fakeAsync(() => {
        const matchingVal = 'Blah';

        const textSuggestions = buildTestTextSuggestions(matchingVal);

        component.block.textSuggestionSource = (queryObservable: Observable<string>) => {
            return queryObservable.pipe(map((queryVal) => {
                if (queryVal === matchingVal) {
                    return textSuggestions;
                } else {
                    return [];
                }
            }));
        };
        component.block = component.block;

        fixture.detectChanges();
        const inputDebugElement: DebugElement = fixture.debugElement.query(By.css('input'));

        inputValue(inputDebugElement, matchingVal);
        fixture.detectChanges();
        tick(400);

        fixture.detectChanges();
        const autocompletePanel: DebugElement = fixture.debugElement.query(By.css('.autoCompletePanel'));
        expect(isElementVisible(autocompletePanel.nativeElement));

        const selectedOptionIndex = 1;
        let valueChanged = false;
        component.valueChanged.subscribe(newVal => {
            expect(newVal).toEqual(textSuggestions[selectedOptionIndex].value);
            valueChanged = true;
        });
        // const secondSuggestOptionElement = autocompletePanel.children[selectedOptionIndex];
        inputDebugElement.nativeElement.dispatchEvent(new Event('focusin'));
        fixture.detectChanges();
        tick();
        const secondSuggestOptionElement = fixture.debugElement.queryAll(By.css('.autoCompleteOption'))[selectedOptionIndex];
        secondSuggestOptionElement.nativeElement.click();
        // expect(component.options.length).toBe(textSuggestions.length);
        // component.options.last.click();
        // secondSuggestOptionElement.dispatchEvent(new Event('click'));
        fixture.detectChanges();
        tick(1);
        expect(valueChanged).toBe(true);
    }));

    it('Compute tagged text suggestion', fakeAsync(() => {

        let suggestion: TextSuggestion = {
            value: 'Tylenol', matches: [{ offset: 0, length: 3 }]
        };
        expect(component.generateOptionInnerHtml(suggestion, 'b')).toBe('<b>Tyl</b>enol');

        suggestion = { value: 'Tylenol', matches: [] };
        expect(component.generateOptionInnerHtml(suggestion, 'b')).toBe('Tylenol');

        suggestion = { value: 'Tylenol', matches: [{ offset: 0, length: 3 }, { offset: 4, length: 2 }] };
        expect(component.generateOptionInnerHtml(suggestion, 'b')).toBe('<b>Tyl</b>e<b>no</b>l');

        suggestion = { value: 'Tylenol', matches: [{ offset: 0, length: 3 }, { offset: 4, length: 3 }] };
        expect(component.generateOptionInnerHtml(suggestion, 'b')).toBe('<b>Tyl</b>e<b>nol</b>');

        suggestion = { value: 'Tylenol', matches: [{ offset: 0, length: 3 }, { offset: 4, length: 3 }] };
        expect(component.generateOptionInnerHtml(suggestion, 'span', 'nice'))
            .toBe('<span class="nice">Tyl</span>e<span class="nice">nol</span>');

    }));

    //  Link to test that panel is open
    // https://github.com/angular/material2/blob/106d274ef99533779ff8674597e844308a95131f/src/lib/autocomplete/autocomplete.spec.ts#L99-L123
});

function isElementVisible(nativeElement: any): boolean {
    return nativeElement.offsetParent && nativeElement.hidden === false && nativeElement.offsetHeight !== 0;
}

function inputValue(inputDebugElement: DebugElement, newValue: string): void {
    inputDebugElement.nativeElement.focus();
    inputDebugElement.nativeElement.value = newValue;
    inputDebugElement.nativeElement.dispatchEvent(new Event('input'));
}

function buildTestTextSuggestions(matchingVal: string): TextSuggestion[] {
    const textMatch1 = 'The Blahney Stone';
    const textSuggestions = [{
        value: textMatch1,
        matches: [{ length: matchingVal.length, offset: textMatch1.indexOf(matchingVal) }]
    } as TextSuggestion, { value: 'Tylenol', matches: [{ offset: 0, length: 3 }, { offset: 4, length: 2 }] }];
    return textSuggestions;
}
