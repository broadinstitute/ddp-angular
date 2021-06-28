import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { DOCUMENT, Location } from '@angular/common';

@Component({
    selector: 'app-anchors-page',
    templateUrl: './anchors-page.component.html',
    styleUrls: ['./anchors-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnchorsPageComponent {
    @Input() source: string;
    @Input() routerLink: string;

    constructor(
        private location: Location,
        @Inject(DOCUMENT) private document: Document
    ) {}

    scrollToAnchor(anchor: string): void {
        const element = this.document.getElementById(anchor);
        if (element) {
            const y = element.getBoundingClientRect().top;
            window.scrollTo({top: y, behavior: 'smooth'});
            window.scrollTo(0, -10);
        }
    }
}
