import {Component, ElementRef, Input, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {MatAccordion, MatExpansionPanel} from '@angular/material/expansion';

@Component({
  selector: 'app-faq-section',
  templateUrl: './faq-section.component.html',
  styleUrls: ['./faq-section.component.scss']
})
export class FaqSectionComponent {


    isAllOpened = false;

    @Input() faqSection;
    @ViewChild(MatAccordion) accordion: MatAccordion;
    @ViewChildren(MatExpansionPanel)
    private expansionPanels: QueryList<MatExpansionPanel>;

    @ViewChildren(MatExpansionPanel, {read: ElementRef})
    private expansionElements: QueryList<ElementRef<HTMLDivElement>>;

  constructor() { }

    public isLinkItem(type: string): boolean {
        return type === 'link';
    }

    public expandAndScrollTo(id: string): void {
        const scrollToElementIndex =
            this.expansionElements.toArray().findIndex(({nativeElement}) => nativeElement.id === id);

        const element = this.expansionElements.get(scrollToElementIndex);
        const expansionPanel = this.expansionPanels.get(scrollToElementIndex);

        element.nativeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        expansionPanel.open();
    }


    public isText(paragraph: unknown): boolean {
        return typeof paragraph === 'string';
    }

    public toggleAll(): void {
        this.isAllOpened ? this.accordion.closeAll() : this.accordion.openAll();

        this.isAllOpened = !this.isAllOpened;
    }
}
