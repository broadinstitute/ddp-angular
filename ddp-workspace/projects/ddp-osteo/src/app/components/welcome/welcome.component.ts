import { Component, ViewChild, ElementRef, OnInit, Inject } from '@angular/core';
import { WindowRef, AnalyticsEventsService, AnalyticsEventCategories, AnalyticsEventActions } from 'ddp-sdk';
import { HeaderConfigurationService, CommunicationService, ToolkitConfigurationService } from 'toolkit';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  public twitterUrl: string;
  public facebookUrl: string;
  public instagramUrl: string;
  public lightswitchWidgetId: string;
  @ViewChild('scrollAnchor', { static: true }) scrollAnchor: ElementRef;
  private readonly HEADER_HEIGHT_REM = 7;

  constructor(
    private headerConfig: HeaderConfigurationService,
    private window: WindowRef,
    private communicationService: CommunicationService,
    private analytics: AnalyticsEventsService,
    @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    this.headerConfig.setupDefaultHeader();
    this.twitterUrl = `https://twitter.com/${this.toolkitConfiguration.twitterAccountId}`;
    this.facebookUrl = `https://www.facebook.com/${this.toolkitConfiguration.facebookGroupId}`;
    this.instagramUrl = `https://www.instagram.com/countmein/`;
    this.lightswitchWidgetId = this.toolkitConfiguration.lightswitchInstagramWidgetId;
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

  public sendSocialMediaAnalytics(event: string): void {
    this.analytics.emitCustomEvent(AnalyticsEventCategories.Social, event);
  }

  public sendCountMeInAnalytics(): void {
    this.analytics.emitCustomEvent(AnalyticsEventCategories.ClickedCountMeIn, AnalyticsEventActions.FromMainPage);
  }

  private get getRealHeaderHeight(): number {
    return this.HEADER_HEIGHT_REM * parseFloat(getComputedStyle(document.documentElement).fontSize);
  }
}
