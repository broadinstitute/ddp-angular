import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

const ABOUT_US_PAGE_IMAGES = [
    'oval_green_left.png',
    'oval_carrot_right.png',
    'oval_sand_left.png'
];
const SCIENTIFIC_RESEARCH_PAGE_IMAGES = [
    'oval_purple_left.png',
    'oval_green_right.png',
    'oval_sand_left.png'
];

@Component({
    selector: 'app-page-with-sections',
    templateUrl: './page-with-sections.component.html',
    styleUrls: ['./page-with-sections.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageWithSectionsComponent implements OnInit {
    @Input() source: string;
    @Input() linksMap?: { [key: string]: string };
    sectionImages: string[];

    ngOnInit(): void {
        this.sectionImages = this.isAboutUsPage ? ABOUT_US_PAGE_IMAGES : SCIENTIFIC_RESEARCH_PAGE_IMAGES;
    }

    get isAboutUsPage(): boolean {
        return this.source === 'App.AboutUs';
    }
}
