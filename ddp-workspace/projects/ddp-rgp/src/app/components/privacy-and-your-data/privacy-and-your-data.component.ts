import { Component, OnInit, Inject } from '@angular/core';
import { ToolkitConfigurationService } from 'toolkit';

@Component({
  selector: 'app-privacy-and-your-data',
  templateUrl: './privacy-and-your-data.component.html',
  styleUrls: ['./privacy-and-your-data.component.scss']
})
export class PrivacyAndYourDataComponent implements OnInit {
  public isShareVariantCollapsed: boolean = true;
  public isShareGenoCollapsed: boolean = true;
  public isStoredCollapsed: boolean = true;
  public isPersonalInfoCollapsed: boolean = true;
  public isProfitOffCollapsed: boolean = true;

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