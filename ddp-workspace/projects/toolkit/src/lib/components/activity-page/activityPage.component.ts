import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkflowBuilderService } from '../../services/workflowBuilder.service';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';
import { HeaderConfigurationService } from '../../services/headerConfiguration.service';
import {
    LoggingService,
    UserActivityServiceAgent,
    ActivityServiceAgent,
    ActivityResponse,
    ActivityInstanceGuid,
    ActivityInstance
} from 'ddp-sdk';
import { Observable, Subject, of } from 'rxjs';
import { map, mergeMap, share, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'toolkit-activity-page',
    template: `
    <ng-container *ngIf="useRedesign; then newDesign else oldDesign"></ng-container>
    <ng-template #newDesign>
        <ddp-redesigned-activity [studyGuid]="studyGuid"
                                 [activityGuid]="(activityInstance$ | async)?.instanceGuid"
                                 (submit)="raiseSubmit($event)"
                                 (stickySubtitle)="showStickySubtitle($event)"
                                 (activityCode)="activityCodeChanged($event)">
        </ddp-redesigned-activity>
    </ng-template>
    <ng-template #oldDesign>
        <toolkit-header [showButtons]="false"
                        [stickySubtitle]="stickySubtitle">
        </toolkit-header>
        <ddp-activity [studyGuid]="studyGuid"
                      [activityGuid]="(activityInstance$ | async)?.instanceGuid"
                      (submit)="raiseSubmit($event)"
                      (stickySubtitle)="showStickySubtitle($event)">
        </ddp-activity>
    </ng-template>`
})
export class ActivityPageComponent implements OnInit, OnDestroy {
    @Output() submit: EventEmitter<void> = new EventEmitter();
    public studyGuid: string;
    public activityInstance$: Observable<ActivityInstanceGuid | null>;
    public stickySubtitle: string;
    public useRedesign: boolean;
    private activityGuid: string;
    // used as notifier to trigger completions
    // https://blog.angularindepth.com/rxjs-avoiding-takeuntil-leaks-fb5182d047ef
    // this could be overkill, but has nice property that actually trigger the onComplete
    // call on subscribe, so you can be sure it has been cleaned up.
    // | async subscriptions are cleaned up by Angular
    private ngUnsubscribe = new Subject();

    constructor(
        private serviceAgent: ActivityServiceAgent,
        private userActivityServiceAgent: UserActivityServiceAgent,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private workflowBuilder: WorkflowBuilderService,
        private logger: LoggingService,
        private headerConfig: HeaderConfigurationService,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) {
        this.activityGuid = this.activatedRoute.snapshot.data.activityGuid;
        // by default we will not create a new instance
        const createActivityInstance: boolean = !!(this.activatedRoute.snapshot.data.createActivityInstance);
        this.studyGuid = this.toolkitConfiguration.studyGuid;
        const existingActivityInstance$: Observable<any | null> = this.userActivityServiceAgent.getActivities(of(this.studyGuid))
            .pipe(
                map((activities: Array<ActivityInstance> | null) => {
                    if (activities) {
                        const activityInstance = activities.find(eachActivity => eachActivity.activityCode === this.activityGuid);
                        if (activityInstance) {
                            return activityInstance;
                        } else {
                            this.logger.logError('Could not find activity instance summary for study activity id: ' + this.activityGuid,
                                'Loading prequalifier activity instance');
                            return null;
                        }
                    } else {
                        this.logger.logError('Could not get the activities for study: ' + this.studyGuid,
                            'Loading prequalifier activity instance');
                    }
                    return null;
                }));
        if (createActivityInstance) {
            const newActivityInstance$: Observable<ActivityInstanceGuid | null> = this.serviceAgent
                .createInstance(this.studyGuid, this.activityGuid).pipe(
                    map(x => {
                        if (x) {
                            return x;
                        } else {
                            this.logger.logError('Could not create the activity instance for study activity guid:' + this.activityGuid,
                                'Creating prequalifier activity instance');
                            return null;
                        }
                    }));
            this.activityInstance$ = existingActivityInstance$.pipe(
                mergeMap((existing) => existing ? of(existing) : newActivityInstance$),
                share());
        } else {
            this.activityInstance$ = existingActivityInstance$.pipe(share());
        }
    }

    public ngOnInit(): void {
        this.useRedesign = this.toolkitConfiguration.enableRedesign;
        this.headerConfig.setupActivityHeader();
        this.activityInstance$.pipe(
            takeUntil(this.ngUnsubscribe))
            .subscribe(activityInstance =>
                !activityInstance && this.router.navigateByUrl(this.toolkitConfiguration.errorUrl));
    }

    public ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    public raiseSubmit(response: ActivityResponse): void {
        this.workflowBuilder.getCommand(response).execute();
    }

    public showStickySubtitle(stickySubtitle: string): void {
        this.stickySubtitle = stickySubtitle;
        this.headerConfig.stickySubtitle = stickySubtitle;
    }

    public activityCodeChanged(code: string): void {
        this.headerConfig.currentActivity = code;
    }
}
