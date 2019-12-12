import { Component, ViewChild, ElementRef, OnInit, Inject } from '@angular/core';
import { WindowRef } from 'ddp-sdk';
import { HeaderConfigurationService, CommunicationService, ToolkitConfigurationService } from 'toolkit';

@Component({
  selector: 'welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  public twitterUrl: string;
  public facebookUrl: string;
  public instagramUrl: string;
  private readonly HEADER_HEIGHT_REM = 7;
  @ViewChild('scrollAnchor', { static: true }) scrollAnchor: ElementRef;

  constructor(
    private headerConfig: HeaderConfigurationService,
    private window: WindowRef,
    private communicationService: CommunicationService,
    @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    this.headerConfig.setupDefaultHeader();
    this.twitterUrl = `https://twitter.com/${this.toolkitConfiguration.twitterAccountId}`;
    this.facebookUrl = `https://www.facebook.com/${this.toolkitConfiguration.facebookGroupId}`;
    this.instagramUrl = `https://www.instagram.com/${this.toolkitConfiguration.instagramId}`;
  }

  public scrollToStepsSection(): void {
    const top = this.scrollAnchor.nativeElement.getBoundingClientRect().top + window.scrollY - this.getRealHeaderHeight;
    this.window.nativeWindow.scrollTo({
      top,
      behavior: 'smooth'
    });
  }

  public joinMailingList(): void {
    this.communicationService.openJoinDialog();
  }

  private get getRealHeaderHeight(): number {
    return this.HEADER_HEIGHT_REM * parseFloat(getComputedStyle(document.documentElement).fontSize);
  }
}
