import { Injectable, Inject } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { LogLevel } from '../models/logLevel';
import { StackdriverErrorReporterService } from './stackdriverErrorReporter.service';
import { catchError, map, take } from 'rxjs/operators';
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
            const stringifiedArgs = args.map((arg) => {
                let str = (typeof arg === 'object') ? this.stringify(arg) : arg;
                return str += arg instanceof Error ? `, ${arg.stack}` : '';
            });
            this.logToCloud(stringifiedArgs.join(',\n'), null, 'ERROR').pipe(take(1)).subscribe();
            console.error.apply(window.console, stringifiedArgs);
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

    private stringify(obj: object): string {
        return Object.keys(obj).map(key => {
            const value = obj[key];
            return (typeof value === 'object') ? `${key}: ${JSON.stringify(value)}` : `${key}: ${value}`;
        }).join(', ');
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

        return this.http.post(
            url,
            body,
            { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }).pipe(
            catchError((error: any) => {
                const message = JSON.stringify(body);
                if (body.severity === 'ERROR') {
                    this.stackdriverErrorReporterService.handleError(message);
                }
                this.logWarning(error);
                this.logWarning(message);
                return of(null);
            }),
            map(() => void 0)
        );
    }
}
