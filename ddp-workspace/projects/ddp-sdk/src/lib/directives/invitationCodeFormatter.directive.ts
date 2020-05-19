import { Directive, ElementRef, forwardRef, HostListener, Input } from '@angular/core';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InvitationCodeInputFormatter } from './invitationCodeInputFormatter';

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
    private formatter = new InvitationCodeInputFormatter();

    setModelValue(newValue: string | null): void {
      this._value = newValue;
    }

  constructor(private elementRef: ElementRef<HTMLInputElement>) {
    this.setModelValue(elementRef.nativeElement.value);
    console.log('created directive on: %o', elementRef);
  }

  @Input('value')
  set value(value: string | null) {
    value = value == null ? '' : value;
    console.log('set value was called with value: %o', value);
    const cleanedInputState = this.formatter.cleanupInput(value, this.elementRef.nativeElement.selectionStart);
    this.setModelValue(cleanedInputState.value);
    const formattedState = this.formatter.addSeparator(cleanedInputState.value, cleanedInputState.selectionStart, this.isBackspace);
    this.elementRef.nativeElement.value = formattedState.value;
    this.elementRef.nativeElement.selectionStart = formattedState.selectionStart;
    this.elementRef.nativeElement.selectionEnd = formattedState.selectionStart;
  }


    get value(): string | null {
        console.log('get value got called and we returning: %o', this._value);
        return this._value;
    }

    @HostListener('input', ['$event.target.value'])
    onInput(value): void {
        console.log('onInput called with: *%s*', value);
        this.value = value;
        this._onChange(this._value);
    }

    @HostListener('keydown', ['$event'])
    onKeyPress(event: KeyboardEvent): void {
        // just record that we are handling a backspace event
        // knowledge used elsewhere
        this.isBackspace = event.key === 'Backspace';
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
        this.value = obj;
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
