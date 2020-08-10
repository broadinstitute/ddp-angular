import { Component, OnInit, Inject } from '@angular/core';
import { AppRoutes } from '../../app-routes';
import { ToolkitConfigurationService, CommunicationService } from 'toolkit';
import { WindowRef } from 'ddp-sdk';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public cmiUrl: string;
  public infoEmail: string;
  public twitterAccount: string;
  public facebookAccount: string;
  public phone: string;
  public appRoutes = AppRoutes;

  constructor(
    private window: WindowRef,
    private communicationService: CommunicationService,
    @Inject('toolkit.toolkitConfig') private config: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    this.cmiUrl = this.config.countMeInUrl;
    this.infoEmail = this.config.infoEmail;
    this.twitterAccount = this.config.twitterAccountId;
    this.facebookAccount = this.config.facebookGroupId;
    this.phone = this.config.phone;
  }

  public scrollToTop(): void {
    this.window.nativeWindow.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  public openJoinMailingList(): void {
    this.communicationService.openJoinDialog();
  }
}
