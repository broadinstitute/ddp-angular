import { Component, OnInit, Inject } from '@angular/core';
import { ToolkitConfigurationService } from 'toolkit';

@Component({
  selector: 'app-privacy-and-your-data',
  templateUrl: './privacy-and-your-data.component.html',
  styleUrls: ['./privacy-and-your-data.component.scss']
})
export class PrivacyAndYourDataComponent implements OnInit {
  public isShareVariantCollapsed = true;
  public isShareGenoCollapsed = true;
  public isStoredCollapsed = true;
  public isPersonalInfoCollapsed = true;
  public isProfitOffCollapsed = true;

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
