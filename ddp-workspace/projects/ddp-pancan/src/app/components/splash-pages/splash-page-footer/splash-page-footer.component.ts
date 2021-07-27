import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { WindowRef } from 'ddp-sdk';

@Component({
    selector: 'app-splash-page-footer',
    templateUrl: './splash-page-footer.component.html',
    styleUrls: ['./splash-page-footer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SplashPageFooterComponent {
    @Input() phone: string;
    @Input() email: string;

    constructor(private windowRef: WindowRef) {}

    public goToTop(): void {
        this.windowRef.nativeWindow.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}
