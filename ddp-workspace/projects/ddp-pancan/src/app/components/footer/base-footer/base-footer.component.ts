import { Component } from '@angular/core';
import { WindowRef } from 'ddp-sdk';

@Component({
    template: ''
})
export abstract class BaseFooterComponent {
    protected constructor(private windowRef: WindowRef) {}

    goToTop(): void {
        this.windowRef.nativeWindow.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}
