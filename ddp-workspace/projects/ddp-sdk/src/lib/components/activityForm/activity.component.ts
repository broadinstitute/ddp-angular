import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    Inject,
    Injector,
    Input,
    OnDestroy,
    OnInit,
    Renderer2,
    ViewChild
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BaseActivityComponent } from './baseActivity.component';
import { WindowRef } from '../../services/windowRef';
import { SubmitAnnouncementService } from '../../services/submitAnnouncement.service';
import { AnalyticsEventsService } from '../../services/analyticsEvents.service';
import { SubmissionManager } from '../../services/serviceAgents/submissionManager.service';
import { PatchAnswerResponse } from '../../models/activity/patchAnswerResponse';
import { ActivitySection } from '../../models/activity/activitySection';
import { AnalyticsEventCategories } from '../../models/analyticsEventCategories';
import { CompositeDisposable } from '../../compositeDisposable';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { BlockType } from '../../models/activity/blockType';
import { AbstractActivityQuestionBlock } from '../../models/activity/abstractActivityQuestionBlock';

@Component({
    selector: 'ddp-activity',
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
                            <div class="row WizardSteps-container">
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
                                <div *ngIf="!isStepped || isLastStep">
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
export class ActivityComponent extends BaseActivityComponent implements OnInit, OnDestroy, AfterViewInit {
    // We can use showSubtitle input parameter if we want to show subtitle even if page was scrolled
    @Input() showSubtitle = false;
    @ViewChild('title', { static: true }) title: ElementRef;
    @ViewChild('subtitle', { static: false }) subtitle: ElementRef;
    @ViewChild('submitButton', { static: false }) submitButton;
    public currentSectionIndex = 0;
    public isScrolled = false;
    public communicationErrorOccurred = false;
    private readonly HEADER_HEIGHT: number = this.isMobile ? 10 : 70;
    private anchors: CompositeDisposable[];
    // one entry per section (header, body, and footer respectively)
    private embeddedComponentsValidationStatus: boolean[] = new Array(3).fill(true);
    // one subject per section
    public embeddedComponentBusy$ = [false, false, false].map((initialVal) => new BehaviorSubject(initialVal));

    constructor(
        private windowRef: WindowRef,
        private renderer: Renderer2,
        private submitService: SubmitAnnouncementService,
        private analytics: AnalyticsEventsService,
        @Inject(DOCUMENT) private document: any,
        // using Injector here as we get error using constructor injection
        // in both child and parent classes
        injector: Injector) {
        super(injector);
    }

    public ngOnInit(): void {
        super.getActivity();
        const submitSub = this.submit.subscribe(response => this.submitService.announceSubmit(response));
        // all PATCH responses routed to here
        const resSub = this.submissionManager.answerSubmissionResponse$.subscribe(
            (response) => {
                this.updateVisibility((response as PatchAnswerResponse).blockVisibility);
                this.updateServerValidationMessages(response);
            },
            (error) => {
                console.log('There has been unexpected error: ' + JSON.stringify(error, Object.getOwnPropertyNames(error)));
                this.navigateToErrorPage();
            }
        );

        // If there are communication problems, there is a chance we might have missed some visibility updates
        // user should double-check their work
        const invalidSub = this.submissionManager.answerSubmissionWarning$.subscribe(() => {
            this.communicationErrorOccurred = true;
        });

        // Get notified of failure patching. Submission Manager has given up.
        const subErrSub = this.submissionManager.answerSubmissionFailure$.subscribe((error) => {
            console.log('There was an error during submission:\n' + JSON.stringify(error, Object.getOwnPropertyNames(error)));
            return this.navigateToErrorPage();
        });

        // if we are patching or an embedded component is busy, page is busy
        combineLatest((this.embeddedComponentBusy$ as Observable<boolean>[])
            .concat([this.submissionManager.isAnswerSubmissionInProgress$]))
            .pipe(
                map(latestVals => latestVals.some(val => val)),
                // fix Angular changed-after-check problem
                delay(0))
            .subscribe(this.isPageBusy);

        this.anchors = [resSub, invalidSub, subErrSub, submitSub].map(sub => new CompositeDisposable(sub));
    }

    public ngAfterViewInit(): void {
        if (this.title && this.subtitle && !this.isScrolled) {
            this.renderer.setStyle(this.subtitle.nativeElement, 'width', `${this.title.nativeElement.offsetWidth}px`);
        }
    }

    public ngOnDestroy(): void {
        this.anchors.forEach(anchor => anchor.removeAll());
    }

    /**
     * Consolidate the embedded component status and emit it
     * param sectionIdx the pos in array with status for section
     * param isValid true or false
     */
    public updateEmbeddedComponentValidationStatus(sectionIndex: number, isValid: boolean): void {
        this.embeddedComponentsValidationStatus[sectionIndex] = isValid;
        const reducedValidationStatus = this.embeddedComponentsValidationStatus.reduce((accumulator, value) => accumulator && value, true);
        this.embeddedComponentsValidStatusChanged.next(reducedValidationStatus);
    }

    public mouseEnterOnSubmit(): void {
        this.submitButton.focus ? this.submitButton.focus() : this.submitButton.nativeElement.focus();
    }

    public close(): void {
        this.sendLastSectionAnalytics();
        this.sendActivityAnalytics(AnalyticsEventCategories.CloseSurvey);
        super.close();
    }

    public flush(): void {
        this.sendLastSectionAnalytics();
        this.sendActivityAnalytics(AnalyticsEventCategories.SubmitSurvey);
        super.flush();
    }

    public isActive(step: number): boolean {
        return this.currentSectionIndex === step;
    }

    public isCompleted(step: number): boolean {
        return this.visitedSectionIndexes[step];
    }

    public jumpStep(step: number): void {
        if (this.visitedSectionIndexes[step]) {
            this.scrollToTop();
            this.currentSectionIndex = step;
        }
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
            }
        }
    }

    public decrementStep(): void {
        const previousIndex = this.previousAvailableSectionIndex();
        if (previousIndex !== -1) {
            // if we move forwards or backwards, let's reset our validation display
            this.resetValidationState();
            this.currentSectionIndex = previousIndex;
            this.scrollToTop();
        }
    }

    public setIcon(step: number, incompleteIcon: string, completeIcon: string): string {
        if (step === this.currentSectionIndex) {
            return incompleteIcon;
        } else if (this.visitedSectionIndexes[step]) {
            return completeIcon;
        }
        return incompleteIcon;
    }

    public get showStepper(): boolean {
        return this.model.sections.some(section => section.name || section.icons.length);
    }

    public get isStepped(): boolean {
        return this.model.sections.length > 1;
    }

    public get isLastStep(): boolean {
        return this.nextAvailableSectionIndex() === -1;
    }

    public get isFirstStep(): boolean {
        return this.currentSectionIndex === 0;
    }

    public get currentSection(): ActivitySection {
        if (this.isStepped && this.currentSectionIndex < this.model.sections.length) {
            return this.model.sections[this.currentSectionIndex];
        } else if (this.model.sections.length > 0) {
            return this.model.sections[0];
        }
        return new ActivitySection();
    }

    public get shouldShowReadonlyHint(): boolean {
        return !!(this.model) && !!(this.model.readonlyHint) && this.model.readonly;
    }

    public get isMobile(): boolean {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    private sendSectionAnalytics(): void {
        // Some sections don't have name, just send section number
        const sectionName = this.model.sections[this.currentSectionIndex].name ?
            this.model.sections[this.currentSectionIndex].name :
            this.currentSectionIndex.toString();
        this.analytics.emitCustomEvent(this.model.activityCode, sectionName);
    }

    private sendLastSectionAnalytics(): void {
        if (this.isStepped && this.isLastStep) {
            this.sendSectionAnalytics();
        }
    }

    private sendActivityAnalytics(event: string): void {
        this.analytics.emitCustomEvent(event, this.model.activityCode);
    }

    private scrollToTop(): void {
        this.windowRef.nativeWindow.scrollTo(0, 0);
    }

    private nextAvailableSectionIndex(): number {
        for (let index = this.currentSectionIndex + 1; index < this.model.sections.length; index++) {
            if (this.model.sections[index].visible) {
                return index;
            }
        }
        return -1;
    }

    private previousAvailableSectionIndex(): number {
        for (let index = this.currentSectionIndex - 1; index < this.model.sections.length; index--) {
            if (this.model.sections[index].visible) {
                return index;
            }
        }
        return -1;
    }

    @HostListener('window: scroll') public onWindowScroll(): void {
        const scrolledPixels = this.windowRef.nativeWindow.pageYOffset ||
            this.document.documentElement.scrollTop ||
            this.document.body.scrollTop || 0;
        if (scrolledPixels > this.HEADER_HEIGHT) {
            this.isScrolled = true;
        } else if (scrolledPixels < this.HEADER_HEIGHT) {
            this.isScrolled = false;
        }
    }

    private updateServerValidationMessages(response: PatchAnswerResponse): void {
        const questionBlocks: AbstractActivityQuestionBlock[] = this.model.sections.reduce((allBlocks, section) =>
            allBlocks.concat(section.blocks.filter(block => block.blockType === BlockType.Question)), []);
        // We should clear server-side validations each time to prevent messages accumulating
        questionBlocks.forEach(qBlock => qBlock.serverValidationMessages = []);
        if (response.validationFailures && response.validationFailures.length !== 0) {
            const answerStableIds = response.answers.map(answer => answer.stableId);
            response.validationFailures.forEach(failure => {
                // First we try to see if we can find the question that provided the answer that triggered the failure
                const questionsForResponse = questionBlocks
                    .filter(qBlock => answerStableIds.includes(qBlock.stableId) && failure.stableIds.includes(qBlock.stableId));
                if (questionsForResponse.length > 0) {
                    questionsForResponse.forEach(block => block.addServerValidationMessage(failure.message));
                } else {
                    // Must be that the validation failures was not caused by this answer so find a block to assign it to
                    // Try to find the first visible block
                    const shownBlocks = questionBlocks.filter(qBlock => qBlock.shown && failure.stableIds.includes(qBlock.stableId));
                    if (shownBlocks.length > 0) {
                        shownBlocks[0].addServerValidationMessage(failure.message);
                    } else {
                        const anyBlockInFailure = questionBlocks.filter(qBlock => failure.stableIds.includes(qBlock.stableId));
                        anyBlockInFailure.length > 0 && questionBlocks[0].addServerValidationMessage(failure.message);
                    }
                }
            });
        }
    }
}
