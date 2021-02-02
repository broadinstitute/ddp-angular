import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { WindowRef } from '../../../../../ddp-sdk/src/lib/services/windowRef';
import { AnalyticsEventsService } from '../../../../../ddp-sdk/src/lib/services/analyticsEvents.service';
import { AnalyticsEventCategories } from '../../../../../ddp-sdk/src/lib/models/analyticsEventCategories';
import { AnalyticsEventActions } from '../../../../../ddp-sdk/src/lib/models/analyticsEventActions';
import { HeaderConfigurationService } from '../../../../../toolkit/src/lib/services/headerConfiguration.service';
import { CommunicationService } from '../../../../../toolkit/src/lib/services/communication.service';
import { ToolkitConfigurationService } from '../../../../../toolkit/src/lib/services/toolkitConfiguration.service';

@Component({
  selector: 'welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  public twitterUrl: string;
  public facebookUrl: string;
  public instagramUrl: string;
  public lightswitchWidgetId: string;
  private readonly HEADER_HEIGHT_REM = 7;
  @ViewChild('scrollAnchor', { static: true }) scrollAnchor: ElementRef;

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
    this.instagramUrl = `https://www.instagram.com/${this.toolkitConfiguration.instagramId}`;
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
