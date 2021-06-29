import {
    AfterContentInit,
    Component,
    EventEmitter,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { map, mergeMap, take, tap } from 'rxjs/operators';
import {
    ActivityInstance,
    ActivityServiceAgent, AnalyticsEventCategories,
    AnalyticsEventsService, ConfigurationService, DashboardColumns, LanguageService,
    LoggingService,
    UserActivitiesDataSource,
    UserActivityServiceAgent
} from 'ddp-sdk';
import { PrionActivityInstanceState } from '../../models/prionActivityInstanceState';
import { PrionActivityInstanceStatusService } from '../../services/prionActivityInstanceStatusService.service';

@Component({
    selector: 'prion-user-activities',
    template: `
        <div [hidden]="!loaded">
            <mat-table [dataSource]="dataSource" class="ddp-dashboard">
                <!-- Name Column -->
                <ng-container matColumnDef="name">
                    <mat-header-cell class="padding-5" *matHeaderCellDef [innerHTML]="'SDK.UserActivities.ActivityName' | translate">
                    </mat-header-cell>
                    <mat-cell *matCellDef="let element" class="padding-5">
                        <span class="dashboard-mobile-label" [innerHTML]="'SDK.UserActivities.ActivityName' | translate"></span>
                        <mat-icon *ngIf="element.isHidden"
                                  class="dashboard-hidden-icon"
                                  matTooltip="{{ 'SDK.UserActivities.HiddenTooltip' | translate }}">
                            visibility_off
                        </mat-icon>
                        <button class="dashboard-activity-button Link"
                                [attr.data-ddp-test]="'activityName::' + element.instanceGuid"
                                (click)="openActivity(element.instanceGuid, element.activityCode)">
                            {{ element.activityName }}
                        </button>
                    </mat-cell>
                </ng-container>

                <!-- Summary Column -->
                <ng-container matColumnDef="summary">
                    <mat-header-cell class="padding-5" *matHeaderCellDef [innerHTML]="'SDK.UserActivities.Summary' | translate">
                    </mat-header-cell>
                    <mat-cell *matCellDef="let element"
                              class="padding-5"
                              [attr.data-ddp-test]="'activitySummary::' + element.instanceGuid" >
                        <span class="dashboard-mobile-label" [innerHTML]="'SDK.UserActivities.Summary' | translate"></span>
                        {{ getSummary(element) | async }}
                    </mat-cell>
                </ng-container>

                <!-- Date Column -->
                <ng-container matColumnDef="date">
                    <mat-header-cell class="padding-5" *matHeaderCellDef [innerHTML]="'SDK.UserActivities.ActivityDate' | translate">
                    </mat-header-cell>
                    <mat-cell *matCellDef="let element"
                              class="padding-5"
                              [attr.data-ddp-test]="'activityDate::' + element.createdAt">
                        <span class="dashboard-mobile-label" [innerHTML]="'SDK.UserActivities.ActivityDate' | translate"></span>
                        {{ getCreatedAt(element) | async | date: 'MM/dd/yyyy' }}
                    </mat-cell>
                </ng-container>

                <!-- Status Column -->
                <ng-container matColumnDef="status">
                    <mat-header-cell class="padding-5" *matHeaderCellDef [innerHTML]="'SDK.UserActivities.ActivityStatus' | translate">
                    </mat-header-cell>
                    <mat-cell *matCellDef="let element"
                              class="padding-5"
                              [attr.data-ddp-test]="'activityStatus::' + element.instanceGuid">
                        <span class="dashboard-mobile-label" [innerHTML]="'SDK.UserActivities.ActivityStatus' | translate"></span>
                        <div class="dashboard-status-container" [ngClass]="{'dashboard-status-container_summary': showSummary(element)}">
                            <ng-container *ngIf="element.icon">
                                <img class="dashboard-status-container__img"
                                     [attr.src]="domSanitizationService.bypassSecurityTrustUrl('data:image/svg+xml;base64,' + element.icon)"
                                     alt="">
                            </ng-container>
                            <ng-container *ngIf="showQuestionCount(element)">
                                {{ 'SDK.UserActivities.ActivityQuestionCount' | translate: { 'questionsAnswered': element.numQuestionsAnswered, 'questionTotal': element.numQuestions } }}
                            </ng-container>
                            <ng-container *ngIf="showSummary(element)">
                                {{ element.activitySummary }}
                            </ng-container>
                            <ng-container *ngIf="!showQuestionCount(element) && !showSummary(element)">
                                {{ getState(element.statusCode, element) }}
                            </ng-container>
                        </div>
                    </mat-cell>
                </ng-container>

                <!-- Actions Column -->
                <ng-container matColumnDef="actions">
                    <mat-header-cell *matHeaderCellDef [innerHTML]="'SDK.UserActivities.ActivityActions' | translate"></mat-header-cell>
                    <mat-cell *matCellDef="let element"
                              [attr.data-ddp-test]="'activityActions::' + element.readonly">
                        <span class="dashboard-mobile-label" [innerHTML]="'SDK.UserActivities.ActivityActions' | translate"></span>
                        <button *ngIf="'CREATED' === element.statusCode"
                                class="ButtonFilled Button--cell button button_small button_primary"
                                (click)="openActivity(element.instanceGuid, element.activityCode)"
                                [innerHTML]="getButtonTranslate(element) | translate">
                        </button>
                        <button *ngIf="'IN_PROGRESS' === element.statusCode"
                                class="ButtonFilled Button--cell button button_small button_primary"
                                (click)="openActivity(element.instanceGuid, element.activityCode)"
                                [innerHTML]="getButtonTranslate(element) | translate">
                        </button>
                        <ng-container
                                *ngIf="'COMPLETE' === element.statusCode">
                            <ng-container *ngIf="element.activityCode === longitudinalActivityCode; else viewAction">
                                <button class="ButtonFilled Button--cell button button_small button_primary"
                                        (click)="editActivity(element.instanceGuid, element.activityCode)"
                                        [innerHTML]="getButtonTranslate(element) | translate">
                                </button>
                            </ng-container>
                            <ng-template #viewAction>
                                <button class="ButtonBordered ButtonBordered--orange Button--cell button button_small button_secondary"
                                        (click)="openActivity(element.instanceGuid, element.activityCode)"
                                        [innerHTML]="'SDK.ReviewButton' | translate">
                                </button>
                            </ng-template>
                        </ng-container>
                    </mat-cell>
                </ng-container>

                <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
                <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
            </mat-table>
        </div>
    `
})
export class PrionUserActivitiesComponent implements OnInit, OnDestroy, OnChanges, AfterContentInit {
    // Ideally, this feature would be supported via a study builder option
    @Input() studyGuid: string;
    @Input() displayedColumns: Array<DashboardColumns> = ['name', 'summary', 'date', 'status', 'actions'];
    @Output() open: EventEmitter<string> = new EventEmitter();
    @Output() loadedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
    public dataSource: UserActivitiesDataSource;
    public loaded = false;
    public longitudinalActivityCode = 'PRIONMEDICAL';
    private states: Array<PrionActivityInstanceState> | null = null;
    private studyGuidObservable = new BehaviorSubject<string | null>(null);
    private loadingAnchor: Subscription;
    private cachedParentActivities: Array<ActivityInstance> = [];
    private readonly LOG_SOURCE = 'PrionUserActivitiesComponent';

    constructor(
        private serviceAgent: UserActivityServiceAgent,
        private logger: LoggingService,
        private activityServiceAgent: ActivityServiceAgent,
        private analytics: AnalyticsEventsService,
        private statusService: PrionActivityInstanceStatusService,
        @Inject('ddp.config') private config: ConfigurationService,
        public domSanitizationService: DomSanitizer) {}

    public ngOnInit(): void {
        this.dataSource = new UserActivitiesDataSource(
            this.serviceAgent,
            this.logger,
            this.studyGuidObservable);
        this.loadingAnchor =
            // get Observable for status list
            this.statusService.getStatuses().pipe(
                tap(x => this.states = x),
                // than we will intersect this observable with 'isNull'
                // observable stream from main data source, so we will get
                // single final result when both statuses and activity
                // instances will be loaded
                mergeMap(() => this.dataSource.isNull)
                // here is the final subscription, on which we will update
                // 'loaded' flag
            ).subscribe(x => {
                this.loaded = !x;
                this.loadedEvent.emit(this.loaded);
            });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['studyGuid']) {
            this.logger.logEvent(this.LOG_SOURCE, `studyChanged: ${this.studyGuid}`);
            this.studyGuidObservable.next(this.studyGuid);
        }
    }

    public ngAfterContentInit(): void {
        this.doAnalytics('opened');
    }

    public ngOnDestroy(): void {
        this.loadingAnchor.unsubscribe();
        this.loadedEvent.emit(false);
    }

    public openActivity(guid: string, code: string): void {
        const response$ = this.isReportActivity(code) ? this.activityServiceAgent.flushForm(this.config.studyGuid, guid) : of(null);
        response$.pipe(
            take(1)
        ).subscribe(() => {
            this.logger.logEvent(this.LOG_SOURCE, `Activity clicked: ${guid}`);
            this.doAnalytics(code);
            this.open.emit(guid);
        });
    }

    public editActivity(guid: string, code: string): void {
        this.activityServiceAgent.createInstance(this.config.studyGuid, code)
            .pipe(take(1))
            .subscribe(activity => {
                this.openActivity(activity.instanceGuid, code);
            });
    }

    private getParentInstance(instance: ActivityInstance): Observable<ActivityInstance> {
        if (this.cachedParentActivities !== null && this.cachedParentActivities !== undefined && this.cachedParentActivities.length > 0) {
            const cachedParentInstance: ActivityInstance = this.cachedParentActivities
                .find(act => act.instanceGuid === instance.previousInstanceGuid);
            if (cachedParentInstance !== null && cachedParentInstance !== undefined) {
                return of(cachedParentInstance);
            }
        }

        const activities = this.serviceAgent.getActivities(of(this.studyGuid));
        return activities.pipe(
            map(x => x.find(y => y.instanceGuid = instance.previousInstanceGuid)),
            tap(x => this.cachedParentActivities.push(x)));
    }

    public getState(code: string, instance: ActivityInstance): string {
        // TODO: This is never getting translated on status change
        if (this.states === null) {
            return code;
        }
        if (null !== instance.previousInstanceGuid) {
            code = 'COMPLETE';
        }
        const caption = this.states.find(x => x.code === code);
        return caption != null ? caption.name : '';
    }

    public getSummary(instance: ActivityInstance): Observable<string> {
        if (null === instance.previousInstanceGuid || undefined === instance.previousInstanceGuid) {
            // TODO:  This is the one that isn't getting translated on language change
             return of(instance.activitySummary);
        } else {
            const parentInstance: Observable<ActivityInstance> = this.getParentInstance(instance);
            return parentInstance.pipe(
                map(x => x.activitySummary)
            );
        }
    }

    public getCreatedAt(instance: ActivityInstance): Observable<number> {
        if (null === instance.previousInstanceGuid || undefined === instance.previousInstanceGuid) {
            return of(instance.createdAt);
        } else {
            const parentInstance: Observable<ActivityInstance> = this.getParentInstance(instance);
            return parentInstance.pipe(
                map(x => x.createdAt)
            );
        }
    }

    public showQuestionCount(activityInstance: ActivityInstance): boolean {
        if (!this.config.dashboardShowQuestionCount ||
            this.config.dashboardShowQuestionCountExceptions.includes(activityInstance.activityCode)) {
            return false;
        } else if (activityInstance.numQuestions === 0) {
            return false;
        } else {
            return !(activityInstance.statusCode === 'COMPLETE' && activityInstance.numQuestions === activityInstance.numQuestionsAnswered);
        }
    }

    public isActivityCompleted(statusCode: string): boolean {
        return this.config.dashboardActivitiesCompletedStatuses.includes(statusCode);
    }

    public isNewActivity(statusCode: string): boolean {
        return this.config.dashboardActivitiesStartedStatuses.includes(statusCode);
    }

    public isReportActivity(activityCode: string): boolean {
        return this.config.dashboardReportActivities.includes(activityCode);
    }

    public showSummary(activityInstance: ActivityInstance): boolean {
        return !!(this.config.dashboardSummaryInsteadOfStatus.includes(activityInstance.activityCode) && activityInstance.activitySummary);
    }

    public getButtonTranslate(activityInstance: ActivityInstance): string {
        if (activityInstance.previousInstanceGuid !== null && activityInstance.previousInstanceGuid !== undefined) {
            return 'SDK.EditButton';
        } else if (this.isActivityCompleted(activityInstance.statusCode)) {
            return 'SDK.CompleteButton';
        } else if (this.isReportActivity(activityInstance.activityCode)) {
            return 'SDK.OpenButton';
        } else if (this.showSummary(activityInstance)) {
            return 'SDK.ReportButton';
        } else if (this.isNewActivity(activityInstance.statusCode)) {
            return 'SDK.StartButton';
        } else {
            return 'SDK.EditButton';
        }
    }

    private doAnalytics(action: string): void {
        this.analytics.emitCustomEvent(AnalyticsEventCategories.Dashboard, action);
    }

}
