import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigurationService, LoggingService, SessionMementoService } from 'ddp-sdk';
import { StackdriverErrorReporterDsmService } from './stackdriver-error-reporter.service';

@Injectable({providedIn: 'root'})
export class LoggingDsmService extends LoggingService {
  constructor(
    @Inject('ddp.config') private _config: ConfigurationService,
    private _stackdriverErrorReporterDsmService: StackdriverErrorReporterDsmService,
    private _http: HttpClient,
    private _session: SessionMementoService
  ) {
    super(_config, _stackdriverErrorReporterDsmService, _http, _session);
  }
}
