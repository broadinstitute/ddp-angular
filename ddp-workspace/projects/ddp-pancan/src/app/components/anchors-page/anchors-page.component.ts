import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { WindowRef } from 'ddp-sdk';
import { AppRoutes } from '../app-routes';

@Component({
    selector: 'app-anchors-page',
    templateUrl: './anchors-page.component.html',
    styleUrls: ['./anchors-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnchorsPageComponent {
    @Input() source: string;
    @Input() routerLink: string;
    anchorLabel = 'section';
    readonly AppRoutes = AppRoutes;

    constructor(
        private window: WindowRef,
        @Inject(DOCUMENT) private document: Document
    ) {}

    scrollToAnchor(anchor: string): void {
        const element = this.document.getElementById(anchor);
        if (element) {
            const y = element.getBoundingClientRect().top;
            this.window.nativeWindow.scrollTo({top: y, behavior: 'smooth'});
        }
    }
}
