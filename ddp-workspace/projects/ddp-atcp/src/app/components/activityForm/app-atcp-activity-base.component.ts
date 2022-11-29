import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChange
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  SubmitAnnouncementService,
  SubmissionManager,
  AnalyticsEventCategories,
  ActivityComponent,
  WindowRef,
  AnalyticsEventsService,
  ActivityForm,
  LoggingService,
  LanguageService,
  ParticipantsSearchServiceAgent,
  SessionMementoService,
} from 'ddp-sdk';
import { DOCUMENT } from '@angular/common';
import { CurrentActivityService } from '../../sdk/services/currentActivity.service';
import * as RouterResources from '../../router-resources';
import { MultiGovernedUserService } from '../../services/multi-governed-user.service';

import {
  delay,
  filter,
  map,
  startWith,
  take,
  tap,
} from 'rxjs/operators';
import { combineLatest, merge } from 'rxjs';

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
                    (embeddedComponentsValidationStatus)="updateEmbeddedComponentValidationStatus(0, $event)"
                    (componentBusy)="embeddedComponentBusy$[0].next($event)">
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
                          <img [src]="setIcon(i, section.incompleteIcon, section.completeIcon)" alt="Wizard Steps Image">
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
                    (embeddedComponentsValidationStatus)="updateEmbeddedComponentValidationStatus(1, $event)"
                    (componentBusy)="embeddedComponentBusy$[1].next($event)">
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
                      (embeddedComponentsValidationStatus)="updateEmbeddedComponentValidationStatus(2, $event)"
                      (componentBusy)="embeddedComponentBusy$[2].next($event)">
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
  @Input() isPrequal = false;

  public isMultiGoverned: boolean;
  public currentActivityService: CurrentActivityService;

  private multiGovernedUserService: MultiGovernedUserService;
  private languageService: LanguageService;
  protected translateService: TranslateService;

  constructor(
    logger: LoggingService,
    windowRef: WindowRef,
    renderer: Renderer2,
    submitService: SubmitAnnouncementService,
    analytics: AnalyticsEventsService,
    participantsSearchService: ParticipantsSearchServiceAgent,
    changeRef: ChangeDetectorRef,
    @Inject(DOCUMENT) document: any,
    // using Injector here as we get error using constructor injection
    // in both child and parent classes
    injector: Injector,
    private session: SessionMementoService) {
    super(logger, windowRef, renderer, submitService, analytics, participantsSearchService, changeRef, document, injector);
    this.currentActivityService = injector.get(CurrentActivityService);
    this.multiGovernedUserService = injector.get(MultiGovernedUserService);
    this.languageService = injector.get(LanguageService);
    this.translateService = injector.get(TranslateService);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.multiGovernedUserService.isMultiGoverned$.pipe(
      filter(isMultiGoverned => isMultiGoverned !== null),
      take(1),
    ).subscribe(isMultiGoverned => {
      this.isMultiGoverned = isMultiGoverned;
    });

    this.anchor.addNew(
      this.languageService.getProfileLanguageUpdateNotifier()
        .subscribe((value: null | undefined) => {
          if (value === undefined) {
            // User manually changed preferred language
            this.isLoaded$.next(false);
          }
        })
    );
    this.anchor.addNew(
      combineLatest([this.languageService.onLanguageChange(), this.languageService.getParticipantGuidBeforeLanguageChange()])
      .pipe(delay(2000))
      .subscribe(
          ([, participantGuid]) => {
            !!participantGuid && this.session.setParticipant(participantGuid);
            this.languageService.notifyOfProfileLanguageUpdate();
          }
        ));

    if (this.isPrequal) {
      this.setupPrequalLangListener();
    }
  }

  public ngOnChanges(changes: { [propKey: string]: SimpleChange }): void {
    /* TODO: consider usage of this method in baseActivity.component.ts instead of current implementation.
       This fixes issue with additional ngChange events
    */
    for (const propName of Object.keys(changes)) {
      if (propName === 'studyGuid' || propName === 'activityGuid') {
        this.isLoaded$.next(false);
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
      .subscribe({
        next: x => {
          if (!x) {
            this.model = new ActivityForm();
          } else {
            this.model = x;
            this.stickySubtitle.emit(this.model.subtitle);
            this.activityCode.emit(this.model.activityCode);
            this.initSteps();
            this.isLoaded$.next(true);
          }

          // combine the latest status updates from the form model
          // and from the embedded components into one observable
          const canSaveSub = combineLatest([
            // update as we get responses from server
            merge(
              this.submissionManager.answerSubmissionResponse$,
              // We don't automatically get model updates if
              // local validation fails
              // so trigger one when submit
              this.submitAttempted
            ).pipe(
              map(() => this.model.validate()),
              // let's start with whatever it is the initial state of the form
              startWith(this.model.validate())),
            this.embeddedComponentsValidStatusChanged.asObservable().pipe(startWith(true))
          ])
            .pipe(
              map(status => status[0] && status[1]),
              delay(1)
            ).subscribe(this.isAllFormContentValid);

          this.anchor.addNew(canSaveSub);
        },
        error: () => {
          this.navigateToErrorPage();
        }
      });
    this.anchor.addNew(get);
  }

  public incrementStep(): void {
    const nextIndex = this.nextAvailableSectionIndex();
    if (nextIndex !== -1) {
      this.scrollToTop();
      // enable any validation errors to be visible
      this.validationRequested = true;
      this.sendSectionAnalytics();
      this.currentSection.validate();
      if (this.currentSection.valid) {
        this.resetValidationState();
        this.currentSectionIndex = nextIndex;
        this.visitedSectionIndexes[nextIndex] = true;
        this.currentActivityService.updateActivitySection(this.studyGuid, this.activityGuid, this.model, this.currentSectionIndex);
      }
    }
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    this.anchor.removeAll();
    this.currentActivityService.saveCurrentActivity(null);
  }

  public navigateToConsole(): void {
    this.sendLastSectionAnalytics();
    this.sendActivityAnalytics(AnalyticsEventCategories.CloseSurvey);

    this.router.navigateByUrl(this.isMultiGoverned ? RouterResources.ParticipantList : RouterResources.Dashboard);
  }

  private setupPrequalLangListener(): void {
    let prevLang = this.translateService.currentLang;

    this.anchor.addNew(
      this.translateService.onLangChange
        .pipe(
          filter(e => e.lang !== prevLang)
        )
        .subscribe(e => {
          prevLang = e.lang;

          this.getActivity();
        })
    );
  }
}
