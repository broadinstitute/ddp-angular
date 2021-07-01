import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ViewportScroller } from '@angular/common';

@Component({
    selector: 'app-anchors-page',
    templateUrl: './anchors-page.component.html',
    styleUrls: ['./anchors-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnchorsPageComponent {
    @Input() source: string;
    @Input() route: string;
    @Input() linksMap?: { [key: string]: string };
    anchorLabel = 'section';

    constructor(private viewportScroller: ViewportScroller) {}

    scrollToAnchor(anchor: string): void {
        this.viewportScroller.scrollToAnchor(anchor);
    }
}
