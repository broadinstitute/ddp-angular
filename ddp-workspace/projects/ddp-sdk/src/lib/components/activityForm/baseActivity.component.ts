import {
    EventEmitter,
    Injector,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChange,
    Component
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, Subject, combineLatest, merge } from 'rxjs';
import {
    concatMap,
    debounceTime,
    delay,
    filter,
    map,
    shareReplay,
    startWith,
    take,
    tap,
    withLatestFrom
} from 'rxjs/operators';

import { WorkflowServiceAgent } from '../../services/serviceAgents/workflowServiceAgent.service';
import { ActivityServiceAgent } from '../../services/serviceAgents/activityServiceAgent.service';
import { ActivityResponse } from '../../models/activity/activityResponse';
import { ActivityForm } from '../../models/activity/activityForm';
import { CompositeDisposable } from '../../compositeDisposable';
import { SubmissionManager } from '../../services/serviceAgents/submissionManager.service';
import { ConfigurationService } from '../../services/configuration.service';
import { BlockVisibility } from '../../models/activity/blockVisibility';

@Component({
    template: ``
})
export abstract class BaseActivityComponent implements OnChanges, OnDestroy {
    @Input() studyGuid: string;
    @Input() activityGuid: string;
    @Output() submit: EventEmitter<ActivityResponse | null> = new EventEmitter(true);
    @Output() stickySubtitle: EventEmitter<string | null> = new EventEmitter();
    @Output() activityCode: EventEmitter<string> = new EventEmitter();
    @Output() sectionsVisibilityChanged: EventEmitter<number> = new EventEmitter();
    protected embeddedComponentsValidStatusChanged = new Subject<boolean>();
    protected serviceAgent: ActivityServiceAgent;
    protected workflow: WorkflowServiceAgent;
    protected submissionManager: SubmissionManager;
    protected router: Router;
    protected config: ConfigurationService;
    public model: ActivityForm;
    public validationRequested = false;
    public isLoaded$ = new BehaviorSubject<boolean>(false);
    public isPageBusy = new BehaviorSubject(false);
    public isAllFormContentValid: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public displayGlobalError$: Observable<boolean>;
    // flag to indicate to form to not allow data entry
    public dataEntryDisabled = false;

    protected studyGuidObservable: BehaviorSubject<string | null>;
    protected activityGuidObservable: BehaviorSubject<string | null>;
    protected anchor: CompositeDisposable;
    protected visitedSectionIndexes: Array<boolean> = [true];
    protected submitAttempted = new Subject<boolean>();
    protected readonly timeToDebounce = 250;

    protected constructor(injector: Injector) {
        this.serviceAgent = injector.get(ActivityServiceAgent);
        this.workflow = injector.get(WorkflowServiceAgent);
        this.submissionManager = injector.get(SubmissionManager);
        this.router = injector.get(Router);
        this.config = injector.get<ConfigurationService>('ddp.config' as any);
        this.studyGuidObservable = new BehaviorSubject<string | null>(null);
        this.activityGuidObservable = new BehaviorSubject<string | null>(null);
        this.anchor = new CompositeDisposable();
        this.setupDisplayGlobalErrorObservable();
        this.setupSubmitPipeline();
    }

    public get isLoaded(): boolean {
        return this.isLoaded$.getValue();
    }

    public getIsLoaded$(): Observable<boolean> {
        return this.isLoaded$.asObservable();
    }

    public ngOnChanges(changes: { [propKey: string]: SimpleChange }): void {
        for (const propName of Object.keys(changes)) {
            if (propName === 'studyGuid') {
                this.studyGuidObservable.next(this.studyGuid);
            } else if (propName === 'activityGuid') {
                this.activityGuidObservable.next(this.activityGuid);
            }
            if (propName === 'studyGuid' || propName === 'activityGuid') {
                this.isLoaded$.next(false);
                this.resetValidationState();
            }
        }
    }

    public ngOnDestroy(): void {
        this.anchor.removeAll();
    }

    protected getActivity(): void {
      const get = this.serviceAgent
        .getActivity(this.studyGuidObservable, this.activityGuidObservable)
        .subscribe({
            next: x => {
                // to prevent using `visitedSectionIndexes` from previous activity
                this.resetVisitedSectionIndexes();

                if (!x) {
                    this.model = new ActivityForm();
                } else {
                    this.model = x;
                    this.stickySubtitle.emit(this.model.subtitle);
                    this.activityCode.emit(this.model.activityCode);
                    this.initSteps();
                    this.isLoaded$.next(true);
                }
                this.submitAttempted.next(false);

                // combine the latest status updates from the form model
                // and from the embedded components into one observable
                const canSaveSub = combineLatest([
                    // update as we get responses from server
                    merge(
                        this.submissionManager.answerSubmissionResponse$,
                        // We don't automatically get model updates if local validation fails
                        // so trigger one when submit
                        this.submitAttempted.pipe(filter(attempted => attempted))
                    ).pipe(
                        map(() => this.model.validate(this.config.validateOnlyVisibleSections)),
                        // let's start with whatever it is the initial state of the form
                        startWith(this.model.validate(this.config.validateOnlyVisibleSections))
                    ),
                    this.embeddedComponentsValidStatusChanged.asObservable().pipe(startWith(true))
                ])
                    .pipe(
                        map(status => status[0] && status[1]),
                        delay(1)
                    ).subscribe(this.isAllFormContentValid);

              this.anchor.addNew(canSaveSub);
            },
            error: (error) => {
                this.navigateToErrorPage();
            }
        });
      this.anchor.addNew(get);
    }

    protected navigateToErrorPage(): void {
        this.router.navigateByUrl(this.config.errorPageUrl);
    }

    public refresh(): void {
        this.activityGuidObservable.next(this.activityGuidObservable.value);
    }

    public updateVisibility(visibility: BlockVisibility[]): void {
        visibility.forEach(element => {
            this.model.sections.forEach(section => {
                section.blocks.forEach(block => {
                    if (block.id === element.blockGuid) {
                        block.shown = element.shown;
                    }
                });
            });
        });
        this.model.recalculateSectionsVisibility();
        this.sectionsVisibilityChanged.emit(this.model.visibleSectionsCount());
    }

    public flush(): void {
        this.submitAttempted.next(true);
        this.setFlags(false);
    }

    private setFlags(flagVal: boolean): void {
        this.validationRequested = flagVal;
        this.dataEntryDisabled = flagVal;
    }

    private setupSubmitPipeline(): void {
        // todo the setting and unsetting of flags to make the page scroll to right
        // place if error is way complicated  let's revisit this
        const sub = this.submitAttempted
            .pipe(
                filter(userPushedButton => userPushedButton),
                // delay allows for isAllFormContentValid to be updated first
                delay(1),
                tap(() => {
                    this.model && this.model.shouldScrollToFirstInvalidQuestion();
                    this.setFlags(true);
                }),
                // Wait for activity in page to cease
                // if not busy for debounce time then we good to go
                concatMap(() => this.isPageBusy.pipe(
                    debounceTime(this.timeToDebounce),
                    filter(isPageBusy => !isPageBusy),
                    take(1))
                ),
                // if we can't save we are not going past filter, so do necessary cleanup here
                tap(() => !this.isAllFormContentValid.value && (this.dataEntryDisabled = false)),
                filter(() => this.isAllFormContentValid.value),
                concatMap(() => this.serviceAgent.flushForm(this.studyGuid, this.activityGuid))
            )
            .subscribe((x) => {
                if (x) {
                    this.submit.emit(x.body.workflow);
                } else {
                    this.navigateToErrorPage();
                }
            });
        this.anchor.addNew(sub);
    }

    public close(): void {
        this.router.navigateByUrl(this.config.dashboardPageUrl);
    }

    protected initSteps(): void {
        if (!this.model.isSomeSectionVisible()) {
            this.nextWorkflowActivity();
        } else if (this.model.sections.length > 1) {
            const length = this.model.sections.length;
            for (let i = 1; i < length; i++) {
                this.model.readonly ? this.visitedSectionIndexes.push(true) : this.visitedSectionIndexes.push(false);
            }
        }
    }

    private setupDisplayGlobalErrorObservable(): void {
        this.displayGlobalError$ = this.isAllFormContentValid.pipe(
            withLatestFrom(this.submitAttempted),
            map(([valid, submit]) => this.model && submit && !valid),
            shareReplay()
        );
    }

    private resetVisitedSectionIndexes(): void {
        this.visitedSectionIndexes = [true]; // start value
    }

    protected resetValidationState(): void {
        this.setFlags(false);
    }

    protected nextWorkflowActivity(): void {
        this.workflow.getNext()
            .pipe(take(1))
            .subscribe(response => this.submit.emit(response));
    }
}
