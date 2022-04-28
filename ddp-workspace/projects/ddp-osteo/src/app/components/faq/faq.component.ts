import { Component, ElementRef, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ToolkitConfigurationService, HeaderConfigurationService } from 'toolkit';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  public infoEmail: string;
  public phone: string;
  public infoEmailHref: string;
  public phoneHref: string;

  @ViewChildren(MatExpansionPanel)
  private expansionPanels: QueryList<MatExpansionPanel>;

  @ViewChildren(MatExpansionPanel, { read: ElementRef })
  private expansionElements: QueryList<ElementRef<HTMLDivElement>>;

  constructor(
    private headerConfig: HeaderConfigurationService,
    @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    this.infoEmail = this.toolkitConfiguration.infoEmail;
    this.infoEmailHref = `mailto:${this.toolkitConfiguration.infoEmail}`;
    this.phone = this.toolkitConfiguration.phone;
    this.phoneHref = `tel:${this.toolkitConfiguration.phone}`;
    this.headerConfig.setupDefaultHeader();
  }

  public isText(paragraph: unknown): boolean {
    return typeof paragraph === 'string';
  }

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
}
