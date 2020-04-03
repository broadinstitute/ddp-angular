import { Component } from '@angular/core';
import { Auth0AdapterService } from 'ddp-sdk';

@Component({
  selector: 'app-session-expired',
  templateUrl: './session-expired.component.html',
  styleUrls: ['./session-expired.component.scss']
})
export class SessionExpiredComponent {
  constructor(private auth0: Auth0AdapterService) { }

  public signin(): void {
    this.auth0.login();
  }
}
