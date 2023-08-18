import { Injectable, Inject } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { LogLevel } from '../models/logLevel';
import { StackdriverErrorReporterService } from './stackdriverErrorReporter.service';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SessionMementoService } from './sessionMemento.service';

type Logger = (message?: any, ...optionalParams: any[]) => void;

@Injectable()
export class LoggingService {
    /* eslint-disable no-console */
    private readonly LOG_SOURCE = 'Logging';

    public logDebug: Logger = this.showEvent(LogLevel.Debug) ? console.debug.bind(window.console) : () => { };

    public logEvent: Logger = this.showEvent(LogLevel.Info) ? console.log.bind(window.console) : () => { };

    public logWarning: Logger = this.showEvent(LogLevel.Warning) ? console.warn.bind(window.console) : () => { };

    public logError: Logger = this.showEvent(LogLevel.Error) ?
        (...args) => {
            args.forEach(arg => { 
                console.error.apply(window.console, arg);
                this.stackdriverErrorReporterService.handleError(arg); 
            });
        }
      : () => { };

    constructor(
        @Inject('ddp.config') private config: ConfigurationService,
        private stackdriverErrorReporterService: StackdriverErrorReporterService,
        private http: HttpClient,
        private session: SessionMementoService) {}

    private showEvent(level: LogLevel): boolean {
        return this.config.logLevel <= level;
    }

    public logToCloud(payload: string, labels?: {[key: string]: string}, severity = 'INFO'): Observable<void> {
        if (!this.config.doCloudLogging || !this.config.cloudLoggingUrl) {
            return of(void 0);
        }
        const session =  this.session.session;
        const url = this.config.cloudLoggingUrl;
        const body = {
            logName: `angular-${this.config.studyGuid}`,
            severity,
            textPayload: payload,
            labels: { userGuid: session?.userGuid, isTemporarySession: String(this.session.isTemporarySession()), ...labels },
            httpRequest: { requestUrl: location.href, userAgent: navigator.userAgent }
        };
        
        if (this.session.isSessionExpired()) {
            this.logEvent(`${this.LOG_SOURCE}.logToCloud Session is expired`);
        }

        return this.http.post(
            url,
            body,
            { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }).pipe(
            catchError((error: any) => {
                this.logError(this.LOG_SOURCE, `HTTP POST: ${url}`, error);
                return of(null);
            }),
            map(() => void 0)
        );
    }
}
