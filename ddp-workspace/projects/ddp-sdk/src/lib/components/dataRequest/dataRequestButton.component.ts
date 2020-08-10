import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { DataRequestModalComponent } from './dataRequestModal.component';
import { SessionMementoService } from '../../services/sessionMemento.service';

@Component({
  selector: 'ddp-data-request-button',
  template: `
    <button (click)="openDataRequest()"
            class="Button DataRequestButton--DataRequest"
            [attr.data-tooltip]="tooltip | translate"
            [disabled]="!isAuthenticated"
            [innerText]="'SDK.DataRequest.DataRequest' | translate">
    </button>`
})
export class DataRequestButtonComponent {
  public isAuthenticated: boolean;
  tooltip = 'SDK.DataRequest.SignInTooltip';

  constructor(public dialog: MatDialog,
              private session: SessionMementoService) {
    this.isAuthenticated = this.session.isAuthenticatedSession();
  }

  openDataRequest(): void {
    this.dialog.open(DataRequestModalComponent, {
      width: '740px',
      data: {},
      autoFocus: false,
      disableClose: true,
      scrollStrategy: new NoopScrollStrategy()
    });
  }
}
