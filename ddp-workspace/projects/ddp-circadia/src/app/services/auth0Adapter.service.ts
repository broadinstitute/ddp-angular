import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
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

import { EnrollmentPausedService } from './enrollment-paused.service';

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
    private enrollmentPausedService: EnrollmentPausedService,
  ) {
    super(configuration, router, log, session, analytics, windowRef, renewNotifier, jwtHelper, language);
  }

  login(params?: Record<string, string>): void {
    return super.login(params);
  }
}

export { Auth0AdapterService as SDKAuth0AdapterService } from 'ddp-sdk';
