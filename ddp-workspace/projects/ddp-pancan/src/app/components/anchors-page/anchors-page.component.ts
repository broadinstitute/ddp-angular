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
    readonly examplesUrl = [
        'https://www.nature.com/articles/s41467-020-19291-x',
        'https://www.annalsofoncology.org/article/S0923-7534(19)40698-4/fulltext',
        'https://www.nature.com/articles/s41591-019-0749-z.epdf?author_access_token=cBBx7BAXQ6Z3D-FtgKtMatRgN0jAjWel9jnR3ZoTv0OuyqpOiBwU8Z8ASb5NY9IbXk1V1KF_R5v6TTbcRFo-JeMJ0-VLX-DiOKjqfH1Idg9OXZftog_CeSSuTvzZX78hU5-xKsQ6XRMok9B76DOedQ%3D%3D'
    ];

    constructor(private viewportScroller: ViewportScroller) {}

    scrollToAnchor(anchor: string): void {
        this.viewportScroller.scrollToAnchor(anchor);
    }
}
