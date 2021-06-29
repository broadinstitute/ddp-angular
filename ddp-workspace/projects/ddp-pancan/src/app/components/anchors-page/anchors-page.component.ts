import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'app-anchors-page',
    templateUrl: './anchors-page.component.html',
    styleUrls: ['./anchors-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnchorsPageComponent {
    @Input() source: string;
    @Input() route: string;
    anchorLabel = 'section';
}
