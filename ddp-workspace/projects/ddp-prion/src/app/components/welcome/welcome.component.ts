import { Component, OnInit } from '@angular/core';
import {
  AnalyticsEventActions,
  AnalyticsEventsService,
  Auth0AdapterService,
  BrowserContentService,
  WindowRef
} from 'ddp-sdk';

@Component({
    selector: 'app-welcome',
    template: `<prion-header noBackground="true"></prion-header>
    <div class="Container NoPadding">
      <a id="topView"></a>
        <div class="Landing-image">
          <div class="Landing-content col-lg-6 col-md-6 col-sm-8 col-xs-12">
            <h1 class="Title" translate>App.Welcome.WelcomeTitle</h1>
            <p translate>App.Welcome.WelcomeText</p>
            <div class="row">
              <a (click)="clickJoinUs()" class="Button Button--primaryDarkYellow col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-8 col-sm-offset-2" translate>App.Common.JoinUs</a>
            </div>
          </div>
          <div *ngIf="true" class="Intro-arrow">
            <a (click)="scrollTo(secondView)"><img src="./assets/images/white-arrow.svg" [attr.alt]="'App.Welcome.ArrowAlt' | translate"></a>
          </div>
        </div>

        <div class="FullWidth">
            <div class="row NoMargin">
                <a #secondView></a>
                <div class="col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-12">
                    <div class="Message-content">
                        <h1 class="Title Aligned--center" translate>App.Welcome.Intro</h1>
                        <div class="row Margin20">
                            <a (click)="clickJoinUs()" class="Button Button--primaryYellow col-lg-4 col-lg-offset-4 col-md-4 col-md-offset-4 col-sm-8 col-sm-offset-1 col-xs-8 col-sm-offset-2" translate>App.Common.JoinUs</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="CenterDiv">
            <a *ngIf="true" (click)="scrollToWithAdjust(thirdView, 100)" class="Arrow"><img src="/assets/images/yellow-arrow.svg" [attr.alt]="'App.Welcome.ArrowAlt' | translate"></a>
        </div>

        <div class="FullWidth">
            <div class="row NoMargin">
              <a #thirdView></a>
                <div class="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-12">
                    <div class="Message-content">
                        <h1 class="Title col-lg-9 col-lg-offset-3 col-md-9 col-md-offset-3 col-sm-9 col-sm-offset-3 col-xs-12" translate>App.Welcome.Participate</h1>
                        <div class="row Margin20">
                            <img alt="Step 1" src="/assets/images/step-1.svg" class="col-lg-3 col-md-3 col-sm-3 col-xs-3 HomeSteps" />
                            <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9">
                                <h2 class="Title Color--green" translate>App.Welcome.Steps.FirstStep.Title</h2>
                                <p translate>App.Welcome.Steps.FirstStep.Text</p>
                            </div>
                        </div>
                        <div class="row Margin20">
                            <img alt="Step 2" src="/assets/images/step-2.svg" class="col-lg-3 col-md-3 col-sm-3 col-xs-3 HomeSteps" />
                            <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9">
                                <h2 class="Title Color--green" translate>App.Welcome.Steps.SecondStep.Title</h2>
                                <p translate>App.Welcome.Steps.SecondStep.Text</p>
                            </div>
                        </div>
                        <div class="row Margin20">
                            <img alt="Step 3" src="/assets/images/step-3.svg" class="col-lg-3 col-md-3 col-sm-3 col-xs-3 HomeSteps" />
                            <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9">
                                <h2 class="Title Color--green" translate>App.Welcome.Steps.ThirdStep.Title</h2>
                                <p translate>App.Welcome.Steps.ThirdStep.Text</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="CenterDiv">
          <a *ngIf="true" (click)="scrollTo(fourthView)" class="Arrow"><img src="/assets/images/yellow-arrow.svg" [attr.alt]="'App.Welcome.ArrowAlt' | translate"></a>
        </div>

        <div class="FullWidth">
            <div class="row NoMargin">
              <a #fourthView></a>
                <div class="col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-12">
                    <div class="Message-content">
                        <h1 class="Title Aligned--center" translate>App.Welcome.Closing</h1>
                        <div class="row Margin20">
                            <a (click)="clickJoinUs()" class="Button Button--primaryYellow col-lg-4 col-lg-offset-4 col-md-4 col-md-offset-4 col-sm-8 col-sm-offset-1 col-xs-8 col-sm-offset-2" translate>App.Common.JoinUs</a>
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

    constructor(
        private windowRef: WindowRef,
        private analytics: AnalyticsEventsService,
        private browserContent: BrowserContentService, private auth0Adapter: Auth0AdapterService) { }

    public ngOnInit(): void {
        this.unsupportedBrowser = this.browserContent.unsupportedBrowser();
    }

    public clickJoinUs(): void {
      sessionStorage.setItem('nextUrl', 'start-study');
      this.auth0Adapter.signup();
        this.doAnalytics();
        if (this.unsupportedBrowser) {
            this.browserContent.emitWarningEvent();
        }
    }

    public scrollTo(target: any): void {
        this.isIE ? this.simpleScrolling(target) : this.smoothScrolling(target);
    }

    public scrollToWithAdjust(target: any, offsetAdjust: number): void {
      this.isIE ? this.simpleScrollingWithAdjust(target, offsetAdjust) : this.smoothScrollingWithAdjust(target, offsetAdjust);
    }

    private simpleScrolling(target: any): void {
        this.windowRef.nativeWindow.scrollTo(0, target.offsetTop);
    }

    private simpleScrollingWithAdjust(target: any, offsetAdjust: number): void {
      this.windowRef.nativeWindow.scrollTo(0, target.offsetTop + offsetAdjust);
    }

    private smoothScrolling(target: any): void {
        this.windowRef.nativeWindow.scrollTo({
            top: target.offsetTop,
            behavior: 'smooth'
        });
    }

    private smoothScrollingWithAdjust(target: any, offsetAdjust: number): void {
      this.windowRef.nativeWindow.scrollTo({
        top: target.offsetTop + offsetAdjust,
        behavior: 'smooth'
      });
    }

    private get isIE(): boolean {
        return this.browserContent.unsupportedBrowser();
    }

    private doAnalytics(): void {
        this.analytics.emitCustomEvent('clickedJoinUs', AnalyticsEventActions.FromMainPage);
    }
}
