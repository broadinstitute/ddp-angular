import { Injectable, Inject } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { LogLevel } from '../models/logLevel';
import { StackdriverErrorReporterService } from './stackdriverErrorReporter.service';

@Injectable()
export class LoggingService {
    // tslint:disable-next-line:no-console
    public logDebug = this.showEvent(LogLevel.Debug) ? console.debug.bind(window.console) : () => { };

    public logEvent = this.showEvent(LogLevel.Info) ? console.log.bind(window.console) : () => { };

    public logWarning = this.showEvent(LogLevel.Warning) ? console.warn.bind(window.console) : () => { };

    public logError = this.showEvent(LogLevel.Error) ?
        (...args) => {
            this.stackdriverErrorReporterService.handleError(args.join(' '));
            console.error.apply(window.console, args);
        }
      : () => { };

    constructor(
        @Inject('ddp.config') private config: ConfigurationService,
        private stackdriverErrorReporterService: StackdriverErrorReporterService) {}

    private showEvent(level: LogLevel): boolean {
        return this.config.logLevel <= level;
    }
}
