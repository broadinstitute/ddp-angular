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
import { catchError, concatMap, takeUntil, tap, map } from 'rxjs/operators';

import { ActivityActivityBlock } from '../../../../models/activity/activityActivityBlock';
import { ActivityRenderHintType } from '../../../../models/activity/activityRenderHintType';
import { ActivityInstance } from '../../../../models/activityInstance';
import { ActivityServiceAgent } from '../../../../services/serviceAgents/activityServiceAgent.service';
import { LoggingService } from '../../../../services/logging.service';
import { ModalActivityBlockComponent } from '../modalActivityBlock/modalActivityBlock.component';
import { BlockVisibility } from '../../../../models/activity/blockVisibility';

@Component({
    selector: 'ddp-activity-block',
    templateUrl: './activityBlock.component.html',
    styleUrls: ['./activityBlock.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityBlockComponent implements OnInit, OnDestroy {
    @Input() block: ActivityActivityBlock;
    @Input() enabled: boolean;
    @Input() readonly: boolean;
    @Input() validationRequested: boolean;
    @Input() studyGuid: string;
    @Input() parentActivityInstanceGuid: string;
    @Output() validStatusChanged = new EventEmitter<{id: string; value: boolean}>();
    @Output() embeddedComponentBusy = new EventEmitter<boolean>();
    @Output() blockVisibilityChanged = new EventEmitter<BlockVisibility[]>();
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
                concatMap(response => {
                    return this.activityServiceAgent
                        .getActivitySummary(this.studyGuid, response.instanceGuid)
                        .pipe(
                            map<ActivityInstance, { instance: ActivityInstance; blockVisibility?: BlockVisibility[] }>(
                                instance => {
                                    if (response?.blockVisibility) {
                                        return { instance, blockVisibility: response.blockVisibility };
                                    }

                                    return { instance };
                                }
                            ),
                        );
                }),
                catchError(err => {
                    this.logger.logError(this.LOG_SOURCE, 'An error during a new instance creation', err);
                    return throwError(err);
                }),
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(({ instance, blockVisibility }) => {
                this.childInstances.push(instance);

                if (blockVisibility) {
                    this.blockVisibilityChanged.emit(blockVisibility);
                } else {
                    /**
                     * Emitting a `blockVisibilityChanged` event will call `detectChanges`
                     * so we call this here only if there were no changes in block visibility
                     */
                    this.cdr.detectChanges();
                }

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
