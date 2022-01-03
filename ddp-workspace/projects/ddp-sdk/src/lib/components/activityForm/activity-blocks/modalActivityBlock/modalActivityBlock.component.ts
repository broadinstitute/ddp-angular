import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    Output,
    TemplateRef,
    ViewChild
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { of, Observable, EMPTY } from 'rxjs';
import { catchError, finalize, take } from 'rxjs/operators';

import { ActivityInstance } from '../../../../models/activityInstance';
import { ActivityForm } from '../../../../models/activity/activityForm';
import { ActivityServiceAgent } from '../../../../services/serviceAgents/activityServiceAgent.service';
import { LoggingService } from '../../../../services/logging.service';
import { ConfirmDialogComponent } from '../../../confirmDialog/confirmDialog.component';
import { ModalDialogService, DEFAULT_DIALOG_SETTINGS } from '../../../../services/modal-dialog.service';
import { BlockVisibility } from '../../../../models/activity/blockVisibility';
import { ConfigurationService } from '../../../../services/configuration.service';

const EDIT_DIALOG_CONFIG: MatDialogConfig = {
    ...DEFAULT_DIALOG_SETTINGS,
    width: `70vw`,
    maxWidth: `1000px`,
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
    @Input() instance: ActivityInstance;
    @Input() validationRequested: boolean;
    @Input() readonly: boolean;
    @Input() enabled: boolean;
    @Output() componentBusy = new EventEmitter<boolean>(true);
    @Output() deletedActivity = new EventEmitter<string>();
    @Output() blockVisibilityChanged = new EventEmitter<BlockVisibility[]>();

    @ViewChild('edit_dialog') private editModalRef: TemplateRef<any>;
    @ViewChild('delete_button', {read: ElementRef}) private deleteButtonRef: ElementRef;

    public activityForm: ActivityForm;
    private readonly isMobile = window.screen.width <= 768;
    private readonly LOG_SOURCE = 'ModalActivityBlockComponent';

    constructor(private readonly activityServiceAgent: ActivityServiceAgent,
                private dialog: MatDialog,
                private cdr: ChangeDetectorRef,
                private logger: LoggingService,
                private modalDialogService: ModalDialogService,
                @Inject('ddp.config') private config: ConfigurationService) {
    }

    get isAllQuestionsCompleted(): boolean {
        return this.instance.numQuestionsAnswered === this.instance.numQuestions;
    }

    get alwaysShowQuestionsCount(): boolean {
        return this.config.alwaysShowQuestionsCountInModalNestedActivity;
    }

    public deleteActivityInstance(): void {
        this.componentBusy.emit(true);
        this.activityServiceAgent.deleteActivityInstance(this.studyGuid, this.instance.instanceGuid).pipe(
            catchError(err => {
                this.logger.logError(this.LOG_SOURCE, 'An error during deleting an activityInstance', err);
                return EMPTY;
            }),
            take(1),
            finalize(() => this.componentBusy.emit(false))
        ).subscribe(res => {
            if (res?.blockVisibility) {
                this.blockVisibilityChanged.emit(res.blockVisibility);
            }

            this.deletedActivity.emit(this.instance.instanceGuid);
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
            this.openModalDialog(this.editModalRef, this.getEditDialogConfig(), this.closeEditDialog.bind(this));
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
            this.mutateWithNewPropertiesValues(this.instance, activityInstance);
            this.cdr.detectChanges();
            this.dialog.closeAll();
        });
    }

    public openDeleteDialog(): void {
        const panelClass = 'modal-activity-block__delete-dialog';
        const config = this.modalDialogService.getDialogConfig(this.deleteButtonRef, panelClass);
        config.data = {
            title: 'SDK.ConfirmDeletion',
            confirmBtnText: 'SDK.DeleteButton',
            cancelBtnText: 'SDK.CancelBtn',
            confirmBtnColor: 'warn'
        };

        const dialogRef = this.dialog.open(ConfirmDialogComponent, config);
        dialogRef.afterClosed().subscribe((confirmDelete: boolean) => {
            if (confirmDelete) {
                this.deleteActivityInstance();
            }
        });
    }

    private getFullActivity$(): Observable<ActivityForm> {
        return this.activityServiceAgent.getActivity(of(this.studyGuid), of(this.instance.instanceGuid));
    }

    private getActivityInstance$(): Observable<ActivityInstance> {
        return this.activityServiceAgent.getActivitySummary(this.studyGuid, this.instance.instanceGuid);
    }

    private openModalDialog(templateRef: TemplateRef<any>, config: any, closeDialogCallback: (...args) => void): void {
        const dialogRef = this.dialog.open(templateRef, config);

        if (closeDialogCallback) {
            dialogRef.beforeClosed().subscribe(result => {
                closeDialogCallback(result);
            });
        }
    }

    private getEditDialogConfig(): MatDialogConfig {
        const editDialogMobileConfig = {
            ...EDIT_DIALOG_CONFIG,
            maxWidth: '70vw'
        };

        return this.isMobile ? editDialogMobileConfig : EDIT_DIALOG_CONFIG;
    }

    private mutateWithNewPropertiesValues(target: ActivityInstance, source: ActivityInstance): void {
        // mutate the target instance (copy all properties from source to target)
        Object.assign(target, source);
    }
}
