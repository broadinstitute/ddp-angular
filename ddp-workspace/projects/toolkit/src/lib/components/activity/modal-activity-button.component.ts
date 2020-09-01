import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { SessionMementoService } from 'ddp-sdk';
import { NewModalActivityComponent } from './new-modal-activity.component';

@Component({
  selector: 'toolkit-modal-activity-button',
  template: `
    <button (click)="openModal()"
            class="Button NewActivityButton"
            [disabled]="!isAuthenticated"
            [attr.data-tooltip]="disabledTooltip | translate"
            [innerText]="buttonText | translate">
    </button>`
})
export class ModalActivityButtonComponent {
  @Input() disabledTooltip: string;
  @Input() buttonText: string;

  // data for new activity instance
  @Input() activityGuid: string;
  @Input() nextButtonText: string;
  @Input() prevButtonText: string;
  @Input() submitButtonText: string;
  @Input() showFinalConfirmation: boolean;
  @Input() confirmationButtonText: string;

  public isAuthenticated: boolean;

  constructor(public dialog: MatDialog,
              private session: SessionMementoService) {
    this.isAuthenticated = this.session.isAuthenticatedSession();
  }

  openModal(): void {
    this.dialog.open(NewModalActivityComponent, {
      width: '740px',
      data: {
        activityGuid: this.activityGuid,
        activityDetails: {
          nextButtonText: this.nextButtonText,
          prevButtonText: this.prevButtonText,
          submitButtonText: this.submitButtonText,
          showFinalConfirmation: this.showFinalConfirmation,
          confirmationButtonText: this.confirmationButtonText
        }
      },
      autoFocus: false,
      disableClose: true,
      scrollStrategy: new NoopScrollStrategy()
    });
  }
}
