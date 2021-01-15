import { Injectable, Inject, ErrorHandler } from '@angular/core';
import { ConfigurationService } from './configuration.service';

declare const StackdriverErrorReporter: any;

@Injectable({
  providedIn: 'root'
})
export class StackdriverErrorReporterService extends ErrorHandler {
  // TODO: update stackdriver-errors-js lib and add typings as soon as this PR merged and a new lib version released:
  // https://github.com/GoogleCloudPlatform/stackdriver-errors-js/pull/82
  private errorHandler: any;

  constructor(@Inject('ddp.config') private config: ConfigurationService) {
    super();
    this.errorHandler = new StackdriverErrorReporter();
    this.errorHandler.start({
      key: this.config.errorReportingApiKey,
      projectId: this.config.projectGcpId,
      service: this.config.studyGuid
    });
  }

  public handleError(error: Error | string): void {
    if (this.config.doGcpErrorReporting) {
      this.errorHandler.report(error);
    }
    // Pass the error to the original handleError otherwise it gets swallowed in the browser console
    super.handleError(error);
  }
}
