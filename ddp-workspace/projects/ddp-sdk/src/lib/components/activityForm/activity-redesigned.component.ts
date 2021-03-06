import {
    AfterViewInit,
    ChangeDetectorRef,
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
import { LoggingService } from '../../services/logging.service';

@Component({
    selector: 'ddp-activity-redesigned',
    template: `
    <main class="main main_activity" [ngClass]="{'main_sticky': isLoaded && model && model.subtitle}">
        <ng-container *ngIf="isLoaded && model">
            <section class="section">
                <ddp-subject-panel></ddp-subject-panel>
                <ddp-admin-action-panel
                        [activityReadonly]="isReadonly()"
                        (requestActivityEdit)="updateIsAdminEditing($event)">
                </ddp-admin-action-panel>
            </section>
            <section *ngIf="model.subtitle" class="section sticky-section" [ngClass]="{'sticky-section_shadow': isScrolled}">
                <div class="content content_tight">
                    <div class="sticky-block" [innerHTML]="model.subtitle"></div>
                </div>
            </section>
            <section *ngIf="model.title" class="section header-section">
                <div class="content content_tight">
                    <h1 class="activity-header" [innerHTML]="model.title"></h1>
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
                            [readonly]="isReadonly() || dataEntryDisabled"
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
                    <div class="activity-steps">
                        <ng-container *ngFor="let section of model.sections; index as i">
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
                            [readonly]="isReadonly() || dataEntryDisabled"
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
                                [readonly]="isReadonly() || dataEntryDisabled"
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
                        <span class="last-updated">{{model.lastUpdatedText}} </span>
                    </ng-container>
                    <div class="activity-buttons" [ngClass]="{'activity-buttons_mobile': (!isStepped || isLastStep) && isAgree() && isLoaded && !isReadonly()}">
                        <ng-container *ngIf="isLoaded && isStepped">
                            <button *ngIf="!isFirstStep"
                                    [disabled]="(isPageBusy | async) || dataEntryDisabled"
                                    class="button button_medium button_secondary previous_button"
                                    (click)="decrementStep()"
                                    [innerHTML]="'SDK.PreviousButton' | translate">
                            </button>
                            <button *ngIf="!isLastStep"
                                    [disabled]="(isPageBusy | async) || dataEntryDisabled"
                                    class="button button_medium button_primary button_right next_button"
                                    (click)="incrementStep()"
                                    [innerHTML]="(isPageBusy | async) ? ('SDK.SavingButton' | translate) : ('SDK.NextButton' | translate)">
                            </button>
                        </ng-container>
                        <ng-container *ngIf="(!isStepped || isLastStep) && isLoaded">
                            <button *ngIf="!isReadonly() && !isAgree()" #submitButton
                                    [disabled]="(isPageBusy | async) || dataEntryDisabled"
                                    class="button button_medium button_primary button_right submit_button"
                                    (click)="flush()"
                                    (mouseenter)="mouseEnterOnSubmit()"
                                    [innerHTML]="(isPageBusy | async) ? ('SDK.SavingButton' | translate) : ('SDK.SubmitButton' | translate)">
                            </button>
                            <button *ngIf="isReadonly()"
                                    class="button button_medium button_primary button_right close_button"
                                    (click)="close()"
                                    [innerHTML]="'SDK.CloseButton' | translate">
                            </button>
                        </ng-container>
                        <ng-container *ngIf="(!isStepped || isLastStep) && isAgree() && isLoaded && !isReadonly()">
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

    private isAdminEditing = false;

    constructor(
        logger: LoggingService,
        windowRef: WindowRef,
        private changeRef: ChangeDetectorRef,
        renderer: Renderer2,
        submitService: SubmitAnnouncementService,
        analytics: AnalyticsEventsService,
        @Inject(DOCUMENT) document: any,
        injector: Injector) {
        super(logger, windowRef, renderer, submitService, analytics, document, injector);
    }

    public isAgree(): boolean {
        return this.model.formType === 'CONSENT' && this.agreeConsent;
    }

    public isReadonly(): boolean {
        return !this.isAdminEditing && this.model.readonly;
    }

    public updateIsAdminEditing(adminEditing: boolean): void {
        this.isAdminEditing = adminEditing;
        this.changeRef.detectChanges();
    }
}
