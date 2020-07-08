import {
  AfterViewInit,
  Component,
  Inject,
  Injector,
  OnDestroy,
  OnInit,
  Renderer2,
  Input
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivityComponent } from './activity.component';
import { WindowRef } from '../../services/windowRef';
import { SubmitAnnouncementService } from '../../services/submitAnnouncement.service';
import { AnalyticsEventsService } from '../../services/analyticsEvents.service';
import { SubmissionManager } from '../../services/serviceAgents/submissionManager.service';
import { ActivityCodes } from '../../constants/activityCodes';

@Component({
  selector: 'ddp-activity-redesigned',
  template: `
    <main class="main main_activity" [ngClass]="{'main_sticky': isLoaded && model && model.subtitle}">
        <ng-container *ngIf="isLoaded && model">
            <section *ngIf="model.subtitle" class="section sticky-section" [ngClass]="{'sticky-section_shadow': isScrolled}">
            <div class="content content_tight">
              <div class="sticky-block" [innerHTML]="model.subtitle"></div>
            </div>
          </section>
            <section *ngIf="model.title" class="section header-section">
            <div class="content content_tight"
                 [ngClass]="{'content_download' : model.activityCode === ActivityCodes.CONSENT || ActivityCodes.ASSENT}">
                    <h1 class="activity-header" [innerHTML]="model.title"></h1>
                    <a *ngIf="model.activityCode === ActivityCodes.CONSENT"
                       download="Research_Consent_Form_EN.pdf"
                       class="ButtonBordered ButtonBordered--withIcon ButtonBordered--neutral"
                       href="assets/pdf/A-T_Research_Consent_Form.pdf">
                      <mat-icon>arrow_circle_down</mat-icon>
                      {{ 'SDK.DownloadPdf.Consent.Download' | translate }}
                    </a>
                    <a *ngIf="model.activityCode === ActivityCodes.ASSENT"
                       download="Research_Assent_Form_EN.pdf"
                       class="ButtonBordered ButtonBordered--withIcon ButtonBordered--neutral ButtonBordered--assent-kids"
                       href="assets/pdf/A-T_Research_Assent_Form.pdf">
                      <mat-icon>arrow_circle_down</mat-icon>
                      {{ 'SDK.DownloadPdf.Assent.Download' | translate }}
                    </a>
                </div>
            </section>
        </ng-container>
        <!-- article content -->
        <section *ngIf="!isLoaded" class="section section-spinner">
          <mat-spinner></mat-spinner>
        </section>
        <section *ngIf="isLoaded" class="section">
          <div class="content content_tight">
            <ng-container *ngIf="shouldShowReadonlyHint">
              <div class="infobox" [innerHTML]="model.readonlyHint">
              </div>
            </ng-container>
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

                <!-- simple steps -->
                <ng-container *ngIf="isStepped && showStepper && !isAgree()">
              <div [ngClass]="{'activity-steps' : model.activityCode !== ActivityCodes.ASSENT,
                                    'activity-steps-kids' : model.activityCode === ActivityCodes.ASSENT}">
                <ng-container *ngFor="let section of model.sections; index as i">
                          <ng-container *ngIf="section.visible">
                    <div [ngClass]="{'activity-step no-margin' : model.activityCode !== ActivityCodes.ASSENT,
                                    'activity-step-kids no-margin' : model.activityCode === ActivityCodes.ASSENT}"
                                 (click)="jumpStep(i)"
                                 [class.active]="isActive(i)"
                                 [class.completed]="isCompleted(i)">
                      <ng-container
                        *ngIf="(isActive(i) || isCompleted(i)) && setIcon(i, section.incompleteIcon, section.completeIcon)">
                        <div>
                          <img class="activity-step-image"
                               [src]="setIcon(i, section.incompleteIcon, section.completeIcon)">
                        </div>
                      </ng-container>
                      <p class="big bold">
                              {{section.name}}
                            </p>
                    </div>
                          </ng-container>
                        </ng-container>
                    </div>
                </ng-container>
                <!-- steps with circle -->
                <ng-container *ngIf="isStepped && showStepper && isAgree()">
                    <div class="activity-steps">
                        <ng-container *ngFor="let section of model.sections; index as i; last as isLastStep">
                            <ng-container *ngIf="section.visible">
                                <div class="activity-step"
                                     (click)="jumpStep(i)"
                                     [class.active]="isActive(i)"
                                     [class.completed]="isCompleted(i)">
                                     <span class="activity-step__number">{{i + 1}}</span>
                                     <span class="activity-step__text">{{section.name}}</span>
                                </div>
                                <div *ngIf="!isLastStep" class="activity-steps__divider"></div>
                            </ng-container>
                        </ng-container>
                    </div>
                </ng-container>

            <ng-container *ngIf="model">
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
                <div class="infobox" [innerHTML]="model.readonlyHint">
                </div>
              </ng-container>

              <ng-container *ngIf="model.lastUpdatedText">
                        <span class="last-updated">{{model.lastUpdatedText}} </span>
              </ng-container>
                  <hr>
                    <div class="activity-buttons" [ngClass]="{'activity-buttons_mobile': (!isStepped || isLastStep) && isAgree() && isLoaded && !model.readonly}">
                <ng-container *ngIf="isLoaded && isStepped && isFirstStep">
                  <button *ngIf="model.activityCode === ActivityCodes.MEDICAL_HISTORY"
                          [disabled]="(isPageBusy | async) || dataEntryDisabled"
                          class="button ButtonFilled ButtonFilled--green button_right"
                          (click)="incrementStep()">
                    {{ 'SDK.StartOrResume' | translate }}
                  </button>
                </ng-container>

                <ng-container *ngIf="isLoaded && isStepped && !isFirstStep">
                  <button [disabled]="(isPageBusy | async) || dataEntryDisabled"
                          class="button"
                          [ngClass]="{'ButtonBordered ButtonBordered--green' : model.activityCode !== ActivityCodes.ASSENT,
                                    'ButtonFilled ButtonFilled--kids ButtonFilled--light-green' : model.activityCode === ActivityCodes.ASSENT}"
                          (click)="decrementStep()">
                    <mat-icon *ngIf="buttonWithArrow">navigate_before</mat-icon>
                    {{ 'SDK.PreviousButton' | translate }}
                  </button>
                </ng-container>

                <ng-container *ngIf="isLoaded && isStepped && !isLastStep">
                  <button *ngIf="!(isFirstStep && model.activityCode === ActivityCodes.MEDICAL_HISTORY)"
                          [disabled]="(isPageBusy | async) || dataEntryDisabled"
                          class="button button_right"
                          [ngClass]="{'ButtonFilled ButtonFilled--kids ButtonFilled--light-green' : model.activityCode === ActivityCodes.ASSENT,
                                    'ButtonBordered ButtonBordered--green' : model.activityCode !== ActivityCodes.ASSENT}"
                          (click)="incrementStep()">
                    {{ (isPageBusy | async) ? ('SDK.SavingButton' | translate) : ('SDK.NextButton' | translate) }}
                    <mat-icon *ngIf="buttonWithArrow && !(isPageBusy | async)">navigate_next</mat-icon>
                  </button>
                </ng-container>
                        <ng-container *ngIf="(!isStepped || isLastStep) && !model.readonly && isLoaded">
                          <a *ngIf="model.activityCode === ActivityCodes.REGISTRATION"
                             href="/"
                             disabled="(isPageBusy | async) || dataEntryDisabled"
                             class="ButtonBordered ButtonBordered--neutral ButtonWide button_right"
                             [innerHTML]="'SDK.CancelButton' | translate">
                          </a>
                          <button *ngIf="!model.readonly && !isAgree() && model.activityCode === ActivityCodes.REGISTRATION"
                                  #submitButton
                                  [disabled]="(isPageBusy | async) || dataEntryDisabled"
                                  class="button ButtonFilled ButtonFilled--green ButtonWide"
                                  (click)="flush()"
                                  [innerHTML]="(isPageBusy | async) ? ('SDK.SavingButton' | translate) : ('SDK.RegisterButton' | translate)">
                          </button>
                            <a *ngIf="model.activityCode === ActivityCodes.CONSENT || model.activityCode === ActivityCodes.ASSENT"
                                    href="/"
                                    disabled="(isPageBusy | async) || dataEntryDisabled"
                                    class="button button_right"
                                    [ngClass]="{'ButtonBordered ButtonBordered--red' : model.activityCode === ActivityCodes.CONSENT,
                                     'ButtonFilled ButtonFilled--kids ButtonFilled--red' : model.activityCode === ActivityCodes.ASSENT}"
                     [innerHTML]="(model.activityCode === ActivityCodes.CONSENT ? 'SDK.DoNotConsent' : 'SDK.DoNotAssent') | translate">
                  </a>
                            <button *ngIf="model.activityCode === ActivityCodes.CONSENT || model.activityCode === ActivityCodes.ASSENT"
                    #submitButton
                    [disabled]="(isPageBusy | async) || dataEntryDisabled"
                    class="button"
                    [ngClass]="{'ButtonFilled ButtonFilled--green' : model.activityCode === ActivityCodes.CONSENT,
                                     'ButtonFilled ButtonFilled--kids ButtonFilled--light-green' : model.activityCode === ActivityCodes.ASSENT}"
                    (click)="flush()"
                    [innerHTML]="(isPageBusy | async)
                                    ? ('SDK.SavingButton' | translate)
                                    : ((model.activityCode === ActivityCodes.CONSENT ? 'SDK.SignAndConsent' : 'SDK.SignAndAssent') | translate)">
                  </button>
                            <button *ngIf="model.activityCode === ActivityCodes.CONTACTING_PHYSICIAN || model.activityCode === ActivityCodes.GENOME_STUDY"
                    #submitButton
                    [disabled]="(isPageBusy | async) || dataEntryDisabled"
                    class="button ButtonFilled ButtonFilled--green button_right"
                    (click)="flush()"
                    [innerHTML]="(isPageBusy | async)
                                      ? ('SDK.SavingButton' | translate)
                                      : ('SDK.SaveAndSubmit' | translate)">
                  </button>
                  <button *ngIf="model.activityCode === ActivityCodes.MEDICAL_HISTORY"
                          #submitButton
                          [disabled]="(isPageBusy | async) || dataEntryDisabled"
                          class="button ButtonFilled ButtonFilled--green button_right"
                          (click)="flush()"
                          (mouseenter)="mouseEnterOnSubmit()"
                          [innerHTML]="(isPageBusy | async) ? ('SDK.SavingButton' | translate) : ('SDK.SubmitButton' | translate)">
                  </button>
                            <button *ngIf="model.readonly"
                                    class="button button_medium button_primary button_right"
                                    (click)="close()"
                                    [innerHTML]="'SDK.CloseButton' | translate">
                            </button>
                  <button *ngIf="model.activityCode === ActivityCodes.REVIEW_AND_SUBMISSION"
                          #submitButton
                          class="button ButtonFilled ButtonFilled--green button_right"
                          (click)="flush()"
                          [innerHTML]="'SDK.SaveAndSubmitEnrollment' | translate">
                  </button>
                </ng-container>
                        <ng-container *ngIf="(!isStepped || isLastStep) && isAgree() && isLoaded && !model.readonly">
                            <button class="button button_medium button_warn"
                                    [disabled]="(isPageBusy | async) || dataEntryDisabled"
                                    (click)="close()">
                                    <mat-icon class="button__icon">highlight_off</mat-icon>
                                    {{'SDK.NotAgreeButton' | translate}}
                            </button>
                            <button #submitButton
                                    [disabled]="(isPageBusy | async) || dataEntryDisabled"
                                    class="button button_medium button_primary"
                                    (click)="flush()"
                                    (mouseenter)="mouseEnterOnSubmit()">
                                    <mat-icon *ngIf="!(isPageBusy | async)" class="button__icon">check_circle_outline</mat-icon>
                                    {{(isPageBusy | async) ? ('SDK.SavingButton' | translate) : ('SDK.AgreeButton' | translate)}}
                            </button>
                        </ng-container>
                      <ng-container *ngIf="!isStepped || isLastStep && (model.readonly && isLoaded)">
                        <a *ngIf="model.readonly && isLoaded"
                           [ngClass]="{'ButtonBordered  ButtonBordered--green button_right' : model.activityCode !== ActivityCodes.ASSENT,
                                     'ButtonFilled ButtonFilled--kids ButtonFilled--light-green' : model.activityCode === ActivityCodes.ASSENT}"
                           href="/"
                           [innerHTML]="'SDK.CloseButton' | translate">
                        </a>
                      </ng-container>
                    </div>
                    <div *ngIf="displayGlobalError$ | async" class="ErrorMessage">
                        <span translate>SDK.ValidateError</span>
                    </div>
                    <div *ngIf="communicationErrorOccurred" class="ErrorMessage">
                        <span translate>SDK.CommunicationError</span>
                    </div>
                </ng-container>
            </div>
        </section>
    </main>`,
  providers: [SubmitAnnouncementService, SubmissionManager]
})
export class ActivityRedesignedComponent extends ActivityComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() agreeConsent = false;
  public ActivityCodes = ActivityCodes;
  constructor(
    windowRef: WindowRef,
    renderer: Renderer2,
    submitService: SubmitAnnouncementService,
    analytics: AnalyticsEventsService,
    @Inject(DOCUMENT) document: any,
    injector: Injector) {
    super(windowRef, renderer, submitService, analytics, document, injector);
  }

  public isAgree(): boolean {
    return this.model.formType === 'CONSENT' && this.agreeConsent;
  }
}
