import { Directive, ElementRef, forwardRef, HostListener, Input } from '@angular/core';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InvitationCodeInputFormatter } from '../utility/invitationCode/invitationCodeInputFormatter';
import { LoggingService } from '../services/logging.service';

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
    private formatter: InvitationCodeInputFormatter;
    private readonly LOG_SOURCE = 'InvitationCodeFormatterDirective';

    constructor(
        private logger: LoggingService,
        private elementRef: ElementRef<HTMLInputElement>) {
        this.setModelValue(elementRef.nativeElement.value);
        this.formatter = new InvitationCodeInputFormatter(this.logger);
        this.logger.logDebug(`${this.LOG_SOURCE}. Created directive on %o`, elementRef);
    }

    setModelValue(newValue: string | null): void {
        this._value = newValue;
    }

    @Input('value')
    set value(value: string | null) {
        value = value == null ? '' : value;
        this.logger.logDebug(`${this.LOG_SOURCE} %s`, `Set value was called with value ${value}`);
        const cleanedInputState = this.formatter.cleanupInput(value, this.elementRef.nativeElement.selectionStart);
        this.setModelValue(cleanedInputState.value);
        const formattedState = this.formatter.addSeparator(cleanedInputState.value, cleanedInputState.selectionStart, this.isBackspace);
        this.elementRef.nativeElement.value = formattedState.value;
        this.elementRef.nativeElement.selectionStart = formattedState.selectionStart;
        this.elementRef.nativeElement.selectionEnd = formattedState.selectionStart;
    }


    get value(): string | null {
        this.logger.logDebug(`${this.LOG_SOURCE} %s`, `Get value got called and we returning ${this._value}`);
        return this._value;
    }

    @HostListener('input', ['$event.target.value'])
    onInput(value): void {
        this.logger.logDebug(`${this.LOG_SOURCE} %s`, `onInput called with ${value}`);
        this.value = value;
        this._onChange(this._value);
    }

    @HostListener('keydown', ['$event'])
    onKeyPress(event: KeyboardEvent): void {
        // just record that we are handling a backspace event
        // knowledge used elsewhere
        this.isBackspace = event.key === 'Backspace';
    }

    _onChange(value: any): void { }

    _onTouched(value: any): void { }

    @HostListener('blur')
    _onBlur(): void {
        this._onTouched(this._value);
    }

    // part of implementing ControlValueAccessor used by ngControls on form modules
    writeValue(obj: any): void {
        this.logger.logDebug(`${this.LOG_SOURCE}. Write value called with %s`, obj);
        this.value = obj;
    }

    // part of implementing ControlValueAccessor used by ngControls on form modules
    registerOnChange(fn: any): void {
        this.logger.logDebug(`${this.LOG_SOURCE}. registerOnChange called with %o`, fn);
        this._onChange = fn;
    }

    // part of implementing ControlValueAccessor used by ngControls on form modules
    registerOnTouched(fn: any): void {
        this._onTouched = fn;
        this.logger.logDebug(`${this.LOG_SOURCE}. registerOnTouched called with %o`, fn);
    }

    // part of implementing ControlValueAccessor used by ngControls on form modules
    setDisabledState?(isDisabled: boolean): void {
        this.logger.logDebug(`${this.LOG_SOURCE}. setDisabledState %o`, isDisabled);
        this.logger.logDebug(`${this.LOG_SOURCE} %s`, 'setDisabledState not implemented');
    }
}
