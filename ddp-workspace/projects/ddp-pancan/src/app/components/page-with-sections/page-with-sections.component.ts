import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'app-page-with-sections',
    templateUrl: './page-with-sections.component.html',
    styleUrls: ['./page-with-sections.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageWithSectionsComponent {
    @Input() source: string;
    @Input() linksMap?: { [key: string]: string };

    get isAboutUsPage(): boolean {
        return this.source === 'App.AboutUs';
    }
}
