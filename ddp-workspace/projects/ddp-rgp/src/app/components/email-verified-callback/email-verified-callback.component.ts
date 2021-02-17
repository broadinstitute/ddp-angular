import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  Auth0AdapterService,
  LoggingService,
  SessionMementoService,
} from 'ddp-sdk';

import { Routes } from '../../routes';

@Component({
  selector: 'app-email-verified-callback',
  templateUrl: './email-verified-callback.component.html',
  styleUrls: ['./email-verified-callback.component.scss'],
})
export class EmailVerifiedCallbackComponent implements OnInit {
  private readonly SUCCESS_CODE = 'success';
  private readonly LOG_SOURCE = 'EmailVerifiedCallbackComponent';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loggingService: LoggingService,
    private sessionService: SessionMementoService,
    private auth0AdapterService: Auth0AdapterService,
  ) {}

  ngOnInit(): void {
    const queryParams = this.route.snapshot.queryParams;

    if (queryParams.code && queryParams.code === this.SUCCESS_CODE) {
      this.loggingService.logEvent(
        this.LOG_SOURCE,
        'Email successfully verified',
      );

      this.redirectToLogin();
    } else {
      this.loggingService.logError(
        this.LOG_SOURCE,
        'Email verification failed',
      );

      this.redirectToError();
    }
  }

  private redirectToLogin(): void {
    const additionalParams = {};

    if (this.sessionService.isTemporarySession()) {
      additionalParams['temp_user_guid'] = this.sessionService.session.userGuid;
    }

    this.auth0AdapterService.login(additionalParams);
  }

  private redirectToError(): void {
    this.router.navigateByUrl(Routes.Error);
  }
}
