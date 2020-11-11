import { Component, Inject, OnInit } from '@angular/core';
import { ToolkitConfigurationService } from 'toolkit';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  public isGeneralCollapsed = true;
  public isBeforeCollapsed = true;
  public isProcessCollapsed = true;
  public isCollectionCollapsed = true;
  public isReturnCollapsed = true;
  public isDataCollapsed = true;
  public isSpreadCollapsed = true;

  public phone: string;
  public email: string;
  public phoneHref: string;
  public emailHref: string;

  constructor(@Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    this.phone = this.toolkitConfiguration.phone;
    this.email = this.toolkitConfiguration.infoEmail;
    this.phoneHref = `tel:${this.toolkitConfiguration.phone}`;
    this.emailHref = `mailto:${this.toolkitConfiguration.infoEmail}`;
  }
}
