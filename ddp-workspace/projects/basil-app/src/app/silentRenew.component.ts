import { Component, OnInit } from '@angular/core';
import { Auth0RenewService, Auth0AdapterService, LoggingService } from 'ddp-sdk';

@Component({
  selector: 'app-renew',
  template: `<button mat-button
  (click)="doRenew()">
    RENEW
</button>`
})
export class SilentRenewComponent implements OnInit {
  private readonly LOG_SOURCE = 'SilentRenewComponent';

  constructor(
    private logger: LoggingService,
    private auth0: Auth0RenewService,
    private auth0Service: Auth0AdapterService) { }

  public ngOnInit(): void {
    if (window.location.hash) {
      this.logger.logEvent(`${this.LOG_SOURCE}. Loading silent renew callback: %s`, window.location.hash);
      this.auth0.parseHash(window.location.hash);
    }
  }

  public doRenew(): void {
    this.auth0Service.auth0RenewToken().subscribe();
  }
}
