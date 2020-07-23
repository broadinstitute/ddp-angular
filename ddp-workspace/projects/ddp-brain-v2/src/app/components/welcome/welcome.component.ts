import { Component, Inject, OnInit } from '@angular/core';
import { AppRoutes } from '../../app-routes';
import { ToolkitConfigurationService, CommunicationService } from 'toolkit';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  public appRoutes = AppRoutes;
  public cmiUrl: string;
  public infoEmail: string;
  public twitterAccount: string;
  public facebookAccount: string;

  constructor(
    private communicationService: CommunicationService,
    @Inject('toolkit.toolkitConfig') private config: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    this.cmiUrl = this.config.countMeInUrl;
    this.infoEmail = this.config.infoEmail;
    this.twitterAccount = this.config.twitterAccountId;
    this.facebookAccount = this.config.facebookGroupId;
  }

  public joinMailingList(): void {
    this.communicationService.openJoinDialog();
  }
}
