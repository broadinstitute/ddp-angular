import {
  AfterViewInit,
  Component,
  Inject,
  Injector,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChange
} from '@angular/core';
import {
  SubmitAnnouncementService,
  SubmissionManager,
  AnalyticsEventCategories,
  ActivityComponent,
  CurrentActivityService,
  WindowRef,
  AnalyticsEventsService,
} from 'ddp-sdk';
import { DOCUMENT } from '@angular/common';
import { ActivityForm } from '../../../../../ddp-sdk/src/lib/models/activity/activityForm';
import {
  delay,
  map,
  merge,
  startWith,
} from 'rxjs/operators';
import { combineLatest } from 'rxjs';

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
export class AtcpActivityBaseComponent extends ActivityComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

  public currentActivityService: CurrentActivityService;

  constructor(
    windowRef: WindowRef,
    renderer: Renderer2,
    submitService: SubmitAnnouncementService,
    analytics: AnalyticsEventsService,
    @Inject(DOCUMENT) document: any,
    // using Injector here as we get error using constructor injection
    // in both child and parent classes
    injector: Injector) {
    super(windowRef, renderer, submitService, analytics, document, injector);
    this.currentActivityService = injector.get(CurrentActivityService);
  }

  public ngOnChanges(changes: { [propKey: string]: SimpleChange }): void {
    /* TODO: consider usage of this method in baseActivity.component.ts instead of current implementation.
       This fixes issue with additional ngChange events
    */
    for (const propName in changes) {
      if (propName === 'studyGuid' || propName === 'activityGuid') {
        this.isLoaded = false;
        this.resetValidationState();
      }
      // observable.next() call may lead to firing additional ngChange events, so it should be executed in the end.
      if (propName === 'studyGuid') {
        this.studyGuidObservable.next(this.studyGuid);
      } else if (propName === 'activityGuid') {
        this.activityGuidObservable.next(this.activityGuid);
      }
    }
  }
  protected getActivity(): void {
    const get = this.currentActivityService
      .getActivity(this.studyGuidObservable, this.activityGuidObservable)
      .subscribe(
        x => {
          if (!x) {
            this.model = new ActivityForm();
          } else {
            this.model = x;
            this.stickySubtitle.emit(this.model.subtitle);
            this.activityCode.emit(this.model.activityCode);
            this.initSteps();
            this.isLoaded = true;
          }

          // combine the latest status updates from the form model
          // and from the embedded components into one observable
          const canSaveSub = combineLatest(
            // update as we get responses from server
            this.submissionManager.answerSubmissionResponse$.pipe(
              // We don't automatically get model updates if
              // local validation fails
              // so trigger one when submit
              merge(this.submitAttempted),
              map(() => this.model.validate()),
              // let's start with whatever it is the initial state of the form
              startWith(this.model.validate())),
            this.embeddedComponentsValidStatusChanged.asObservable().pipe(startWith(true)))
            .pipe(
              map(status => status[0] && status[1]),
              delay(1)
            ).subscribe(this.isAllFormContentValid);

          this.anchor.addNew(canSaveSub);
        },
        () => {
          this.navigateToErrorPage();
        }
      );
    this.anchor.addNew(get);
  }


  public ngOnDestroy(): void {
    super.ngOnDestroy();
    this.currentActivityService.saveCurrentActivity(null);
  }

  public navigateToConsole(): void {
    this.sendLastSectionAnalytics();
    this.sendActivityAnalytics(AnalyticsEventCategories.CloseSurvey);
    this.router.navigateByUrl('/console');
  }

    public flush(): void {
        this.sendLastSectionAnalytics();
        this.sendActivityAnalytics(AnalyticsEventCategories.SubmitSurvey);
        super.flush();
    }
}
