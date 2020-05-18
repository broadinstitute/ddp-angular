import { Directive, ElementRef, forwardRef, HostListener, Input } from '@angular/core';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import formatErrorMsg = jasmine.formatErrorMsg;

const DISPLAY_SEPARATOR = ' - ';
const DISPLAY_INPUT_MAX_LEN = 18;
const MAX_VALUE_LEN = 12;
@Directive({
    selector: 'input[invitationcode]',
    providers: [
        { provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: InvitationCodeFormatterDirective },
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InvitationCodeFormatterDirective),
            multi: true,
        }
    ]
})

export class InvitationCodeFormatterDirective implements ControlValueAccessor {
    private _value: string | null = '';
    private isBackspace = false;

    setModelValue(newValue: string | null): void {
      this._value = newValue;
    }

  constructor(private elementRef: ElementRef<HTMLInputElement>) {
    this.setModelValue(elementRef.nativeElement.value);
    console.log('created directive on: %o', elementRef);
  }

  @Input('value')
  set value(value: string | null) {
    console.log('set valuew was called with value: %o', value);
    this.setModelValue(value);
    this.formatDisplayValue(value);
  }


    get value(): string | null {
        console.log('get value got called and we returning: %o', this._value);
        return this._value;
    }
    cursorInSeparator(currDisVal: string | null, cursorPos: number | null =  null): boolean {
        if (currDisVal == null) {
            return false;
        }
        if (cursorPos == null) {
            cursorPos = this.elementRef.nativeElement.selectionStart;
        }
        let startPos = 0;
        do {
            const separatorPos = currDisVal.indexOf(DISPLAY_SEPARATOR, startPos);
            if (separatorPos < 0) {
                console.log('No separator after startpos: %d', startPos);
                return false;
            } else if (cursorPos > separatorPos && cursorPos < (separatorPos + DISPLAY_SEPARATOR.length)) {
                console.log('Found cursor at: %d between: %d and %d',
                    cursorPos, separatorPos, separatorPos + DISPLAY_SEPARATOR.length);
                return true;
            }
            startPos += DISPLAY_SEPARATOR.length;
        } while (true);
    }

    private formatDisplayValue(inputValue: string | null): void {
        if (inputValue !== null) {
            // get rid of  non-alphanumeric
            const cleanedDataValue = this.cleanValue(inputValue);
            const formattedValue = cleanedDataValue
                                .replace(/(.{4})/g, `$1${DISPLAY_SEPARATOR}`)
                                .substr(0, DISPLAY_INPUT_MAX_LEN);

           const setDisplayValue = (newVal: string, newSelectionStart: number | null = null): void => {
                const existingSelectionStart = this.elementRef.nativeElement.selectionStart;
                this.elementRef.nativeElement.value = newVal;
               this.elementRef.nativeElement.selectionStart = newSelectionStart == null ?  existingSelectionStart : newSelectionStart;
               this.elementRef.nativeElement.selectionEnd = this.elementRef.nativeElement.selectionStart;
            };

           const trimSeparator = (val: string): string => {
               const trimmed = val.endsWith(DISPLAY_SEPARATOR) ?
                   val.substr(0, val.length - DISPLAY_SEPARATOR.length)
                   : val;
               console.log('original: *%s* trimmed: *%s', val, trimmed);
               return trimmed;
           };
           const separatorCount = (val: string): number => {
               const count =  val.split(DISPLAY_SEPARATOR).length - 1;
               console.log('Found %d separators in: *%s*', count, val);
               return count;
           };

            let addedChars = 0;
            if (this.isBackspace) {
                console.log('this is a backspace!!!');
                while (this.cursorInSeparator(formattedValue)) {
                    console.log('Moving left one!');
                    this.elementRef.nativeElement.selectionStart -= 1;
                    this.elementRef.nativeElement.selectionEnd = this.elementRef.nativeElement.selectionStart;
                }
                setDisplayValue(formattedValue);
            } else if (this.elementRef.nativeElement.selectionStart < inputValue.length) {
                    let movedRight = 0;
                    let cursorPos = this.elementRef.nativeElement.selectionStart;
                    while (this.cursorInSeparator(formattedValue, cursorPos)) {
                        console.log('moving right');
                        ++movedRight;
                        ++cursorPos;
                    }
                    const separatorsAdded =  (separatorCount(trimSeparator(formattedValue)) - separatorCount(trimSeparator(inputValue)));
                    const charsAddedByFormatting = (separatorsAdded * DISPLAY_SEPARATOR.length) - movedRight;
                    console.log('Moving right by: %d', charsAddedByFormatting);
                    console.log('Position before shifting: %d', this.elementRef.nativeElement.selectionStart);
                    const newSelectionStart = this.elementRef.nativeElement.selectionStart + charsAddedByFormatting;
                   // this.elementRef.nativeElement.selectionEnd = this.elementRef.nativeElement.selectionStart;
                console.log('Position after shifting: %d', this.elementRef.nativeElement.selectionStart);

                    console.log('i did this');
                    setDisplayValue(formattedValue, newSelectionStart);
                console.log('Position after setting value: %d', this.elementRef.nativeElement.selectionStart);
            } else {
                // addedChars = (separtorCountAfter - separtorCount) * (DISPLAY_SEPARATOR.length);
                // console.log('added chars to position:' + addedChars);
                // this.elementRef.nativeElement.selectionStart += addedChars;
                // this.elementRef.nativeElement.selectionEnd += addedChars;
                // setDisplayValue(formattedValue);
                const separatorsInInputValue = inputValue.substr(0,
                    this.elementRef.nativeElement.selectionStart + DISPLAY_SEPARATOR.length + 1);
                // const stringWhereLookingForSepartors = inputValue.substr(0, this.elementRef.nativeElement.selectionStart);
                const inputValueSeparatorCount = separatorsInInputValue.split(DISPLAY_SEPARATOR).length - 1;
                console.log('Looked at string *%s* and found: %d occurrences', separatorsInInputValue, inputValueSeparatorCount);
                // replace every four characters with characters plus separator

                const displayValueUptoCursor = formattedValue.substr(0,
                    this.elementRef.nativeElement.selectionStart + DISPLAY_SEPARATOR.length + 1);
                const separtorCountAfter = displayValueUptoCursor.split(DISPLAY_SEPARATOR).length - 1;
                console.log('After: Looked at string *%s* and found: %d occurrences', displayValueUptoCursor, separtorCountAfter);
                addedChars = (separtorCountAfter - inputValueSeparatorCount) * (DISPLAY_SEPARATOR.length);
                console.log('added chars to position:' + addedChars);
                const selectionStartBefore = this.elementRef.nativeElement.selectionStart;
                const selectionEndBefore = this.elementRef.nativeElement.selectionEnd;
                this.elementRef.nativeElement.value = formattedValue;
                this.elementRef.nativeElement.selectionStart = selectionStartBefore + addedChars;
                console.log('new selection start: %d', selectionStartBefore + addedChars);
                this.elementRef.nativeElement.selectionEnd = selectionEndBefore + addedChars;
            }
        } else {
            this.elementRef.nativeElement.value = '';
        }
        this.isBackspace = false;
    }

    private cleanValue(value: string | null): string | null {
        if (value !== null) {
            return value
                .substr(0, DISPLAY_INPUT_MAX_LEN)
                .replace(/[^a-zA-Z0-9]/g, '')
                .substr(0, MAX_VALUE_LEN)
                .toLocaleUpperCase();
        } else {
            return null;
        }
    }

    @HostListener('input', ['$event.target.value'])
    onInput(value): void {
        console.log('onInput called with: *%s*', value);
        this.setModelValue(this.cleanValue(value));
        this._onChange(this._value);
        this.formatDisplayValue(value);
    }

    @HostListener('keydown', ['$event'])
    onKeyPress(event: KeyboardEvent): void {
        // just record that we are handling a backspace event
        // knowledge used in formatDisplayValue
         if (event.key === 'Backspace') {
             this.isBackspace = true;
        } else {
             const pos = this.elementRef.nativeElement.selectionStart;
             const value = this.elementRef.nativeElement.value;
             const showWhereSelection = `*${value.slice(0, pos)}[]${value.slice(pos)}*`;
             console.log('the cursor is in separator?: %s %o', showWhereSelection, this.cursorInSeparator(this.elementRef.nativeElement.value));
         }
    }

    _onChange(value: any): void {
    }

    _onTouched(value: any): void {
    }

    @HostListener('blur')
    _onBlur(): void {
        this._onTouched(this._value);
    }
    // part of implementing ControlValueAccessor used by ngControls on form modules
    writeValue(obj: any): void {
        console.log('write value called with: %s', obj);
        this.setModelValue(this.cleanValue(obj));
        this.formatDisplayValue(obj);
    }

  // part of implementing ControlValueAccessor used by ngControls on form modules
    registerOnChange(fn: any): void {
        console.log('registerOnChange called with: %o', fn);
        this._onChange = fn;
    }

  // part of implementing ControlValueAccessor used by ngControls on form modules
    registerOnTouched(fn: any): void {
        this._onTouched = fn;
        console.log('registerOnTouched called with: %o', fn);
    }

  // part of implementing ControlValueAccessor used by ngControls on form modules
    setDisabledState?(isDisabled: boolean): void {
        console.log('setDisabledState : %o', isDisabled);
        console.log('setDisabledState not implemented');
    }


}
