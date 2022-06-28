import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-video-intro',
    templateUrl: './video-intro.component.html',
    styleUrls: ['./video-intro.component.scss'],
})
export class VideoIntroComponent {
    @Input()
    pageRendered: string;

    homePageText = 'Learn about Project Singular by watching this short video overview.';
    faqText = 'Learn about Project Singular by watching this short video overview';

    isFaq(): boolean {
        return this.pageRendered === 'FAQ';
    }

    isHome(): boolean {
        return this.pageRendered === 'HOME';
    }

    isConsent(): boolean {
        return this.pageRendered === 'CONSENT';
    }
}
