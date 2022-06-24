import { Component, Inject, OnInit } from '@angular/core';
import { AnalyticsEventCategories, AnalyticsEventsService } from 'ddp-sdk';
import { CommunicationService, ToolkitConfigurationService } from 'toolkit';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
    public phone: string;
    public email: string;
    public phoneHref: string;
    public emailHref: string;
    public twitterUrl: string;
    public facebookUrl: string;
    public instagramUrl: string;
    public countMeInUrl: string;

    public title = 'Common.Buttons.MailingList.Title';

    public footerNavElements: {
        text: string;
        routerLink: string;
        isMailingListButton?: boolean;
        arialLabel?: string;
    }[] = [
        { text: 'Common.Navigation.Home', routerLink: '/' },
        {
            text: 'Common.Navigation.AboutUs',
            routerLink: 'about-us',
        },
        {
            text: 'Common.Navigation.FAQ',
            routerLink: 'more-details',
        },
        {
            text: 'Common.Navigation.Participation',
            routerLink: 'participation',
        },
        {
            text: 'Common.Navigation.ScientificImpact',
            routerLink: 'scientific-impact',
        },
        {
            text: 'Common.Buttons.MailingList.Title',
            routerLink: '',
            arialLabel: 'Common.Buttons.MailingList.AriaLabel',
            isMailingListButton: true,
        },
        {
            text: 'Common.Navigation.Physicians',
            routerLink: 'physicians',
        },
    ];

    constructor(
        private communicationService: CommunicationService,
        private analytics: AnalyticsEventsService,
        @Inject('toolkit.toolkitConfig')
        private toolkitConfiguration: ToolkitConfigurationService
    ) {}

    public ngOnInit(): void {
        this.phone = this.toolkitConfiguration.phone;
        this.email = this.toolkitConfiguration.infoEmail;
        this.phoneHref = `tel:${this.phone}`;
        this.emailHref = `mailto:${this.email}`;
        this.twitterUrl = `https://twitter.com/${this.toolkitConfiguration.twitterAccountId}`;
        this.facebookUrl = `https://www.facebook.com/${this.toolkitConfiguration.facebookGroupId}`;
        this.instagramUrl = `https://www.instagram.com/${this.toolkitConfiguration.instagramId}`;
        this.countMeInUrl = this.toolkitConfiguration.countMeInUrl;
    }

    public openJoinMailingList(shouldProceed: boolean): void {
        if (!shouldProceed) {return;}
        this.communicationService.openJoinDialog();
    }

    public sendSocialMediaAnalytics(event: string): void {
        this.analytics.emitCustomEvent(AnalyticsEventCategories.Social, event);
    }
}
