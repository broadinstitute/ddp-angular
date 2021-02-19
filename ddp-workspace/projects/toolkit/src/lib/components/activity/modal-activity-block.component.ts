import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { ActivityInstance, ActivityServiceAgent } from 'ddp-sdk';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'modal-activity-block',
  styles: [
    `mat-card {
      padding: 18.5px 37px 18px 32.5px;
    }`,
    `mat-card-subtitle {
      margin-bottom: 0;
    }`,
    `button {
      margin-left: 8px;
    }`,
    `.success-message {
      font-size: 14px;
      color: #03B486;
    }`
  ],
  template: `
    <mat-card class="content content-tight">
      <mat-card-content style="display: flex; justify-content: space-between;">
        <div>
          <mat-card-title>{{activityInstance?.activityName}}</mat-card-title>
          <mat-card-subtitle *ngIf="activityInstance?.activityDescription">
            {{activityInstance.activityDescription}}
          </mat-card-subtitle>

          <div *ngIf="activityInstance?.statusCode !== 'CREATED'"
               class="success-message">
            <mat-icon inline>check_circle</mat-icon>
            <span>{{activityInstance?.numQuestionsAnswered}} questions answered</span>
          </div>
        </div>


        <mat-card-actions>
          <button mat-mini-fab>
            <mat-icon>edit_outline</mat-icon>
          </button>
          <button mat-mini-fab
                  *ngIf="activityInstance.canDelete">
            <mat-icon>delete_outlined</mat-icon>
          </button>
        </mat-card-actions>
      </mat-card-content>
    </mat-card>
  `
})
export class ModalActivityBlockComponent implements OnInit {
  @Input() activityGuid: string;
  @Input() activityInstance: ActivityInstance;
  @Output() deleteActivityInstance = new EventEmitter<void>();

  constructor(private activityServiceAgent: ActivityServiceAgent,
              @Inject('toolkit.toolkitConfig') public config: ToolkitConfigurationService,
              private dialog: MatDialog) {}

  public ngOnInit(): void {
  }
}
