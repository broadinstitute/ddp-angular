import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { catchError, concatMap, takeUntil } from 'rxjs/operators';

import { ActivityActivityBlock } from '../../../../models/activity/activityActivityBlock';
import { ActivityRenderHintType } from '../../../../models/activity/activityRenderHintType';
import { ActivityInstance } from '../../../../models/activityInstance';
import { ActivityServiceAgent } from '../../../../services/serviceAgents/activityServiceAgent.service';
import { ActivityInstanceGuid } from '../../../../models/activityInstanceGuid';
import { LoggingService } from '../../../../services/logging.service';

@Component({
    selector: 'ddp-activity-block',
    templateUrl: './activityBlock.component.html',
    styleUrls: ['./activityBlock.component.scss']
})
export class ActivityBlockComponent implements OnInit, OnDestroy {
    @Input() block: ActivityActivityBlock;
    @Input() readonly: boolean;
    @Input() validationRequested: boolean;
    @Input() studyGuid: string;
    @Input() parentActivityInstanceGuid: string;
    isModal: boolean;
    childInstances: ActivityInstance[];
    private ngUnsubscribe = new Subject();
    private readonly LOG_SOURCE = 'ActivityBlockComponent';

    constructor(private activityServiceAgent: ActivityServiceAgent,
                private logger: LoggingService) {
    }

    ngOnInit(): void {
        this.isModal = this.block.renderHint === ActivityRenderHintType.Modal;
        this.childInstances = this.block.instances;
    }

    getInstanceId(index: number, instance: ActivityInstance): string {
        return instance.instanceGuid;
    }

    onDeleteChildInstance(instanceGuid: string): void {
        this.childInstances = this.childInstances.filter(instance => instance.instanceGuid !== instanceGuid);
    }

    createChildInstance(): void {
        this.activityServiceAgent.createInstance(this.studyGuid, this.block.activityCode, this.parentActivityInstanceGuid)
            .pipe(
                concatMap((instanceGuid: ActivityInstanceGuid) => {
                    return this.activityServiceAgent.getActivitySummary(this.studyGuid, instanceGuid.instanceGuid);
                }),
                catchError(err => {
                    this.logger.logError(this.LOG_SOURCE, 'An error during a new instance creation', err);
                    return throwError(err);
                }),
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((instance: ActivityInstance) => {
                this.childInstances.push(instance);
            });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
