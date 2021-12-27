import { Component } from '@angular/core';

import { SessionMementoService } from 'ddp-sdk';

import { Route } from '../../constants/route';
import { SDKAuth0AdapterService, AppAuth0AdapterService } from '../../services/auth0Adapter.service';
import { EnrollmentPausedService } from '../../services/enrollment-paused.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  providers: [
    {
      provide: SDKAuth0AdapterService,
      useClass: AppAuth0AdapterService,
    },
  ],
})
export class FooterComponent {
  Route = Route;
  isEnrollmentPaused = this.enrollmentPausedService.isEnrollmentPaused;

  constructor(
    private sessionService: SessionMementoService,
    private enrollmentPausedService: EnrollmentPausedService,
  ) {}

  get isAuthenticated(): boolean {
    return this.sessionService.isAuthenticatedSession();
  }

  onSignUpClick(): void {
    this.enrollmentPausedService.openDialog();
  }
}
