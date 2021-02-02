import { Directive, ElementRef, HostListener, Input } from '@angular/core';

// Key names mapped to their respective codes based on keypress event.
// Note: keep lowercase, especially for alphabets since 'a' is different from 'A'.
enum Keys {
    backspace = 8,
    tab = 9,
    enter = 13,
    escape = 27,
    end = 35,       // Check for '#', it also has this keycode.
    home = 36,      // Check for '$'
    left = 37,      // Check for '%'
    up = 38,        // Check for '&'
    right = 39,
    down = 40,      // Check for '('
    delete = 46,    // Check for '.'
    a = 97,
    c = 99,
    v = 118,
    x = 120,
}

@Directive({
    selector: '[appInputRestriction]'
})
export class InputRestrictionDirective {
    @Input('appInputRestriction') appInputRestriction: string;
    private inputElement: ElementRef;
    private arabicRegex = '[\u0600-\u06FF]';

    constructor(el: ElementRef) {
        this.inputElement = el;
    }

    @HostListener('keypress', ['$event'])
    onKeyPress(event): void {
        if (this.appInputRestriction === 'integer') {
            this.integerOnly(event);
        } else if (this.appInputRestriction === 'noSpecialChars') {
            this.noSpecialChars(event);
        }
    }

    // See: https://unixpapa.com/js/key.html
    private normalizedCode(event: KeyboardEvent): number {
        let code: number;
        if (event.which === null) {
            code = event.keyCode;   // Old IE
        } else if (event.which !== 0 && event.charCode !== 0) {
            code = event.which;     // All others
        } else {
            code = event.keyCode;   // Special key, fallback to keyCode
        }
        return code;
    }

    // Check both ctrl and meta keys to account for mac-os
    private isControlOn(event: KeyboardEvent): boolean {
        return (event.ctrlKey === true || event.metaKey === true);
    }

    private isKeyEventForEditing(event: KeyboardEvent): boolean {
        const code = this.normalizedCode(event);
        const ctrlOn = this.isControlOn(event);
        const editingKeys = [
            Keys.backspace, Keys.tab, Keys.enter, Keys.escape,
            Keys.end, Keys.home,
            Keys.left, Keys.right, Keys.up, Keys.down,
            Keys.delete
        ];
        const symbols = ['#', '$', '%', '&', '(', '.'];
        return ((editingKeys.indexOf(code) !== -1 && symbols.indexOf(event.key) === -1) ||
            // Allow: ctrl-a for selection
            (code === Keys.a && ctrlOn) ||
            // Allow: ctrl-c for copy
            (code === Keys.c && ctrlOn) ||
            // Allow: ctrl-v for paste
            (code === Keys.v && ctrlOn) ||
            // Allow: ctrl-x for cut
            (code === Keys.x && ctrlOn));
    }

    private integerOnly(event): void {
        const e = event as KeyboardEvent;
        if (e.key === 'Tab' || e.key === 'TAB') {
            return;
        }
        if (this.isKeyEventForEditing(e)) {
            // let it happen, don't do anything
            return;
        }
        if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].indexOf(e.key) === -1) {
            e.preventDefault();
        }
    }

    // todo: check the codes in this method.
    private noSpecialChars(event): void {
        const e = event as KeyboardEvent;
        if (e.key === 'Tab' || e.key === 'TAB') {
            return;
        }
        let k;
        k = event.keyCode;  // k = event.charCode;  (Both can be used)
        if ((k > 64 && k < 91) || (k > 96 && k < 123) || k === 8 || k === 32 || (k >= 48 && k <= 57)) {
            return;
        }
        const ch = String.fromCharCode(e.keyCode);
        const regEx = new RegExp(this.arabicRegex);
        if (regEx.test(ch)) {
            return;
        }
        e.preventDefault();
    }

    @HostListener('paste', ['$event'])
    onPaste(event): void {
        let regex;
        if (this.appInputRestriction === 'integer') {
            regex = /[0-9]/g;
        } else if (this.appInputRestriction === 'noSpecialChars') {
            regex = /[a-zA-Z0-9\u0600-\u06FF]/g;
        }
        const e = event as ClipboardEvent;
        const pasteData = e.clipboardData.getData('text/plain');
        let m;
        let matches = 0;
        while ((m = regex.exec(pasteData)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {
                matches++;
            });
        }
        if (matches === pasteData.length) {
            return;
        } else {
            e.preventDefault();
        }
    }
}
