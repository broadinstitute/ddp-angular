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
import { GoogleAnalyticsEventsService } from '../../services/googleAnalyticsEvents.service';
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
            <section *ngIf="model.name" class="section">
                <div class="content content_tight">
                    <h1>{{model.name}}</h1>
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
                            (embeddedComponentValidStatusChanged)="updateEmbeddedComponentValidationStatus(0, $event)"
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
                            (embeddedComponentValidStatusChanged)="updateEmbeddedComponentValidationStatus(1, $event)"
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
                                (embeddedComponentValidStatusChanged)="updateEmbeddedComponentValidationStatus(2, $event)"
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
                                    (click)="decrementStep()"
                                    [innerHTML]="'SDK.PreviousButton' | translate">
                            </button>
                            <button *ngIf="!isLastStep"
                                    [disabled]="(isPageBusy | async) || dataEntryDisabled"
                                    class="button button_medium button_primary button_right"
                                    (click)="incrementStep()"
                                    [innerHTML]="(isPageBusy | async) ? ('SDK.SavingButton' | translate) : ('SDK.NextButton' | translate)">
                            </button>
                        </ng-container>
                        <ng-container *ngIf="!isStepped || isLastStep">
                            <button *ngIf="!model.readonly && isLoaded"  #submitButton
                                    [disabled]="(isPageBusy | async) || dataEntryDisabled"
                                    class="button button_medium button_primary button_right"
                                    (click)="flush()"
                                    (mouseenter)="mouseEnterOnSubmit()"
                                    [innerHTML]="(isPageBusy | async) ? ('SDK.SavingButton' | translate) : ('SDK.SubmitButton' | translate)">
                            </button>
                            <button *ngIf="model.readonly && isLoaded"
                                    class="button button_medium button_primary button_right"
                                    (click)="close()"
                                    [innerHTML]="'SDK.CloseButton' | translate">
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
        analytics: GoogleAnalyticsEventsService,
        @Inject(DOCUMENT) document: any,
        injector: Injector) {
        super(windowRef, renderer, submitService, analytics, document, injector);
    }
}
