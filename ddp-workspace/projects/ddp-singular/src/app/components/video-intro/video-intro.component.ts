import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-video-intro',
    templateUrl: './video-intro.component.html',
    styleUrls: ['./video-intro.component.scss'],
})
export class VideoIntroComponent {
    @Input()
    pageRendered: string;

    isFaq() {
        return this.pageRendered === "FAQ";
    }

    isHome() {
        return this.pageRendered === "HOME";
    }

    isConsent() {
        return this.pageRendered === "CONSENT"
    }
}
