import {
    AfterViewInit,
    ChangeDetectorRef,
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
import { BehaviorSubject, combineLatest, Observable, Subscription, timer } from 'rxjs';
import { debounceTime, delay, filter, map, mergeMap, startWith, take, tap } from 'rxjs/operators';
import { BlockType } from '../../models/activity/blockType';
import { AbstractActivityQuestionBlock } from '../../models/activity/abstractActivityQuestionBlock';
import { LoggingService } from '../../services/logging.service';
import { ActivityStatusCodes } from '../../models/activity/activityStatusCodes';
import { SearchParticipant } from '../../models/searchParticipant';
import { ParticipantsSearchServiceAgent } from '../../services/serviceAgents/participantsSearchServiceAgent.service';

@Component({
    selector: 'ddp-activity',
    templateUrl: './activity.component.html',
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

    public selectedUser$: Observable<SearchParticipant|null>;
    public currentSectionIndex = 0;
    public isScrolled = false;
    public communicationErrorOccurred = false;
    // one subject per section
    public embeddedComponentBusy$ = [false, false, false].map((initialVal) => new BehaviorSubject(initialVal));
    private readonly HEADER_HEIGHT: number = this.isMobile ? 10 : 70;
    private anchors: CompositeDisposable[];
    // one entry per section (header, body, and footer respectively)
    private embeddedComponentsValidationStatus: boolean[] = new Array(3).fill(true);
    private readonly LOG_SOURCE = 'ActivityComponent';
    private shouldSaveLastStep = false;
    private isAdminEditing = false;

    constructor(
        private logger: LoggingService,
        private windowRef: WindowRef,
        private renderer: Renderer2,
        private submitAnnouncementService: SubmitAnnouncementService,
        private analytics: AnalyticsEventsService,
        private participantsSearch: ParticipantsSearchServiceAgent,
        private changeRef: ChangeDetectorRef,
        @Inject(DOCUMENT) private document: any,
        // using Injector here as we get error using constructor injection
        // in both child and parent classes
        injector: Injector) {
        super(injector);
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

    public ngOnInit(): void {
        this.getActivity();
        const initStepperSub = this.initStepperState();
        const submitSub = this.submitAttempted.pipe(filter(attempted => attempted))
            .subscribe(() => this.submitAnnouncementService.announceSubmit());

        // all PATCH responses routed to here
        const resSub = this.submissionManager.answerSubmissionResponse$.subscribe(
            (response) => {
                    this.updateVisibility((response as PatchAnswerResponse).blockVisibility);
                    this.updateServerValidationMessages(response);
                    this.communicationErrorOccurred = false;
                },
                (error) => {
                    this.logger.logError(this.LOG_SOURCE, 'There has been unexpected error:', error);
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
            this.logger.logError('ActivityComponent', 'There was an error during submission:', error);
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

        this.anchors = [initStepperSub, resSub, invalidSub, subErrSub, submitSub].map(sub => new CompositeDisposable(sub));

        this.selectedUser$ = this.participantsSearch.getParticipant();
    }

    public ngAfterViewInit(): void {
        if (this.title && this.subtitle && !this.isScrolled) {
            this.renderer.setStyle(this.subtitle.nativeElement, 'width', `${this.title.nativeElement.offsetWidth}px`);
        }
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
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
            this.smoothScrollToTop();
            this.currentSectionIndex = step;
        }
    }

    public incrementStep(scroll: boolean = true): void {
        const nextIndex = this.nextAvailableSectionIndex();
        if (nextIndex !== -1) {
            this.submitAnnouncementService.announceSubmit();
            // The announcement could make listener components busy, but not instantly
            // introduce a wait before we check whether we busy or not
            timer(100).pipe(
                mergeMap(() =>
                    this.isPageBusy.pipe(
                        filter(pageIsBusy => !pageIsBusy),
                        tap(() => {
                            // run validations and compute flags for blocks to enable scrolling to errors
                            this.currentSection.validate();
                            this.model && this.model.shouldScrollToFirstInvalidQuestion();
                            // triggers scrolling
                            // and allows a local validation if answer is changed
                            // (see activityQuestion.component.ts, setupErrorMessage method)
                            this.validationRequested = true;
                        }),
                        // delay needed for validationRequested to be processed
                        delay(0),
                        tap(() => {
                            this.sendSectionAnalytics();
                            if (this.currentSection.valid) {
                                // reset scrolling signal and disable a local validation
                                this.validationRequested = false;

                                this.visitedSectionIndexes[nextIndex] = true;
                                this.saveLastVisitedSectionIndex(nextIndex);
                                this.currentSectionIndex = nextIndex;
                                if (scroll) {
                                    this.scrollToTop();
                                }
                            }
                        })
                    )
                ),
                take(1)
            ).subscribe();
        }
    }

    public decrementStep(scroll: boolean = true): void {
        const previousIndex = this.previousAvailableSectionIndex();
        if (previousIndex !== -1) {
            if (scroll) {
                this.scrollToTop();
            }
            this.isPageBusy.pipe(startWith(true)).pipe(
                filter(pageIsBusy => !pageIsBusy),
                debounceTime(this.timeToDebounce),
                tap(() => {
                    // if we move forwards or backwards, let's reset our validation display
                    this.resetValidationState();
                    this.currentSectionIndex = previousIndex;
                }),
                take(1)
            ).subscribe();
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

    protected sendSectionAnalytics(): void {
        // Some sections don't have name, just send section number
        const sectionName = this.model.sections[this.currentSectionIndex].name ?
            this.model.sections[this.currentSectionIndex].name :
            this.currentSectionIndex.toString();
        this.analytics.emitCustomEvent(this.model.activityCode, sectionName);
    }

    protected sendLastSectionAnalytics(): void {
        if (this.isStepped && this.isLastStep) {
            this.sendSectionAnalytics();
        }
    }

    protected sendActivityAnalytics(event: string): void {
        this.analytics.emitCustomEvent(event, this.model.activityCode);
    }

    protected scrollToTop(): void {
        this.windowRef.nativeWindow.scrollTo(0, 0);
    }

    protected nextAvailableSectionIndex(): number {
        for (let index = this.currentSectionIndex + 1; index < this.model.sections.length; index++) {
            if (this.model.sections[index].visible) {
                return index;
            }
        }
        return -1;
    }

    private smoothScrollToTop(): void {
        this.windowRef.nativeWindow.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    private previousAvailableSectionIndex(): number {
        for (let index = this.currentSectionIndex - 1; index < this.model.sections.length; index--) {
            if (this.model.sections[index].visible) {
                return index;
            }
        }
        return -1;
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

    protected saveLastVisitedSectionIndex(sectionIndex: number): void {
        if (this.shouldSaveLastStep && sectionIndex > this.model.sectionIndex) {
            this.serviceAgent.saveLastVisitedActivitySection(this.studyGuid, this.activityGuid, this.currentSectionIndex)
                .pipe(take(1))
                .subscribe();
        }
    }

    private initStepperState(): Subscription {
        return this.getIsLoaded$()
            .pipe(
                filter(Boolean),
                tap(() => {
                    if (this.model.statusCode !== ActivityStatusCodes.COMPLETE) {
                        this.shouldSaveLastStep = this.config.usesVerticalStepper.includes(this.model.activityCode);
                        this.currentSectionIndex = this.model.sectionIndex || 0;
                        this.visitedSectionIndexes = this.visitedSectionIndexes
                            .map((value, index) => index <= this.currentSectionIndex);
                    }
                })
            )
            .subscribe();
    }

    public isReadonly(): boolean {
        return !this.isAdminEditing && this.model.readonly;
    }

    public updateIsAdminEditing(adminEditing: boolean): void {
        this.isAdminEditing = adminEditing;
        this.changeRef.detectChanges();
    }
}
