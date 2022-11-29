import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  Injector,
  Input, OnDestroy,
  OnInit,
  Renderer2
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { delay } from 'rxjs/operators';

import {
  AnalyticsEventsService,
  SubmissionManager,
  SubmitAnnouncementService,
  WindowRef,
  LoggingService,
  ParticipantsSearchServiceAgent,
  SessionMementoService,
} from 'ddp-sdk';

import { AtcpActivityBaseComponent } from './app-atcp-activity-base.component';
import { ActivityCodes } from '../../sdk/constants/activityCodes';
import { PopupMessageComponent } from '../../toolkit/dialogs/popupMessage.component';
import * as Routes from '../../router-resources';

@Component({
  selector: 'app-atcp-activity',
  template: `
  <main class="main main_activity" [ngClass]="{'main_sticky': isLoaded && model && model.subtitle, 'feeding-survey': model?.activityCode === ActivityCodes.FEEDING}">
        <ng-container *ngIf="isLoaded && model">
            <section class="section">
                <ddp-subject-panel></ddp-subject-panel>
            </section>
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
                       [download]="consentFileName"
                       class="ButtonBordered ButtonBordered--withIcon ButtonBordered--neutral"
                       [href]="consentLink"
                    >
                      <mat-icon>arrow_circle_down</mat-icon>
                      {{ 'SDK.DownloadPdf.Consent.Download' | translate }}
                    </a>
                    <a *ngIf="model.activityCode === ActivityCodes.ASSENT"
                       [download]="assentFileName"
                       class="ButtonBordered ButtonBordered--withIcon ButtonBordered--neutral ButtonBordered--assent-kids"
                       [href]="assentLink">
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
                            (embeddedComponentsValidationStatus)="updateEmbeddedComponentValidationStatus(0, $event)"
                            (componentBusy)="embeddedComponentBusy$[0].next($event)">
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
                                    <p class="big bold">{{section.name}}</p>
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
                            (embeddedComponentsValidationStatus)="updateEmbeddedComponentValidationStatus(1, $event)"
                            (componentBusy)="embeddedComponentBusy$[1].next($event)">
                    </ddp-activity-section>

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
                        <div class="infobox" [innerHTML]="model.readonlyHint">
                        </div>
                    </ng-container>

                    <ng-container *ngIf="model.lastUpdatedText">
                        <span class="last-updated">{{model.lastUpdatedText}} </span>
                    </ng-container>
                    <hr>
                    <div class="activity-buttons" [ngClass]="{'activity-buttons_mobile': (!isStepped || isLastStep) && isAgree() && isLoaded && !model.readonly}">
                        <ng-container *ngIf="isLoaded && model.readonly && isFirstStep && model.activityCode !== ActivityCodes.REVIEW_AND_SUBMISSION">
                            <button class="ButtonBordered ButtonBordered--withIcon ButtonBordered--neutral button--print" (click)="onDownloadClick()">
                            <mat-icon>arrow_circle_down</mat-icon>
                            {{ 'SDK.DownloadButton' | translate }}
                            </button>
                        </ng-container>

                        <ng-container *ngIf="isLoaded && isStepped && isFirstStep">
                            <button *ngIf="model.activityCode === ActivityCodes.MEDICAL_HISTORY"
                                    [disabled]="(isPageBusy | async) || dataEntryDisabled"
                                    class="button ButtonFilled ButtonFilled--green button_right"
                                    (click)="incrementStep()"
                                    [innerHTML]="'SDK.StartOrResume' | translate">
                            </button>
                        </ng-container>

                        <ng-container *ngIf="isLoaded && isStepped && !isFirstStep">
                            <button [disabled]="(isPageBusy | async) || dataEntryDisabled"
                                    class="button button--prev"
                                    [ngClass]="{'ButtonBordered ButtonBordered--green' : model.activityCode !== ActivityCodes.ASSENT,
                                              'ButtonFilled ButtonFilled--kids ButtonFilled--light-green' : model.activityCode === ActivityCodes.ASSENT}"
                                    (click)="decrementStep()">
                                    <mat-icon *ngIf="buttonWithArrow">navigate_before</mat-icon>
                                    {{'SDK.PreviousButton' | translate}}
                            </button>
                        </ng-container>

                        <ng-container *ngIf="isLoaded && isStepped && !isLastStep">
                            <button *ngIf="!(isFirstStep && model.activityCode === ActivityCodes.MEDICAL_HISTORY)"
                                    [disabled]="(isPageBusy | async) || dataEntryDisabled"
                                    class="button button_right"
                                    [ngClass]="{'ButtonFilled ButtonFilled--kids ButtonFilled--light-green' : model.activityCode === ActivityCodes.ASSENT,
                                              'ButtonBordered ButtonBordered--green' : model.activityCode !== ActivityCodes.ASSENT}"
                                    (click)="incrementStep()">
                                    {{(isPageBusy | async)
                                        ? ('SDK.SavingButton' | translate)
                                        : ('SDK.NextButton' | translate)}}
                                    <mat-icon *ngIf="buttonWithArrow && !(isPageBusy | async)">navigate_next</mat-icon>
                            </button>
                        </ng-container>
                        <ng-container *ngIf="(!isStepped || isLastStep) && !model.readonly && isLoaded">
                            <button *ngIf="model.activityCode === ActivityCodes.REGISTRATION"
                                    class="ButtonBordered ButtonBordered--neutral ButtonWide button_right"
                                    (click)="navigateToConsole()"
                                    [disabled]="(isPageBusy | async) || dataEntryDisabled"
                                    [innerHTML]="'SDK.CancelButton' | translate">
                            </button>
                            <button *ngIf="!model.readonly && !isAgree() && model.activityCode === ActivityCodes.REGISTRATION"
                                    #submitButton
                                    [disabled]="(isPageBusy | async) || dataEntryDisabled"
                                    class="button ButtonFilled ButtonFilled--green ButtonWide"
                                    (click)="flush()"
                                    [innerHTML]="(isPageBusy | async)
                                        ? ('SDK.SavingButton' | translate)
                                        : ('SDK.RegisterButton' | translate)">
                            </button>
                            <button *ngIf="model.activityCode === ActivityCodes.CONSENT || model.activityCode === ActivityCodes.ASSENT"
                                    (click)="navigateToConsole()"
                                    [disabled]="(isPageBusy | async) || dataEntryDisabled"
                                    class="button button_right"
                                    [ngClass]="{'ButtonBordered ButtonBordered--red' : model.activityCode === ActivityCodes.CONSENT,
                                     'ButtonFilled ButtonFilled--kids ButtonFilled--red' : model.activityCode === ActivityCodes.ASSENT}"
                                    [innerHTML]="(model.activityCode === ActivityCodes.CONSENT
                                        ? 'SDK.DoNotConsent'
                                        : 'SDK.DoNotAssent') | translate">
                            </button>
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
                            <button *ngIf="model.activityCode === ActivityCodes.CONSENT_EDIT"
                                    #submitButton
                                    [disabled]="(isPageBusy | async) || dataEntryDisabled"
                                    class="button ButtonFilled ButtonFilled--green button_right"
                                    (click)="flush()"
                                    [innerHTML]="(isPageBusy | async)
                                        ? ('SDK.SavingButton' | translate)
                                        : ('SDK.SubmitButton' | translate)">
                            </button>
                            <button *ngIf="model.activityCode === ActivityCodes.CONTACTING_PHYSICIAN || model.activityCode === ActivityCodes.GENOME_STUDY || model.activityCode === ActivityCodes.BLOOD_TYPE"
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
                                    [innerHTML]="(isPageBusy | async)
                                        ? ('SDK.SavingButton' | translate)
                                        : ('SDK.SubmitButton' | translate)">
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
                                    {{(isPageBusy | async)
                                        ? ('SDK.SavingButton' | translate)
                                        : ('SDK.AgreeButton' | translate)}}
                            </button>
                        </ng-container>
                        <ng-container *ngIf="!isStepped || isLastStep && (model.readonly && isLoaded)">
                            <button *ngIf="model.readonly && isLoaded"
                                    [ngClass]="{'ButtonBordered  ButtonBordered--green button_right' : model.activityCode !== ActivityCodes.ASSENT,
                                         'ButtonFilled ButtonFilled--kids ButtonFilled--light-green' : model.activityCode === ActivityCodes.ASSENT}"
                                    (click)="navigateToConsole()"
                                    [innerHTML]="'SDK.CloseButton' | translate">
                            </button>
                        </ng-container>

                        <ng-container *ngIf="isLoaded && model.activityCode === ActivityCodes.FEEDING">
                            <button
                                *ngIf="!model.readonly && isLastStep"
                                class="button ButtonFilled ButtonFilled--green button_right"
                                [disabled]="isPageBusy | async"
                                (click)="onSubmitFeedingSurvey()"
                            >
                                <ng-container *ngIf="(isPageBusy | async); else feedingActivityControls">
                                    {{ 'SDK.SavingButton' | translate }}
                                </ng-container>

                                <ng-template #feedingActivityControls>
                                    <ng-container *ngIf="!model.readonly">
                                        {{ 'SDK.SubmitButton' | translate }}
                                    </ng-container>

                                    <ng-container *ngIf="model.readonly">
                                        {{ 'SDK.CloseButton' | translate }}
                                    </ng-container>
                                </ng-template>
                            </button>
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
export class AtcpActivityComponent extends AtcpActivityBaseComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() agreeConsent = false;
  @Input() buttonWithArrow = false;

  public ActivityCodes = ActivityCodes;

  private matDialog: MatDialog;

  constructor(
      logger: LoggingService,
      windowRef: WindowRef,
      renderer: Renderer2,
      submitService: SubmitAnnouncementService,
      analytics: AnalyticsEventsService,
      participantsSearchService: ParticipantsSearchServiceAgent,
      changeRef: ChangeDetectorRef,
      @Inject(DOCUMENT) document: any,
      injector: Injector,
      session: SessionMementoService) {
    super(logger, windowRef, renderer, submitService, analytics, participantsSearchService, changeRef, document, injector,session);

    this.matDialog = injector.get(MatDialog);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  public isAgree(): boolean {
      return this.model.formType === 'CONSENT' && this.agreeConsent;
  }

  public onSubmitFeedingSurvey(): void {
    if (this.model.readonly) {
      this.navigateToConsole();
    } else {
      this.flush();
      this.showThankYouPopup();
    }
  }

  public onDownloadClick(): void {
    this.router.navigateByUrl(Routes.ActivityPrint.replace(':instanceGuid', this.activityGuid));
  }

  public get fileLanguageCode(): string {
    return this.translateService.currentLang;
  }

  public get consentFileName(): string {
    return `A-T_Research_Consent_Form.${this.fileLanguageCode.toUpperCase()}.pdf`;
  }

  public get consentLink(): string {
    return `assets/pdf/${this.consentFileName}`;
  }

  public get assentFileName(): string {
    return `A-T_Research_Assent_Form.${this.fileLanguageCode.toUpperCase()}.pdf`;
  }

  public get assentLink(): string {
    return `assets/pdf/${this.assentFileName}`;
  }

  private showThankYouPopup(): void {
    const dialogRef = this.matDialog.open(PopupMessageComponent, {
      width: '100%',
      position: {
        top: '0px',
      },
      data: {
        text: this.translateService.instant('Survey.ThankYouPopup.Text'),
      },
      autoFocus: false,
      scrollStrategy: new NoopScrollStrategy(),
      panelClass: ['server-modal-box', 'thank-you-popup'],

    });

    dialogRef.afterOpened().pipe(delay(2000)).subscribe(() => {
      dialogRef.close();
    });
  }
}
