import { Component, Inject, OnInit } from '@angular/core';
import { AppRoutes } from '../../app-routes';
import { ToolkitConfigurationService, CommunicationService, HeaderConfigurationService } from 'toolkit';
import {
    AnalyticsEventsService,
    AnalyticsEventCategories,
    AnalyticsEventActions,
    WindowRef,
    BrowserContentService
} from 'ddp-sdk';

@Component({
    selector: 'app-end-enroll',
    templateUrl: './end-enroll.component.html',
    styleUrls: ['./end-enroll.component.scss']
})
export class EndEnrollComponent implements OnInit {
    public appRoutes = AppRoutes;
    public cmiUrl: string;
    public infoEmail: string;
    public twitterAccount: string;
    public facebookAccount: string;
    public instagramAccount: string;

    constructor(
        private analytics: AnalyticsEventsService,
        private communicationService: CommunicationService,
        private headerConfig: HeaderConfigurationService,
        private windowRef: WindowRef,
        private browserContent: BrowserContentService,
        @Inject('toolkit.toolkitConfig') private config: ToolkitConfigurationService) { }

    public ngOnInit(): void {
        this.headerConfig.setupDefaultHeader();
        this.cmiUrl = this.config.countMeInUrl;
        this.infoEmail = this.config.infoEmail;
        this.twitterAccount = this.config.twitterAccountId;
        this.facebookAccount = this.config.facebookGroupId;
        this.instagramAccount = this.config.instagramId;
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

    private get isIE(): boolean {
        return this.browserContent.unsupportedBrowser();
    }

    public scrollTo(target: HTMLElement): void {
        if (this.isIE) {
            this.simpleScrolling(target);
        } else {
            this.smoothScrolling(target);
        }
    }

    private simpleScrolling(target: HTMLElement): void {
        this.windowRef.nativeWindow.scrollTo(0, target.offsetTop);
    }

    private smoothScrolling(target: HTMLElement): void {
        this.windowRef.nativeWindow.scrollTo({
            top: target.offsetTop,
            behavior: 'smooth'
        });
    }

}
