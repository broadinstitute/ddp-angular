import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { EMPTY, of } from 'rxjs';
import { catchError, concatMap, filter, finalize, take, tap } from 'rxjs/operators';

import { ActivityInstance } from '../../../../models/activityInstance';
import { ActivityServiceAgent } from '../../../../services/serviceAgents/activityServiceAgent.service';
import { ActivityForm } from '../../../../models/activity/activityForm';
import { LoggingService } from '../../../../services/logging.service';
import { ActivitySection } from '../../../../models/activity/activitySection';
import { SubmitAnnouncementService } from '../../../../services/submitAnnouncement.service';
import { ActivityBlockModalService } from '../../../../services/activity-block-modal.service';
import { ActivityDeleteDialogComponent } from '../activityDeleteDialog/activityDeleteDialog.component';

@Component({
    selector: 'ddp-embedded-activity-block',
    templateUrl: './embeddedActivityBlock.component.html',
    styleUrls: ['./embeddedActivityBlock.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmbeddedActivityBlockComponent implements OnInit {
    @Input() instance: ActivityInstance;
    @Input() readonly: boolean;
    @Input() validationRequested: boolean;
    @Input() studyGuid: string;
    @Output() componentBusy = new EventEmitter<boolean>();
    @Output() validStatusChanged = new EventEmitter<boolean>();
    @Output() deletedActivity = new EventEmitter<string>();
    @ViewChild('delete_button', {read: ElementRef}) private deleteButtonRef: ElementRef;

    public activity: ActivityForm;
    private readonly LOG_SOURCE = 'EmbeddedActivityBlockComponent';

    constructor(private activityServiceAgent: ActivityServiceAgent,
                private changeDetector: ChangeDetectorRef,
                private submitAnnouncementService: SubmitAnnouncementService,
                private logger: LoggingService,
                private dialog: MatDialog,
                private modalService: ActivityBlockModalService) {
    }

    ngOnInit(): void {
        this.getActivity();
        this.flushFormOnSubmit();
    }

    public getSectionId(index: number, {name}: ActivitySection): string {
        return `${index}_${name}`;
    }

    public openDeleteDialog(): void {
        const config = this.modalService.getDeleteDialogConfig(this.deleteButtonRef);

        const dialogRef = this.dialog.open(ActivityDeleteDialogComponent, config);
        dialogRef.afterClosed().subscribe((confirmDelete: boolean) => {
            if (confirmDelete) {
                this.deleteInstance();
            }
        });
    }

    public deleteInstance(): void {
        this.componentBusy.emit(true);
        this.activityServiceAgent.deleteActivityInstance(this.studyGuid, this.instance.instanceGuid).pipe(
            catchError(err => {
                this.logger.logError(this.LOG_SOURCE, 'An error during deleting an activityInstance', err);
                return EMPTY;
            }),
            take(1),
            finalize(() => this.componentBusy.emit(false))
        ).subscribe(() => {
            this.deletedActivity.emit(this.instance.instanceGuid);
        });
    }

    private getActivity(): void {
        this.activityServiceAgent.getActivity(of(this.studyGuid), of(this.instance.instanceGuid))
            .pipe(
                catchError(err => {
                    this.logger.logError(this.LOG_SOURCE, 'An error during getting a full activity', err);
                    return EMPTY;
                }),
                take(1))
            .subscribe((activity: ActivityForm) => {
                this.activity = activity;
                this.changeDetector.detectChanges();
            });
    }

    private flushFormOnSubmit(): void {
        let activityValidStatus: boolean;

        this.submitAnnouncementService.submitAnnounced$.pipe(
            tap(() => this.componentBusy.emit(true)),
            tap(() => {
                activityValidStatus = this.activity.validate();
                this.validStatusChanged.emit(activityValidStatus);
                if (!activityValidStatus) {
                    this.componentBusy.emit(false);
                }
            }),
            filter(_ => activityValidStatus),
            concatMap(() => this.activityServiceAgent.flushForm(this.studyGuid, this.instance.instanceGuid)),
            catchError(err => {
                this.logger.logError(this.LOG_SOURCE, 'An error during completing an activity', err);
                return EMPTY;
            }),
            take(1)
        ).subscribe(() => this.componentBusy.emit(false));
    }
}
