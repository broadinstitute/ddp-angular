import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    ViewChildren
} from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { catchError, concatMap, takeUntil } from 'rxjs/operators';

import { ActivityActivityBlock } from '../../../../models/activity/activityActivityBlock';
import { ActivityRenderHintType } from '../../../../models/activity/activityRenderHintType';
import { ActivityInstance } from '../../../../models/activityInstance';
import { ActivityServiceAgent } from '../../../../services/serviceAgents/activityServiceAgent.service';
import { ActivityInstanceGuid } from '../../../../models/activityInstanceGuid';
import { LoggingService } from '../../../../services/logging.service';
import { ModalActivityBlockComponent } from '../modalActivityBlock/modalActivityBlock.component';

@Component({
    selector: 'ddp-activity-block',
    templateUrl: './activityBlock.component.html',
    styleUrls: ['./activityBlock.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityBlockComponent implements OnInit, OnDestroy {
    @Input() block: ActivityActivityBlock;
    @Input() readonly: boolean;
    @Input() validationRequested: boolean;
    @Input() studyGuid: string;
    @Input() parentActivityInstanceGuid: string;
    @Output() validStatusChanged = new EventEmitter<boolean>();
    @Output() embeddedComponentBusy = new EventEmitter<boolean>();
    @ViewChildren(ModalActivityBlockComponent) private modalActivities: QueryList<ModalActivityBlockComponent>;
    isModal: boolean;
    childInstances: ActivityInstance[];
    private ngUnsubscribe = new Subject();
    private readonly LOG_SOURCE = 'ActivityBlockComponent';

    constructor(private activityServiceAgent: ActivityServiceAgent,
                private logger: LoggingService,
                private cdr: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.isModal = this.block.renderHint === ActivityRenderHintType.Modal;
        this.childInstances = this.block.instances;
    }

    getInstanceId(index: number, instance: ActivityInstance): string {
        return instance.instanceGuid;
    }

    onDeleteChildInstance(instanceGuid: string): void {
        const index = this.childInstances.findIndex(instance => instance.instanceGuid === instanceGuid);
        this.childInstances.splice(index, 1);
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
                this.cdr.detectChanges();
                this.openCreatedInstanceDialog(instance.instanceGuid);
            });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    private openCreatedInstanceDialog(instanceGuid: string): void {
        const modalActivity = this.modalActivities.find(activity => activity.instance.instanceGuid === instanceGuid);
        if (modalActivity) {
            modalActivity.openEditDialog();
        }
    }
}
