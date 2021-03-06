import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    TemplateRef,
    ViewChild
} from '@angular/core';
import { DialogPosition, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';

import { of, Observable, EMPTY } from 'rxjs';
import { catchError, take } from 'rxjs/operators';

import { ActivityInstance } from '../../../../models/activityInstance';
import { ActivityForm } from '../../../../models/activity/activityForm';
import { ActivityServiceAgent } from '../../../../services/serviceAgents/activityServiceAgent.service';
import { LoggingService } from '../../../../services/logging.service';

const DEFAULT_DIALOG_SETTINGS = {
    hasBackdrop: true,
    autoFocus: false,
    scrollStrategy: new NoopScrollStrategy(),
};

const EDIT_DIALOG_CONFIG: MatDialogConfig = {
    ...DEFAULT_DIALOG_SETTINGS,
    width: `100vw`,
    maxWidth: `100vw`,
    position: {top: '10vh'},
    panelClass: 'modal-activity-block__edit-dialog',
};

@Component({
    selector: 'ddp-modal-activity-block',
    styleUrls: ['modalActivityBlock.component.scss'],
    templateUrl: 'modalActivityBlock.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalActivityBlockComponent {
    @Input() studyGuid: string;
    @Input() parentActivityInstanceGuid: string;
    @Input() instance: ActivityInstance;
    @Input() validationRequested: boolean;
    @Input() readonly: boolean;
    @Output() deleteActivity = new EventEmitter<string>();

    @ViewChild('edit_dialog') private editModalRef: TemplateRef<any>;
    @ViewChild('delete_dialog') private deleteModalRef: TemplateRef<any>;
    @ViewChild('delete_button', {read: ElementRef}) private deleteButtonRef: ElementRef;

    public activityForm: ActivityForm;
    private readonly isMobile = window.screen.width <= 768;
    private readonly LOG_SOURCE = 'ModalActivityBlockComponent';

    constructor(private readonly activityServiceAgent: ActivityServiceAgent,
                private dialog: MatDialog,
                private cdr: ChangeDetectorRef,
                private logger: LoggingService) {
    }

    public deleteActivityInstance(): void {
        this.activityServiceAgent.deleteActivityInstance(this.studyGuid, this.instance.instanceGuid).pipe(
            catchError(err => {
                this.logger.logError(this.LOG_SOURCE, 'An error during getting an activityInstance deleting', err);
                return EMPTY;
            }),
            take(1)
            )
            .subscribe(() => {
                this.deleteActivity.emit(this.instance.instanceGuid);
                this.dialog.closeAll();
            });
    }

    public openEditDialog(): void {
        this.getFullActivity$().pipe(
            catchError(err => {
                this.logger.logError(this.LOG_SOURCE, 'An error during getting a full activity', err);
                return EMPTY;
            }),
            take(1)
        ).subscribe((activity: ActivityForm) => {
            this.activityForm = activity;
            this.openDialog(this.editModalRef, this.getEditDialogConfig(), this.closeEditDialog.bind(this));
        });
    }

    public closeEditDialog(): void {
        this.getActivityInstance$().pipe(
            catchError(err => {
                this.logger.logError(this.LOG_SOURCE, 'An error during getting an activity instance', err);
                this.dialog.closeAll();
                return EMPTY;
            }),
            take(1)
        ).subscribe((activityInstance: ActivityInstance) => {
            this.instance = activityInstance;
            this.cdr.detectChanges();
            this.dialog.closeAll();
        });
    }

    public openDeleteDialog(): void {
        this.openDialog(this.deleteModalRef, this.getDeleteDialogConfig(), this.closeDeleteDialog.bind(this));
    }

    private closeDeleteDialog(): void {
        this.dialog.closeAll();
    }

    private getFullActivity$(): Observable<ActivityForm> {
        return this.activityServiceAgent.getActivity(of(this.studyGuid), of(this.instance.instanceGuid));
    }

    private getActivityInstance$(): Observable<ActivityInstance> {
        return this.activityServiceAgent.getActivitySummary(this.studyGuid, this.instance.instanceGuid);
    }

    private openDialog(templateRef: TemplateRef<any>, config: any, closeDialogCallback: (...args) => void): void {
        const dialogRef = this.dialog.open(templateRef, config);

        if (closeDialogCallback) {
            dialogRef.beforeClosed().pipe(
                take(1)
            ).subscribe(result => {
                closeDialogCallback(result);
            });
        }
    }

    private getEditDialogConfig(): MatDialogConfig {
        const widthForMobile = '70vw';
        const editDialogMobileConfig = {
            ...EDIT_DIALOG_CONFIG,
            width: widthForMobile,
            maxWidth: widthForMobile
        };

        return this.isMobile ? editDialogMobileConfig : EDIT_DIALOG_CONFIG;
    }

    private getDeleteDialogConfig(): MatDialogConfig {
        const dialogWidth = 396;
        const dialogArrowWidth = 20;
        const realDialogWidth = dialogWidth + dialogArrowWidth;
        const dialogHeight = 160;

        const config: MatDialogConfig = {
            ...DEFAULT_DIALOG_SETTINGS,
            panelClass: 'modal-activity-block__delete-dialog',
            height: `${dialogHeight}px`
        };

        if (!this.isMobile) {
            config.position = this.calculateDialogPosition(this.deleteButtonRef, dialogWidth, dialogHeight);
            config.width = `${realDialogWidth}px`;
        }

        return config;
    }

    private calculateDialogPosition(root: ElementRef, dialogWidth: number, dialogHeight: number): DialogPosition {
        const box: DOMRect = root.nativeElement.getBoundingClientRect();
        const xCenter = box.left + box.width / 2;
        const verticalGap = 15;
        return {
            top: `${box.top - dialogHeight - verticalGap}px`,
            left: `${xCenter - dialogWidth / 2}px`
        };
    }
}
