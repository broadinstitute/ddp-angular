import { Component, ViewChild } from '@angular/core';
import { FaqSectionComponent } from '../faq-section/faq-section.component';

@Component({
    selector: 'app-faq',
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.scss']
})
export class FaqComponent {
    @ViewChild(FaqSectionComponent) questionsSection: FaqSectionComponent;
    isAllOpened: boolean;

    toggle(): void {
        if (this.isAllOpened) {
            this.questionsSection.accordion.closeAll();
        } else {
            this.questionsSection.accordion.openAll();
        }

        this.isAllOpened = !this.isAllOpened;
    }
}
