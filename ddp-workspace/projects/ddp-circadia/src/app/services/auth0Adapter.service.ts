import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { JwtHelperService } from '@auth0/angular-jwt';

import {
  AnalyticsEventsService,
  Auth0AdapterService as SDKAuth0AdapterService,
  ConfigurationService,
  LanguageService,
  LoggingService,
  RenewSessionNotifier,
  SessionMementoService,
  WindowRef,
} from 'ddp-sdk';

import { EnrollmentPausedModalComponent } from '../components/enrollment-paused-modal/enrollment-paused-modal.component';

declare const DDP_ENV: Record<string, any>;

@Injectable()
export class AppAuth0AdapterService extends SDKAuth0AdapterService {
  constructor(
    @Inject('ddp.config') configuration: ConfigurationService,
    router: Router,
    log: LoggingService,
    session: SessionMementoService,
    analytics: AnalyticsEventsService,
    windowRef: WindowRef,
    renewNotifier: RenewSessionNotifier,
    jwtHelper: JwtHelperService,
    language: LanguageService,
    private dialog: MatDialog,
  ) {
    super(configuration, router, log, session, analytics, windowRef, renewNotifier, jwtHelper, language);
  }

  login(params?: Record<string, string>): void {
    const { enrollmentPaused } = DDP_ENV;

    if (enrollmentPaused) {
      return this.openEnrollmentPausedModal();
    }

    return super.login(params);
  }

  openEnrollmentPausedModal(): void {
    this.dialog.open(EnrollmentPausedModalComponent, {
      width: '100%',
      maxWidth: '640px',
      disableClose: true,
      autoFocus: false,
    });
  }
}

export { Auth0AdapterService as SDKAuth0AdapterService } from 'ddp-sdk';
