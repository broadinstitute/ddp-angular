import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';


const ABOUT_US_PAGE_IMAGES = ['oval_green_left.png', 'oval_carrot_right.png', 'oval_sand_left.png'];

@Component({
    selector: 'app-page-with-ovals',
    templateUrl: './page-with-ovals.component.html',
    styleUrls: ['./page-with-ovals.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageWithOvalsComponent implements OnInit {
    @Input() source: string;
    @Input() linksMap?: { [key: string]: string };
    sectionImages: string[];

    ngOnInit(): void {
        this.sectionImages = this.isAboutUsPage ? ABOUT_US_PAGE_IMAGES : [];
    }

    private get isAboutUsPage(): boolean {
        return this.source === 'App.AboutUs';
    }
}
