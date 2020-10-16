import { Injectable, Inject } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { LogLevel } from '../models/logLevel';

@Injectable()
export class LoggingService {
    constructor(@Inject('ddp.config') private config: ConfigurationService) { }

    public logDebug = this.showEvent(LogLevel.Debug) ? console.debug.bind(window.console) : () => { };

    public logEvent = this.showEvent(LogLevel.Info) ? console.log.bind(window.console) : () => { };

    public logWarning = this.showEvent(LogLevel.Warning) ? console.warn.bind(window.console) : () => { };

    public logError = this.showEvent(LogLevel.Error) ? console.warn.bind(window.console) : () => { };

    private showEvent(level: LogLevel): boolean {
        return this.config.logLevel <= level;
    }
}
