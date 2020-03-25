import { Component, Inject, OnInit } from '@angular/core';
import { ToolkitConfigurationService } from 'toolkit';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  public isGeneralCollapsed: boolean = true;
  public isBeforeCollapsed: boolean = true;
  public isProcessCollapsed: boolean = true;
  public isCollectionCollapsed: boolean = true;
  public isReturnCollapsed: boolean = true;
  public isDataCollapsed: boolean = true;
  public isSpreadCollapsed: boolean = true;

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
