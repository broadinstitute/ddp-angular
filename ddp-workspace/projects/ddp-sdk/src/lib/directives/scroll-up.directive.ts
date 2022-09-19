import { Directive, ElementRef, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ConfigurationService } from '../services/configuration.service';
import { WindowRef } from '../services/windowRef';

@Directive({
    selector: '[scroll-up]'
})
export class ScrollUpDirective implements OnChanges {
    @Input() triggerScrollUp: boolean;
    @Output() scrollUpExecuted: EventEmitter<boolean> = new EventEmitter<boolean>();
    constructor(
        private eleRef: ElementRef,
        @Inject('ddp.config') private configuration: ConfigurationService,
        private windowRef: WindowRef) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.triggerScrollUp.currentValue) {
            const headerOffset = this.configuration.scrollToErrorOffset;
            const top = this.eleRef.nativeElement.getBoundingClientRect().top
                + this.windowRef.nativeWindow.scrollY - headerOffset;
            this.windowRef.nativeWindow.scrollTo({
                top,
                behavior: 'smooth'
            });
            this.scrollUpExecuted.emit(true);
        }
    }

}