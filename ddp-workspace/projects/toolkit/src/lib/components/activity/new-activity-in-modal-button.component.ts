import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { SessionMementoService } from 'ddp-sdk';
import { NewActivityInModalComponent } from './new-activity-in-modal.component';

@Component({
  selector: 'toolkit-new-activity-in-modal-button',
  template: `
    <button (click)="launchActivity()"
            class="Button NewActivityButton"
            [disabled]="!isAuthenticated"
            [attr.data-tooltip]="disabledTooltip | translate"
            [innerText]="text | translate">
    </button>`
})
export class NewActivityInModalButtonComponent {
  @Input() activityGuid: string;
  @Input() modalName: string;
  @Input() disabledTooltip: string;
  @Input() text: string;
  public isAuthenticated: boolean;

  constructor(public dialog: MatDialog,
              private session: SessionMementoService) {
    this.isAuthenticated = this.session.isAuthenticatedSession();
  }

  launchActivity(): void {
    this.dialog.open(NewActivityInModalComponent, {
      width: '740px',
      data: {activityGuid: this.activityGuid, createActivityInstance: true, modalName: this.modalName},
      autoFocus: false,
      disableClose: true,
      scrollStrategy: new NoopScrollStrategy()
    });
  }
}
