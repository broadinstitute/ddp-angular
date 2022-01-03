import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[appInputRestriction]'
})
export class InputRestrictionDirective {
    @Input() appInputRestriction: string;
    private inputElement: ElementRef;

    constructor(el: ElementRef) {
        this.inputElement = el;
    }

    @HostListener('keypress', ['$event'])
    onKeyPress(e: KeyboardEvent): void {
        if (this.appInputRestriction === 'integer') {
            this.integerOnly(e);
        } else if (this.appInputRestriction === 'noSpecialChars') {
            this.noSpecialChars(e);
        }
    }

    @HostListener('paste', ['$event'])
    onPaste(e: ClipboardEvent): void {
        let regex;
        if (this.appInputRestriction === 'integer') {
            regex = /[0-9]/g;
        } else if (this.appInputRestriction === 'noSpecialChars') {
            regex = /[a-zA-Z0-9\u0600-\u06FF]/g;
        }

        const pasteData = e.clipboardData.getData('text/plain');
        let m;
        let matches = 0;

        // eslint-disable-next-line no-cond-assign
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

    private isKeyEventForEditing(event: KeyboardEvent): boolean {
        const ctrlOn = this.isControlOn(event);
        const editingKeys = [
            'Backspace', 'Tab', 'Enter', 'Escape',
            'End', 'Home',
            'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
            'Left', 'Right', 'Up', 'Down', // IE/Edge specific values for arrows
            'Delete', 'Insert'
        ];
        const symbols = ['#', '$', '%', '&', '(', '.'];
        const key = event.key;
        const keyUpperCase = key.toUpperCase();

        return (
            (editingKeys.includes(key) && !symbols.includes(key)) ||
            // Allow: ctrl-a for selection
            (keyUpperCase === 'A' && ctrlOn) ||
            // Allow: ctrl-c for copy
            (keyUpperCase === 'C' && ctrlOn) ||
            // Allow: ctrl-v for paste
            (keyUpperCase === 'V' && ctrlOn) ||
            // Allow: ctrl-x for cut
            (keyUpperCase === 'X' && ctrlOn)
        );
    }

    // Check both ctrl and meta keys to account for mac-os
    private isControlOn(event: KeyboardEvent): boolean {
        return (event.ctrlKey === true || event.metaKey === true);
    }

    private integerOnly(e: KeyboardEvent): void {
        if (this.isTab(e.key) || this.isKeyEventForEditing(e)) {
            // let it happen, don't do anything
            return;
        }
        if (!this.isDigit(e.key)) {
            e.preventDefault();
        }
    }

    private noSpecialChars(e: KeyboardEvent): void {
        if (this.isTab(e.key) || this.isNotSpecialChar(e.key) || this.isArabicLetter(e.key)) {
            return;
        }
        e.preventDefault();
    }

    private isDigit(key: string): boolean {
        return key && /\d/.test(key);
    }

    private isDigitOrLetter(key: string): boolean {
        return key && (key.length === 1) && /\w/.test(key) && (key !== '_');
    }

    private isTab(key: string): boolean {
        return key && key.toUpperCase() === 'TAB';
    }

    private isFunctionalKey(key: string): boolean {
        return key && ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11'].includes(key);
    }

    private isNotSpecialChar(key: string): boolean {
        return this.isDigitOrLetter(key) ||
            this.isFunctionalKey(key) ||
            ['*', '+', '-', '.', '/', ' ', 'Backspace'].includes (key);
    }

    private isArabicLetter(key: string): boolean {
        const arabicRegex = '[\u0600-\u06FF]';
        const regEx = new RegExp(arabicRegex);
        return regEx.test(key);
    }
}
