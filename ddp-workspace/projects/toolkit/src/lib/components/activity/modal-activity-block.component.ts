import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ActivityForm, ActivityInstance, ActivityServiceAgent } from 'ddp-sdk';
import { DialogPosition, MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { of } from 'rxjs';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';

@Component({
  selector: 'modal-activity-block',
  styles: [
    `.modal-activity-block__card {
      padding: 18.5px 37px 18px 32.5px;
    }
    .modal-activity-block__card-content {
      display: flex;
      flex-flow: row;
      justify-content: space-between;
      align-items: center;
    }`,
    `.modal-activity-block__card-title, .modal-activity-block__card-subtitle {
      margin-bottom: 0;
      color: #1D1B25;
      letter-spacing: 0;
      line-height: 24px;
      font-size: 20px;
    }
    .modal-activity-block__card-subtitle {
      color: #4A4951;
      font-size: 16px;
    }`,

    `.modal-activity-block__card-buttons > button {
      margin-left: 8px;
      width: 42px;
      height: 42px;
    }`,

    `.modal-activity-block__success-message {
      font-size: 14px;
      color: #03B486;
    }
    .modal-activity-block__success-message mat-icon {
      vertical-align: bottom;
    }`,

    `.modal-activity-block__save_activity {
      font-size: 16px;
      line-height: 20px;
      width: 200px;
      height: 48px;
      padding: 14px 0;
      margin-top: 36px;
    }`,

    `.button_secondary {
      background-color: #9D9CA0;
    }
    .button_secondary:hover {
      background-color: #767578;
    }`,

    `::ng-deep .modal-activity-block__edit-dialog > mat-dialog-container {
      padding: 0;
    }
    ::ng-deep .modal-activity-block__edit-dialog > mat-dialog-container > * {
      box-sizing: border-box;
      padding: 0 40.5px 0 93.5px;
    }`,
    `.modal-activity-block__edit-dialog-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 30.5px;
      padding-bottom: 20px;
      margin: 0;
      color: #1D1B25;
      font-size: 24px;
      letter-spacing: 0;
      line-height: 24px;
      border-bottom: 2px solid #E2E2E2;
    }`,
    `.modal-activity-block__edit-dialog-content {
      padding-bottom: 40.5px;
      margin: 0;
    }`,
    `.modal-activity-block__close-button {
      position: relative;
      top: -5px;
    }`,
    `::ng-deep .modal-activity-block__delete-dialog > mat-dialog-container {
      padding: 27.5px 45.5px 20px 45.5px;
    }
    ::ng-deep .modal-activity-block__delete-dialog:after {
      content: " ";
      position: relative;
      height: 0;
      right: 50%;
      bottom: -100%;
      border-top: 10px solid white;
      border-right: 10px solid transparent;
      border-left: 10px solid transparent;
      border-bottom: none;
    }`,

    `.delete-dialog {
      display: flex;
      flex-flow: column;
    }
    .delete-dialog__title {
      color: #1D1B25;
      font-size: 18px;
      letter-spacing: 0;
      line-height: 24px;
      text-align: center;
      margin-bottom: 15px;
      white-space: pre-line;
    }
    .delete-dialog__buttons {
      display: inline-flex;
      align-self: center;
      gap: 16px;
    }
    .delete-dialog__buttons > button {
      height: 40px;
      width: 140px;
    }`
  ],
  template: `
    <mat-card class="modal-activity-block__card">
      <mat-card-content class="modal-activity-block__card-content">
        <div>
          <mat-card-title class="modal-activity-block__card-title">
            {{activityInstance?.activityName}}
          </mat-card-title>
          <mat-card-subtitle *ngIf="activityInstance?.activityDescription"
                             class="modal-activity-block__card-subtitle">
            {{activityInstance.activityDescription}}
          </mat-card-subtitle>

          <div *ngIf="activityInstance?.statusCode !== 'CREATED'"
               class="modal-activity-block__success-message">
            <mat-icon inline>check_circle</mat-icon>
            <span>{{activityInstance?.numQuestionsAnswered}} questions answered</span>
          </div>
        </div>

        <mat-card-actions class="modal-activity-block__card-buttons">
          <button mat-mini-fab
                  *ngIf="!activityInstance?.readonly"
                  class="button_primary"
                  (click)="openEditDialog()">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                 viewBox="0 0 32 32" width="32px" height="32px">
              <g stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" fill="none"
                 fill-rule="evenodd" transform="translate(6, 3)">
                <path
                  d="M18.9426829,1.54512195 C18.3553294,0.960271379 17.5586034,0.634405059 16.7297471,0.639944989 C15.9008907,0.645627485 15.1086496,0.982250836 14.5292683,1.575 L2.15121951,13.9530488 L0.640243902,19.847561 L6.5347561,18.3357317 L18.9128049,5.95768293 C19.5057143,5.37856338 19.8424647,4.58642216 19.8481478,3.75763414 C19.8536884,2.92884611 19.5276958,2.13221737 18.9426829,1.54512195 Z"></path>
                <line x1="14.1758537" y1="1.92926829" x2="18.5585366" y2="6.31195122"></line>
                <line x1="2.15207317" y1="13.9521951" x2="6.53902439" y2="18.3314634"></line>
              </g>
            </svg>
          </button>
          <button mat-mini-fab
                  *ngIf="activityInstance?.canDelete"
                  #delete_button
                  class="button_secondary"
                  (click)="openDeleteDialog()">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                 width="32px" height="32px" viewBox="0 0 32 32">
              <g stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" fill="none"
                 fill-rule="evenodd" transform="translate(6, 1)">
                <polygon
                  points="18.5862069 22.3793103 3.4137931 22.3793103 3.4137931 3.4137931 18.5862069 3.4137931"></polygon>
                <polygon
                  points="14.7931034 3.4137931 7.20689655 3.4137931 7.20689655 0.379310345 14.7931034 0.379310345"></polygon>
                <line x1="0.379310345" y1="3.4137931" x2="21.6206897" y2="3.4137931"></line>
                <line x1="7.20689655" y1="7.5862069" x2="7.20689655" y2="18.2068966"></line>
                <line x1="11" y1="7.5862069" x2="11" y2="18.2068966"></line>
                <line x1="14.7931034" y1="7.5862069" x2="14.7931034" y2="18.2068966"></line>
              </g>
            </svg>
          </button>
        </mat-card-actions>
      </mat-card-content>
    </mat-card>

    <ng-template #edit_dialog>
      <div mat-dialog-title class="modal-activity-block__edit-dialog-title">
        <div>{{activityInstance?.activityName}}</div>
        <button mat-icon-button mat-dialog-close class="modal-activity-block__close-button">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <mat-dialog-content class="modal-activity-block__edit-dialog-content">
        <ddp-activity-section [section]="activityForm?.sections[0]"
                              [readonly]="activityForm?.readonly"
                              [studyGuid]="config.studyGuid"
                              [activityGuid]="activityGuid"
        ></ddp-activity-section>

        <button mat-flat-button
                class="button_primary modal-activity-block__save_activity"
                (click)="closeEditDialog()">
          Save
        </button>
      </mat-dialog-content>
    </ng-template>

    <ng-template #delete_dialog>
      <div class="delete-dialog">
        <span class="delete-dialog__title">Are you sure you want to delete\n this information?</span>
        <div class="delete-dialog__buttons">
          <button mat-flat-button color="warn" (click)="deleteActivityInstance()">Delete</button>
          <button mat-stroked-button mat-dialog-close>Cancel</button>
        </div>
      </div>
    </ng-template>
  `
})
export class ModalActivityBlockComponent implements OnInit {
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
              @Inject('toolkit.toolkitConfig') public config: ToolkitConfigurationService,
              private dialog: MatDialog) {}

  public ngOnInit(): void {
    this.getActivityInstance();
  }

  public deleteActivityInstance(): void {
    this.activityServiceAgent.deleteActivityInstance(
      this.config.studyGuid,
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
      of(this.config.studyGuid),
      of(this.activityGuid)
    ).subscribe(activity => this.activityForm = activity);
  }

  private getActivityInstance(): void {
    this.activityServiceAgent.getActivitySummary(this.config.studyGuid, this.activityGuid)
      .subscribe(activityInstance => this.activityInstance = activityInstance);
  }
}
