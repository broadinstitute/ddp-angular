import { Directive, Renderer2, ElementRef, forwardRef, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR, DefaultValueAccessor } from '@angular/forms';
import * as _ from 'underscore';

const UPPERCASE_INPUT_CONTROL_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UpperCaseInputDirective),
    multi: true,
};

@Directive({
    selector: 'input[uppercase]',
    providers: [
        UPPERCASE_INPUT_CONTROL_VALUE_ACCESSOR,
    ]
})
export class UpperCaseInputDirective extends DefaultValueAccessor {

    constructor(
        private renderer: Renderer2,
        private elementRef: ElementRef) {
        super(renderer, elementRef, false);
    }

    public writeValue(value: any): void {
        const transformed = UpperCaseInputDirective.transformValue(value);
        super.writeValue(transformed);
    }

    public onInputHandler(value: any): void {
        if (_.isString(value)) {
            const start = this.elementRef.nativeElement.selectionStart;
            const end = this.elementRef.nativeElement.selectionEnd;
            const transformed = UpperCaseInputDirective.transformValue(value);
            super.writeValue(transformed);
            this.onChange(transformed);
            // this check overcomes IE behavior where focus jumps on its own
            // between fields when clearing out contents.
            if (value.length > 0) {
                this.elementRef.nativeElement.setSelectionRange(start, end);
            }
        }
    }

    @HostListener('input', ['$event.target.value'])
    onInput(value): void {
        this.onInputHandler(value);
    }

    @HostListener('blur')
    onBlur(): void {
        this.onTouched();
    }

    private static transformValue(value: any): any {
        return value && typeof value === 'string'
            ? value.toUpperCase()
            : value;
    }
}
