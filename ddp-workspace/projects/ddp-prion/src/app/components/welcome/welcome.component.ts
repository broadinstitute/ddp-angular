import { Component, OnInit } from '@angular/core';
import { AnalyticsEventCategories, AnalyticsEventActions, AnalyticsEventsService, Auth0AdapterService, BrowserContentService, GoogleAnalyticsEventService, WindowRef } from 'ddp-sdk';

@Component({
    selector: 'welcome',
    template: `
    <toolkit-header noBackground="true"></toolkit-header>
    <div class="Container NoPadding">
        <a id="topView"></a>
        <div class="Landing-image">
            <div class="Landing-content col-lg-6 col-md-6 col-sm-8 col-xs-12">
                <h1 class="Title" translate>Toolkit.Welcome.WelcomeTitle</h1>
                <p translate>Toolkit.Welcome.WelcomeText</p>
                <div class="row">
                    <a (click)="clickJoinUs()" class="Button Button--primaryDarkYellow col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-8 col-sm-offset-2">Join Us</a>
                </div>
            </div>
            <div *ngIf="showArrow" class="Intro-arrow">
                <a (click)="scrollTo(secondView)"><img src="./assets/images/white-arrow.svg" alt="Arrow"></a>
            </div>
        </div>
        
        <div class="FullWidth">
            <div class="row NoMargin">
                <div class="col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-12">
                    <div class="Message-content">
                        <h1 class="Title Aligned--center" translate>Toolkit.Welcome.Intro</h1>
                        <div class="row Margin20">
                            <a (click)="clickJoinUs()" class="Button Button--primaryYellow col-lg-4 col-lg-offset-4 col-md-4 col-md-offset-4 col-sm-8 col-sm-offset-1 col-xs-8 col-sm-offset-2" translate>Toolkit.Common.JoinUs</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="CenterDiv">
            <img src="/assets/images/yellow-arrow.svg" alt="Arrow">
        </div>
    
        <div class="FullWidth">
            <div class="row NoMargin">
                <div class="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-12">
                    <div class="Message-content">
                        <h1 class="Title col-lg-9 col-lg-offset-3 col-md-9 col-md-offset-3 col-sm-9 col-sm-offset-3 col-xs-12" translate>Toolkit.Welcome.Participate</h1>
                        <div class="row Margin20">
                            <img src="/assets/images/step-1.svg" class="col-lg-3 col-md-3 col-sm-3 col-xs-3 HomeSteps" />
                            <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9">
                                <h2 class="Title Color--green" translate>Toolkit.Welcome.Steps.FirstStep.Title</h2>
                                <p translate>Toolkit.Welcome.Steps.FirstStep.Text</p>
                            </div>
                        </div>
                        <div class="row Margin20">
                            <img src="/assets/images/step-2.svg" class="col-lg-3 col-md-3 col-sm-3 col-xs-3 HomeSteps" />
                            <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9">
                                <h2 class="Title Color--green" translate>Toolkit.Welcome.Steps.SecondStep.Title</h2>
                                <p translate>Toolkit.Welcome.Steps.SecondStep.Text</p>
                            </div>
                        </div>
                        <div class="row Margin20">
                            <img src="/assets/images/step-3.svg" class="col-lg-3 col-md-3 col-sm-3 col-xs-3 HomeSteps" />
                            <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9">
                                <h2 class="Title Color--green" translate>Toolkit.Welcome.Steps.ThirdStep.Title</h2>
                                <p translate>Toolkit.Welcome.Steps.ThirdStep.Text</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="CenterDiv">
            <img src="/assets/images/yellow-arrow.svg" alt="Arrow">
        </div>
    
        <div class="FullWidth">
            <div class="row NoMargin">
                <div class="col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-12">
                    <div class="Message-content">
                        <h1 class="Title Aligned--center" translate>Toolkit.Welcome.Closing</h1>
                        <div class="row Margin20">
                            <a (click)="clickJoinUs()" class="Button Button--primaryYellow col-lg-4 col-lg-offset-4 col-md-4 col-md-offset-4 col-sm-8 col-sm-offset-1 col-xs-8 col-sm-offset-2" translate>Toolkit.Common.JoinUs</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div> 
    `
})
export class WelcomeComponent implements OnInit {
    public unsupportedBrowser: boolean;
    private readonly HEADER_HEIGHT: number = 70;

    constructor(
        private windowRef: WindowRef,
        private analytics: AnalyticsEventsService,
        private browserContent: BrowserContentService) { }

    public ngOnInit(): void {
        this.unsupportedBrowser = this.browserContent.unsupportedBrowser();
    }

    public clickJoinUs(): void {
      sessionStorage.setItem('nextUrl', 'account-verification');
      this.auth0Adapter.signup();
        this.doAnalytics();
        if (this.unsupportedBrowser) {
            this.browserContent.emitWarningEvent();
        }
    }

    public get showArrow(): boolean {
        return this.windowRef.nativeWindow.pageYOffset <= this.HEADER_HEIGHT;
    }

    public scrollTo(target: any): void {
        this.isIE ? this.simpleScrolling(target) : this.smoothScrolling(target);
    }

    private simpleScrolling(target: any): void {
        this.windowRef.nativeWindow.scrollTo(0, target.offsetTop);
    }

    private smoothScrolling(target: any): void {
        this.windowRef.nativeWindow.scrollTo({
            top: target.offsetTop,
            behavior: 'smooth'
        });
    }

    private get isIE(): boolean {
        return this.browserContent.unsupportedBrowser();
    }

    private doAnalytics(): void {
        this.analytics.emitCustomEvent(AnalyticsEventCategories.ClickedCountMeIn, AnalyticsEventActions.FromMainPage);
    }
}
