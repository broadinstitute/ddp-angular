import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  SubmitAnnouncementService,
  SubmissionManager,
  AnalyticsEventCategories,
 ActivityComponent
} from 'ddp-sdk';

@Component({
    selector: 'app-atcp-activity-base',
    template: `
        <div class="Wrapper">
            <div class="PageHeader">
                <div class="PageHeader-background">
                    <div class="PageLayout">
                        <div *ngIf="isLoaded" class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <h1 class="PageHeader-title" #title>
                                {{model ? model.title : ''}}
                            </h1>
                            <div *ngIf="model && model.subtitle"
                                 class="PageHeader-activity-subtitle"
                                 [ngClass]="{'ddp-hide-subtitle': (isScrolled && !showSubtitle)}"
                                 #subtitle
                                 [innerHTML]="model.subtitle">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- article content -->
            <ddp-loader *ngIf="!isLoaded"></ddp-loader>
            <article *ngIf="isLoaded" [ngClass]="{'PageContent': isLoaded}">
                <div class="PageLayout">
                    <div class="row NoMargin">
                        <div *ngIf="shouldShowReadonlyHint"
                             class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div class="PageContent-infobox NoMargin" [innerHTML]="model.readonlyHint">
                            </div>
                        </div>
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <!-- introduction section -->
                            <!-- Check model not null and not undefined. Open to race condition -->
                            <ng-container *ngIf="model && model.introduction">
                                <ddp-activity-section
                                        [section]="model.introduction"
                                        [readonly]="model.readonly || dataEntryDisabled"
                                        [validationRequested]="validationRequested"
                                        [studyGuid]="studyGuid"
                                        [activityGuid]="activityGuid"
                                        (visibilityChanged)="updateVisibility($event)"
                                        (embeddedComponentsValidationStatus)="updateEmbeddedComponentValidationStatus(0, $event)"
                                        (embeddedComponentBusy)="embeddedComponentBusy$[0].next($event)">
                                </ddp-activity-section>
                            </ng-container>
                        </div>
                    </div>
                    <!-- steps -->
                    <div class="row NoMargin" *ngIf="isStepped && showStepper">
                        <div class="container-fluid col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div class="row">
                                <ng-container *ngFor="let section of model.sections; let i = index">
                                    <ng-container *ngIf="section.visible">
                                        <div class="WizardSteps col-lg-4 col-md-4 col-sm-4 col-xs-12"
                                            (click)="jumpStep(i)"
                                            [class.active]="isActive(i)"
                                            [class.completed]="isCompleted(i)">
                                            <div class="WizardSteps-img">
                                                <img [src]="setIcon(i, section.incompleteIcon, section.completeIcon)">
                                            </div>
                                            <div class="WizardSteps-background">
                                                <div class="WizardSteps-title">{{section.name}}</div>
                                            </div>
                                        </div>
                                    </ng-container>
                                </ng-container>
                            </div>
                        </div>
                    </div>
                    <ng-container *ngIf="model">
                        <div class="row NoMargin">
                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <ddp-activity-section
                                        [section]="currentSection"
                                        [readonly]="model.readonly || dataEntryDisabled"
                                        [validationRequested]="validationRequested"
                                        [studyGuid]="studyGuid"
                                        [activityGuid]="activityGuid"
                                        (visibilityChanged)="updateVisibility($event)"
                                        (embeddedComponentsValidationStatus)="updateEmbeddedComponentValidationStatus(1, $event)"
                                        (embeddedComponentBusy)="embeddedComponentBusy$[1].next($event)">
                                </ddp-activity-section>
                            </div>
                        </div>
                        <div class="row NoMargin">
                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <!-- closing section -->
                                <ng-container *ngIf="model.closing">
                                    <ddp-activity-section
                                            [section]="model.closing"
                                            [readonly]="model.readonly || dataEntryDisabled"
                                            [validationRequested]="validationRequested"
                                            [studyGuid]="studyGuid"
                                            [activityGuid]="activityGuid"
                                            (visibilityChanged)="updateVisibility($event)"
                                            (embeddedComponentsValidationStatus)="updateEmbeddedComponentValidationStatus(2, $event)"
                                            (embeddedComponentBusy)="embeddedComponentBusy$[2].next($event)">
                                    </ddp-activity-section>
                                </ng-container>
                                <ng-container *ngIf="shouldShowReadonlyHint">
                                    <div class="PageContent-infobox topMarginMedium" [innerHTML]="model.readonlyHint">
                                    </div>
                                </ng-container>
                                <hr *ngIf="isLoaded" class="HorizontalLine">
                                <div *ngIf="model.lastUpdatedText" class="LastUpdatedText">
                                    <span>{{model.lastUpdatedText}} </span>
                                </div>
                                <div *ngIf="model.activityCode ==='PREQUAL'">
                                    <button *ngIf="!model.readonly && isLoaded" #submitButton
                                            [disabled]="(isPageBusy | async) || dataEntryDisabled"
                                            class="BtnFilled BtnFilled--blue Btn-centered Btn-wide"
                                            (click)="flush()"
                                            (mouseenter)="mouseEnterOnSubmit()"
                                            [innerHTML]="(isPageBusy | async)
                                                                    ? ('SDK.SavingButton' | translate) : ('SDK.JoinUsButton' | translate)">
                                    </button>
                                </div>
                                <div *ngIf="(!isStepped || isLastStep) && model.activityCode !=='PREQUAL'">
                                    <button *ngIf="!model.readonly && isLoaded" mat-raised-button color="primary" #submitButton
                                            [disabled]="(isPageBusy | async) || dataEntryDisabled"
                                            class="margin-5 ButtonFilled Button--rect"
                                            (click)="flush()"
                                            (mouseenter)="mouseEnterOnSubmit()"
                                            [innerHTML]="(isPageBusy | async)
                                                                ? ('SDK.SavingButton' | translate) : ('SDK.SubmitButton' | translate)">
                                    </button>
                                    <button *ngIf="model.readonly && isLoaded" mat-raised-button color="primary"
                                            class="margin-5 ButtonFilled Button--rect"
                                            (click)="close()"
                                            [innerHTML]="'SDK.CloseButton' | translate">
                                    </button>
                                </div>
                                <div *ngIf="isLoaded && isStepped" class="ConsentButtons">
                                    <button *ngIf="!isFirstStep" mat-raised-button color="primary"
                                            [disabled]="(isPageBusy | async) || dataEntryDisabled"
                                            class="margin-5 ButtonFilled ButtonFilled--neutral"
                                            (click)="decrementStep()"
                                            [innerHTML]="'SDK.PreviousButton' | translate">
                                    </button>
                                    <div class="NextButton">
                                        <button *ngIf="!isLastStep" mat-raised-button color="primary"
                                                [disabled]="(isPageBusy | async) || dataEntryDisabled"
                                                class="margin-5 ButtonFilled"
                                                (click)="incrementStep()"
                                                [innerHTML]="(isPageBusy | async)
                                                ? ('SDK.SavingButton' | translate) : ('SDK.NextButton' | translate)">
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <div *ngIf="displayGlobalError$ | async" class="ErrorMessage">
                                    <span translate>SDK.ValidateError</span>
                                </div>
                                <div *ngIf="communicationErrorOccurred" class="ErrorMessage">
                                    <span translate>SDK.CommunicationError</span>
                                </div>
                            </div>
                        </div>
                    </ng-container>
                </div>
            </article>
        </div>`,
    styles: [`
        .margin-5 {
            margin: 5px;
        }`
    ],
    providers: [SubmitAnnouncementService, SubmissionManager]
})
export class AtcpActivityBaseComponent extends ActivityComponent implements OnInit, OnDestroy, AfterViewInit {

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    this.currentActivityService.saveCurrentActivity(null);
  }

  public navigateToConsole(): void {
    this.sendLastSectionAnalytics();
    this.sendActivityAnalytics(AnalyticsEventCategories.CloseSurvey);
    super.navigateToConsole();
  }

    public flush(): void {
        this.sendLastSectionAnalytics();
        this.sendActivityAnalytics(AnalyticsEventCategories.SubmitSurvey);
        super.flush();
    }
}
