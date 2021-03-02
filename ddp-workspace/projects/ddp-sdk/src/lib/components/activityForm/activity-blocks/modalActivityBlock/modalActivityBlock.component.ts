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
import { DialogPosition, MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';

import { of } from 'rxjs';
import { take } from 'rxjs/operators';

import { ActivityInstance } from '../../../../models/activityInstance';
import { ActivityForm } from '../../../../models/activity/activityForm';
import { ActivityServiceAgent } from '../../../../services/serviceAgents/activityServiceAgent.service';

@Component({
    selector: 'ddp-modal-activity-block',
    styleUrls: ['modalActivityBlock.component.scss'],
    templateUrl: 'modalActivityBlock.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalActivityBlockComponent {
    @Input() studyGuid: string;
    // TODO: Check whether activityGuid and instance.instanceGuid are the same ? What should we use for `getActivitySummary` method
    @Input() activityGuid: string;
    @Input() instance: ActivityInstance;
    @Input() validationRequested: boolean;
    @Input() readonly: boolean;
    @Output() deleteActivity = new EventEmitter<void>();

    @ViewChild('edit_dialog') private editModalRef: TemplateRef<any>;
    @ViewChild('delete_dialog') private deleteModalRef: TemplateRef<any>;
    @ViewChild('delete_button', {read: ElementRef}) private deleteButtonRef: ElementRef;

    public activityForm: ActivityForm;

    private readonly DEFAULT_DIALOG_SETTINGS = {
        hasBackdrop: true,
        autoFocus: false,
        scrollStrategy: new NoopScrollStrategy(),
    };

    constructor(private readonly activityServiceAgent: ActivityServiceAgent,
                private dialog: MatDialog) {
    }

    public deleteActivityInstance(): void {
        this.activityServiceAgent.deleteActivityInstance(
            this.studyGuid,
            this.instance.instanceGuid
            )
            .pipe(take(1))
            .subscribe(() => this.deleteActivity.emit());
    }

    public openEditDialog(): void {
        this.getFullActivity();
        // TODO: check if we need a loader during getting the activity data
        this.dialog.open(this.editModalRef, {
            ...this.DEFAULT_DIALOG_SETTINGS,
            width: `862px`,
            position: {top: '65px'},
            panelClass: 'modal-activity-block__edit-dialog',
        });
    }

    public closeEditDialog(): void {
        this.dialog.closeAll();
        // TODO: check if we need a loader during getting the instance data
        this.getActivityInstance();
    }

    public openDeleteDialog(): void {
        const dialogWidth = 396;
        const realDialogWidth = dialogWidth + 20; // because of the arrow
        const dialogHeight = 160;
        const position = this.calculateDialogPosition(this.deleteButtonRef, dialogWidth, dialogHeight);

        this.dialog.open(this.deleteModalRef, {
            ...this.DEFAULT_DIALOG_SETTINGS,
            width: `${realDialogWidth}px`,
            height: `${dialogHeight}px`,
            position,
            panelClass: 'modal-activity-block__delete-dialog'
        });
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

    private getFullActivity(): void {
        this.activityServiceAgent.getActivity(
            of(this.studyGuid),
            of(this.instance.instanceGuid)
            )
            .pipe(take(1))
            .subscribe(activity => {
                this.activityForm = activity;
            });
    }

    private getActivityInstance(): void {
        this.activityServiceAgent.getActivitySummary(this.studyGuid, this.activityGuid)
            .pipe(take(1))
            .subscribe(activityInstance => {
                this.instance = activityInstance;
            });
    }
}
