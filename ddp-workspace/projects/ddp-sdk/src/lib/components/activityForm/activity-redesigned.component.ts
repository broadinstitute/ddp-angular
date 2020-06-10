import {
    AfterViewInit,
    Component,
    Inject,
    Injector,
    OnDestroy,
    OnInit,
    Renderer2
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivityComponent } from './activity.component';
import { WindowRef } from '../../services/windowRef';
import { SubmitAnnouncementService } from '../../services/submitAnnouncement.service';
import { AnalyticsEventsService } from '../../services/analyticsEvents.service';
import { SubmissionManager } from '../../services/serviceAgents/submissionManager.service';

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
            <section *ngIf="model.title" class="section">
                <div class="content content_tight"
                     [ngClass]="{'content_download' : model.activityCode === 'CONSENT' || model.activityCode === 'ASSENT'}">
                    <h1>{{model.title}}</h1>
                    <a *ngIf="model.activityCode === 'CONSENT'"
                         download="Research_Consent_Form_EN.pdf"
                         class="BtnBordered BtnBordered--withIcon BtnBordered--neutral"
                         href="assets/pdf/A-T_Research_Consent_Form.pdf">
                        <mat-icon>arrow_circle_down</mat-icon>
                        {{ 'SDK.DownloadPdf.Consent.Download' | translate }}
                    </a>
                    <a *ngIf="model.activityCode === 'ASSENT'"
                         download="Research_Assent_Form_EN.pdf"
                         class="BtnBordered BtnBordered--withIcon BtnBordered--neutral"
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
                <!-- steps -->
                <ng-container *ngIf="isStepped && showStepper">
                    <div class="activity-steps">
                        <ng-container *ngFor="let section of model.sections; let i = index">
                            <ng-container *ngIf="section.visible">
                                <p class="activity-step no-margin big bold"
                                    (click)="jumpStep(i)"
                                    [class.active]="isActive(i)"
                                    [class.completed]="isCompleted(i)">
                                    {{section.name}}
                                </p>
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
                        <div class="infobox"  [innerHTML]="model.readonlyHint">
                        </div>
                    </ng-container>

                    <ng-container *ngIf="model.lastUpdatedText">
                        <span>{{model.lastUpdatedText}} </span>
                    </ng-container>
                    <div class="activity-buttons">
                        <ng-container *ngIf="isLoaded && isStepped">
                            <button *ngIf="!isFirstStep"
                                    [disabled]="(isPageBusy | async) || dataEntryDisabled"
                                    class="button button_medium button_secondary"
                                    (click)="decrementStep()">
                              <mat-icon *ngIf="buttonWithArrow">navigate_before</mat-icon>
                              {{ 'SDK.PreviousButton' | translate }}
                            </button>
                            <button *ngIf="!isLastStep"
                                    [disabled]="(isPageBusy | async) || dataEntryDisabled"
                                    class="button button_medium button_primary button_right"
                                    (click)="incrementStep()">
                              {{ (isPageBusy | async) ? ('SDK.SavingButton' | translate) : ('SDK.NextButton' | translate) }}
                              <mat-icon *ngIf="buttonWithArrow && !(isPageBusy | async)">navigate_next</mat-icon>
                            </button>
                        </ng-container>
                        <ng-container *ngIf="!isStepped || isLastStep">
                            <button *ngIf="!model.readonly && isLoaded
                            && model.activityCode !== 'REGISTRATION' && model.activityCode !== 'CONSENT'
                            && model.activityCode !== 'ASSENT' && model.activityCode !== 'CONTACTING_PHYSICIAN'"
                                    #submitButton
                                    [disabled]="(isPageBusy | async) || dataEntryDisabled"
                                    class="button button_medium button_primary button_right"
                                    (click)="flush()"
                                    (mouseenter)="mouseEnterOnSubmit()"
                                    [innerHTML]="(isPageBusy | async) ? ('SDK.SavingButton' | translate) : ('SDK.SubmitButton' | translate)">
                            </button>
                            <a *ngIf="model.readonly && isLoaded"
                                    class="BtnBordered  green button_right"
                                    href="/"
                                    (click)="close()"
                                    [innerHTML]="'SDK.CloseButton' | translate">
                            </a>
                            <a *ngIf="!model.readonly && isLoaded && model.activityCode === 'REGISTRATION'"
                                    href="/"
                                    disabled="(isPageBusy | async) || dataEntryDisabled"
                                    class="BtnBordered BtnBordered--neutral button_right"
                                    [innerHTML]="'SDK.CancelButton' | translate">
                            </a>
                            <button *ngIf="!model.readonly && isLoaded && model.activityCode === 'REGISTRATION'"
                                    #submitButton
                                    [disabled]="(isPageBusy | async) || dataEntryDisabled"
                                    class="button button_medium button_primary button_fill_green"
                                    (click)="flush()"
                                    (mouseenter)="mouseEnterOnSubmit()"
                                    [innerHTML]="(isPageBusy | async) ? ('SDK.SavingButton' | translate) : ('SDK.RegisterButton' | translate)">
                            </button>
                            <a *ngIf="!model.readonly && isLoaded && (model.activityCode === 'CONSENT' || model.activityCode === 'ASSENT')"
                                    href="/"
                                    disabled="(isPageBusy | async) || dataEntryDisabled"
                                    class="button button_medium button_secondary button_warn button_right"
                                    [innerHTML]="(model.activityCode === 'CONSENT' ? 'SDK.DoNotConsent' : 'SDK.DoNotAssent') | translate">
                            </a>
                            <button *ngIf="!model.readonly && isLoaded && (model.activityCode === 'CONSENT' || model.activityCode === 'ASSENT')"
                                    #submitButton
                                    [disabled]="(isPageBusy | async) || dataEntryDisabled"
                                    class="button button_medium button_primary button_fill_green"
                                    (click)="flush()"
                                    (mouseenter)="mouseEnterOnSubmit()"
                                    [innerHTML]="(isPageBusy | async)
                                    ? ('SDK.SavingButton' | translate)
                                    : ((model.activityCode === 'CONSENT' ? 'SDK.SignAndConsent' : 'SDK.SignAndAssent') | translate)">
                            </button>
                            <button *ngIf="!model.readonly && isLoaded && model.activityCode === 'CONTACTING_PHYSICIAN'"
                                    #submitButton
                                    [disabled]="(isPageBusy | async) || dataEntryDisabled"
                                    class="button button_medium button_primary button_fill_green button_right"
                                    (click)="flush()"
                                    (mouseenter)="mouseEnterOnSubmit()"
                                    [innerHTML]="(isPageBusy | async)
                                      ? ('SDK.SavingButton' | translate)
                                      : ('SDK.SaveAndSubmit' | translate)">
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
export class ActivityRedesignedComponent extends ActivityComponent implements OnInit, OnDestroy, AfterViewInit {
    constructor(
        windowRef: WindowRef,
        renderer: Renderer2,
        submitService: SubmitAnnouncementService,
        analytics: AnalyticsEventsService,
        @Inject(DOCUMENT) document: any,
        injector: Injector) {
        super(windowRef, renderer, submitService, analytics, document, injector);
    }
}
