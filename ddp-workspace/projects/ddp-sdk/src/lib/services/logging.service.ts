import { Injectable, Inject } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { LogLevel } from '../models/logLevel';
import { StackdriverErrorReporterService } from './stackdriverErrorReporter.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

type Logger = (message?: any, ...optionalParams: any[]) => void;

@Injectable()
export class LoggingService {
    private readonly LOG_SOURCE = 'Logging';
    // tslint:disable-next-line:no-console
    public logDebug: Logger = this.showEvent(LogLevel.Debug) ? console.debug.bind(window.console) : () => { };

    public logEvent: Logger = this.showEvent(LogLevel.Info) ? console.log.bind(window.console) : () => { };

    public logWarning: Logger = this.showEvent(LogLevel.Warning) ? console.warn.bind(window.console) : () => { };

    public logError: Logger = this.showEvent(LogLevel.Error) ?
        (...args) => {
            const stringifiedArgs = args.map(item => {
                return (typeof item === 'object') ? this.stringify(item) : item;
            });

            this.stackdriverErrorReporterService.handleError(stringifiedArgs.join(', '));
            console.error.apply(window.console, stringifiedArgs);
        }
      : () => { };

    constructor(
        @Inject('ddp.config') private config: ConfigurationService,
        private stackdriverErrorReporterService: StackdriverErrorReporterService,
        private http: HttpClient) {}

    private showEvent(level: LogLevel): boolean {
        return this.config.logLevel <= level;
    }

    private stringify(obj: object): string {
        return Object.keys(obj).map(key => `${key}: ${obj[key]}`).join(', ');
    }

    public logToCloud(payload: string, labels?: {[key: string]: string}): void {
        const url = `${this.config.cloudLoggingUrl}/LoggingService`;
        const body = {
            logName: `angular-${this.config.studyGuid}`,
            severity: 'INFO',
            textPayload: payload,
            labels
        };

        this.http.post(
            url,
            body,
            { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }).pipe(
            catchError((error: any) => {
                this.logError(this.LOG_SOURCE, `HTTP POST: ${url}. Error:`, error);
                return of(null);
            })
        ).subscribe();
    }
}
