import { Injectable, Inject, ErrorHandler } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { SessionMementoService } from './sessionMemento.service';

declare const StackdriverErrorReporter: any;

@Injectable({
  providedIn: 'root'
})
export class StackdriverErrorReporterService extends ErrorHandler {
  // TODO: update stackdriver-errors-js lib and add typings as soon as this PR merged and a new lib version released:
  // https://github.com/GoogleCloudPlatform/stackdriver-errors-js/pull/82
  protected errorHandler: any;

  constructor(
    @Inject('ddp.config') private config: ConfigurationService,
    private sessionService: SessionMementoService
  ) {
    super();

    const key = this.config.errorReportingApiKey;
    const projectId = this.config.projectGcpId;

    this.errorHandler = new StackdriverErrorReporter();
    this.errorHandler.start({
      key,
      projectId,
      service: this.config.studyGuid
    });

    this.checkReportingParams(key, projectId);
    this.errorHandler.setUser(this.getUserInfo());
  }

  public handleError(error: Error | string): void {
    if (this.config.doGcpErrorReporting) {
      this.errorHandler.report(error);
    }
    // Pass the error to the original handleError otherwise it gets swallowed in the browser console
    super.handleError(error);
  }

  private checkReportingParams(key: string, projectId: string): void {
    const missingParams = [];

    if (!key) {
      missingParams.push('errorReportingApiKey');
    } else if (!projectId) {
      missingParams.push('projectGcpId');
    }

    if (missingParams.length) {
      console.error('Missing parameters for StackDriver: ' + missingParams.join(', '));
    }
  }

  protected getUserInfo(): string {
    return this.sessionService.session ? this.sessionService.session.userGuid : 'unknown';
  }
}
