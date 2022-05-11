import { Component, Input, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';

type Question = { Question: string; Paragraphs: string[] };

@Component({
  selector: 'app-faq-section',
  templateUrl: './faq-section.component.html',
  styleUrls: ['./faq-section.component.scss'],
})
export class FaqSectionComponent {
  @Input() title: string;
  @Input() questions: Question[];
  @ViewChild(MatAccordion) accordion: MatAccordion;
  isAllOpened = false;

  public toggleAll(): void {
    this.isAllOpened ? this.accordion.closeAll() : this.accordion.openAll();

    this.isAllOpened = !this.isAllOpened;
  }
}
