import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { ActivityInstance } from '../../../models/activityInstance';
import { ActivityForm } from '../../../models/activity/activityForm';
import { ActivityServiceAgent } from '../../../services/serviceAgents/activityServiceAgent.service';
import { DialogPosition, MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';
import { ActivityActivityBlock } from '../../../models/activity/activityActivityBlock';
import { MatDialogConfig } from '@angular/material/dialog/dialog-config';

@Component({
  selector: 'ddp-modal-activity-block',
  styleUrls: ['modalActivityBlock.component.scss'],
  templateUrl: 'modalActivityBlock.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalActivityBlockComponent {
  @Input() studyGuid: string;
  @Input() activityGuid: string;
  @Input() block: ActivityActivityBlock;
  @Input() validationRequested: boolean;
  @Input() readonly: boolean;
  @Output() deleteActivity = new EventEmitter<void>();

  @ViewChild('edit_dialog') private editModalRef: TemplateRef<any>;
  @ViewChild('delete_dialog') private deleteModalRef: TemplateRef<any>;
  @ViewChild('delete_button', {read: ElementRef}) private deleteButtonRef: ElementRef;

  public currentActivityInstance: ActivityInstance;
  public activityForm: ActivityForm;

  private readonly DEFAULT_DIALOG_SETTINGS = {
    hasBackdrop: true,
    autoFocus: false,
    scrollStrategy: new NoopScrollStrategy(),
  };
  private readonly isMobile = window.screen.width <= 768;

  constructor(private readonly activityServiceAgent: ActivityServiceAgent,
              private dialog: MatDialog) {}

  public deleteActivityInstance(): void {
    this.activityServiceAgent.deleteActivityInstance(
      this.studyGuid,
      this.currentActivityInstance.instanceGuid
    )
      .pipe(take(1))
      .subscribe(() => this.deleteActivity.emit());
  }

  public openEditDialog(instance: ActivityInstance): void {
    this.currentActivityInstance = instance;
    this.getFullActivity();

    const width = this.isMobile ? '100vw' : '70vw';
    this.dialog.open(
      this.editModalRef, {
      ...this.DEFAULT_DIALOG_SETTINGS,
      width,
      maxWidth: width,
      position: { top: '10vh' },
      panelClass: 'modal-activity-block__edit-dialog',
    }).afterClosed()
      .pipe(take(1))
      .subscribe(() => this.getActivityInstance());
  }

  public openDeleteDialog(instance: ActivityInstance): void {
    this.currentActivityInstance = instance;

    const dialogWidth = 396;
    const realDialogWidth = dialogWidth + 20; // because of the arrow
    const dialogHeight = 160;
    const config: MatDialogConfig = {
      ...this.DEFAULT_DIALOG_SETTINGS,
      panelClass: 'modal-activity-block__delete-dialog',
      height: `${dialogHeight}px`
    };

    if (!this.isMobile) {
      config.position = this.calculateDialogPosition(this.deleteButtonRef, dialogWidth, dialogHeight);
      config.width = `${realDialogWidth}px`;
    }

    this.dialog.open(this.deleteModalRef, config);
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
      of(this.currentActivityInstance.instanceGuid)
    )
      .pipe(take(1))
      .subscribe(activity => this.activityForm = activity);
  }

  private getActivityInstance(): void {
    this.activityServiceAgent.getActivitySummary(this.studyGuid, this.currentActivityInstance.instanceGuid)
      .pipe(take(1))
      .subscribe(activityInstance => {
        // todo simplify it
        const index = this.block.instances.findIndex(item => item.instanceGuid === activityInstance.instanceGuid);
        this.block.instances[index] = {...activityInstance};
      });
  }
}
