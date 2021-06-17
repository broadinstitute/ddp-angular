import { Component, Input, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';

@Component({
    selector: 'app-faq-section',
    templateUrl: './faq-section.component.html',
    styleUrls: ['./faq-section.component.scss']
})
export class FaqSectionComponent {
    @Input() questions: string;
    @Input() questionsCount: number; /* don't pass the counter for displaying all questions */
    @ViewChild(MatAccordion) accordion: MatAccordion;
}
