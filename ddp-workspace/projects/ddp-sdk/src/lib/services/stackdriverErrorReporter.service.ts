import { Injectable, Inject, ErrorHandler } from '@angular/core';
import { throwError } from 'rxjs';
import { ConfigurationService } from './configuration.service';
import { SessionMementoService } from './sessionMemento.service';
import StackdriverErrorReporter from 'stackdriver-errors-js';

@Injectable({
  providedIn: 'root'
})
export class StackdriverErrorReporterService extends ErrorHandler {
  protected errorHandler: StackdriverErrorReporter;

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
    super.handleError(error);
    if (this.config.doGcpErrorReporting) {
      try {
        this.errorHandler.report(error);
      } catch (err) {
        console.error.apply(window.console, err);
        throwError(() => err);
      }
    }
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
