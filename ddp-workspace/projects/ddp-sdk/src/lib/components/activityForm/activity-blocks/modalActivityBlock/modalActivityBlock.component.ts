import {
    ChangeDetectionStrategy,
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

import { of, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { ActivityInstance } from '../../../../models/activityInstance';
import { ActivityForm } from '../../../../models/activity/activityForm';
import { ActivityServiceAgent } from '../../../../services/serviceAgents/activityServiceAgent.service';

const DEFAULT_DIALOG_SETTINGS = {
    hasBackdrop: true,
    autoFocus: false,
    scrollStrategy: new NoopScrollStrategy(),
};

const EDIT_DIALOG_CONFIG: MatDialogConfig = {
    ...DEFAULT_DIALOG_SETTINGS,
    width: `862px`,
    position: {top: '65px'},
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
    @Input() activityGuid: string;
    @Input() instance: ActivityInstance;
    @Input() validationRequested: boolean;
    @Input() readonly: boolean;
    @Output() deleteActivity = new EventEmitter<string>();

    @ViewChild('edit_dialog') private editModalRef: TemplateRef<any>;
    @ViewChild('delete_dialog') private deleteModalRef: TemplateRef<any>;
    @ViewChild('delete_button', {read: ElementRef}) private deleteButtonRef: ElementRef;

    public activityForm: ActivityForm;

    constructor(private readonly activityServiceAgent: ActivityServiceAgent,
                private dialog: MatDialog) {
    }

    public deleteActivityInstance(): void {
        this.activityServiceAgent.deleteActivityInstance(
            this.studyGuid,
            this.instance.instanceGuid
            )
            .pipe(take(1))
            .subscribe(() => {
                this.deleteActivity.emit(this.instance.instanceGuid);
            });
    }

    public openEditDialog(): void {
        this.getFullActivity()
            .then((activity: ActivityForm) => {
                this.activityForm = activity;
                this.openDialog(this.editModalRef, EDIT_DIALOG_CONFIG, this.closeEditDialog.bind(this));
            })
            .catch((err) => {
                console.error('An error during getting a full activity', err);
            });
    }

    public closeEditDialog(): void {
        this.dialog.closeAll();
        this.getActivityInstance();
    }

    public openDeleteDialog(): void {
        this.openDialog(this.deleteModalRef, this.getDeleteDialogConfig(), this.closeEditDialog.bind(this));
    }

    private getFullActivity(): Promise<ActivityForm> {
        return new Promise((resolve, reject) => {
            this.getActivity$()
                .subscribe((activity: ActivityForm) => {
                    resolve(activity);
                }, (err) => {
                    reject(err);
                });
        });
    }

    private getActivity$(): Observable<ActivityForm> {
        return this.activityServiceAgent.getActivity(
            of(this.studyGuid),
            of(this.instance.instanceGuid)
            )
            .pipe(take(1));
    }


    private getActivityInstance(): void {
        this.activityServiceAgent.getActivitySummary(this.studyGuid, this.instance.instanceGuid)
            .pipe(take(1))
            .subscribe(activityInstance => {
                this.instance = activityInstance;
            });
    }

    private openDialog(templateRef: TemplateRef<any>, config: any, closeDialogCallback: (...args) => void): void {
        const dialogRef = this.dialog.open(templateRef, config);

        if (closeDialogCallback) {
            dialogRef.beforeClosed().subscribe(result => {
                closeDialogCallback(result);
            });
        }
    }

    private getDeleteDialogConfig(): MatDialogConfig {
        const dialogWidth = 396;
        const dialogArrowWidth = 20;
        const realDialogWidth = dialogWidth + dialogArrowWidth;
        const dialogHeight = 160;
        const position = this.calculateDialogPosition(this.deleteButtonRef, dialogWidth, dialogHeight);

        return {
            ...DEFAULT_DIALOG_SETTINGS,
            width: `${realDialogWidth}px`,
            height: `${dialogHeight}px`,
            position,
            panelClass: 'modal-activity-block__delete-dialog'
        };
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
