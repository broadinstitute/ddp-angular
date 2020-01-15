import { Component, OnInit, Inject } from '@angular/core';
import { CommunicationService, ToolkitConfigurationService } from 'toolkit';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public phone: string;
  public email: string;
  public phoneHref: string;
  public emailHref: string;
  public twitterUrl: string;
  public facebookUrl: string;
  public instagramUrl: string;

  constructor(
    private communicationService: CommunicationService,
    @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    this.phone = this.toolkitConfiguration.phone;
    this.email = this.toolkitConfiguration.infoEmail;
    this.phoneHref = `tel:${this.phone}`;
    this.emailHref = `mailto:${this.email}`;
    this.twitterUrl = `https://twitter.com/${this.toolkitConfiguration.twitterAccountId}`;
    this.facebookUrl = `https://www.facebook.com/${this.toolkitConfiguration.facebookGroupId}`;
    this.instagramUrl = `https://www.instagram.com/${this.toolkitConfiguration.instagramId}`;
  }

  public openJoinMailingList(): void {
    this.communicationService.openJoinDialog();
  }
}
