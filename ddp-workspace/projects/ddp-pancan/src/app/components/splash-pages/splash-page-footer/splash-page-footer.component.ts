import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { WindowRef } from 'ddp-sdk';
import { BaseFooterComponent } from '../../footer/base-footer/base-footer.component';

@Component({
    selector: 'app-splash-page-footer',
    templateUrl: './splash-page-footer.component.html',
    styleUrls: ['./splash-page-footer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SplashPageFooterComponent extends BaseFooterComponent {
    @Input() phone: string;
    @Input() email: string;

    constructor(private _windowRef: WindowRef) {
        super(_windowRef);
    }
}
