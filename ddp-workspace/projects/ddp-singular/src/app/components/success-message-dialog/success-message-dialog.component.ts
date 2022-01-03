import { Component } from '@angular/core';
import { Auth0AdapterService } from 'ddp-sdk';


@Component({
  selector: 'app-success-message-dialog',
  templateUrl: './success-message-dialog.component.html',
  styleUrls: ['./success-message-dialog.component.scss']
})
export class SuccessMessageDialogComponent {
  constructor(
    private readonly auth0: Auth0AdapterService
  ) {}

  login(): void {
    this.auth0.login();
  }
}
