import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ActivityForm, ActivityInstance, ActivityServiceAgent } from 'ddp-sdk';
import { DialogPosition, MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { of } from 'rxjs';

@Component({
  selector: 'ddp-modal-activity-block',
  styleUrls: ['modal-activity-block.component.scss'],
  templateUrl: 'modal-activity-block.component.html'
})
export class ModalActivityBlockComponent implements OnInit {
  @Input() studyGuid: string;
  @Input() activityGuid: string;
  @Output() deleteActivity = new EventEmitter<void>();

  @ViewChild('edit_dialog') private editModalRef: TemplateRef<any>;
  @ViewChild('delete_dialog') private deleteModalRef: TemplateRef<any>;
  @ViewChild('delete_button', {read: ElementRef}) private deleteButtonRef: ElementRef;

  public activityInstance: ActivityInstance;
  public activityForm: ActivityForm;

  private readonly DEFAULT_DIALOG_SETTINGS = {
    hasBackdrop: true,
    autoFocus: false,
    scrollStrategy: new NoopScrollStrategy(),
  };

  constructor(private readonly activityServiceAgent: ActivityServiceAgent,
              private dialog: MatDialog) {}

  public ngOnInit(): void {
    this.getActivityInstance();
  }

  public deleteActivityInstance(): void {
    this.activityServiceAgent.deleteActivityInstance(
      this.studyGuid,
      this.activityGuid
    ).subscribe(() => this.deleteActivity.emit());
  }

  public openEditDialog(): void {
    this.getFullActivity();
    this.dialog.open(this.editModalRef, {
      ...this.DEFAULT_DIALOG_SETTINGS,
      width: `862px`,
      position: { top: '65px' },
      panelClass: 'modal-activity-block__edit-dialog',
    });
  }

  public closeEditDialog(): void {
    this.dialog.closeAll();
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
      of(this.activityGuid)
    ).subscribe(activity => this.activityForm = activity);
  }

  private getActivityInstance(): void {
    this.activityServiceAgent.getActivitySummary(this.studyGuid, this.activityGuid)
      .subscribe(activityInstance => this.activityInstance = activityInstance);
  }
}
