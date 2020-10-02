import { Injectable, Inject, OnDestroy } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { LogEvent } from '../models/logEvent';
import { LogLevel } from '../models/logLevel';
import { DdpException } from '../models/exceptions/ddpException';
import { ExceptionDispatcher } from './exceptionHandling/exceptionDispatcher.service';
import { Observable, Subscription, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable()
export class LoggingService implements OnDestroy {
    private subjectSource = new ReplaySubject<LogEvent>();
    private anchor: Subscription;

    constructor(
        private dispatcher: ExceptionDispatcher,
        @Inject('ddp.config') private config: ConfigurationService) {
        this.initEventsListener();
    }

    public ngOnDestroy(): void {
        this.anchor.unsubscribe();
    }

    public logEvent(source: string, event: any): void {
        this.logMessage(LogLevel.Info, source, event);
    }

    public logError(source: string, event: any): void {
        this.logMessage(LogLevel.Error, source, event);
    }

    public logException(source: string, exception: DdpException): void {
        this.dispatcher.consume(exception);
        this.logError(source, exception);
    }

    public logWarning(source: string, event: any): void {
        this.logMessage(LogLevel.Warning, source, event);
    }

    public getSubscription(): Observable<LogEvent> {
        return this.subjectSource.asObservable().pipe(
            filter(event => event.level >= this.config.logLevel)
        );
    }

    private initEventsListener(): void {
        this.anchor = this.getSubscription().subscribe(event => {
            switch (event.level) {
                case LogLevel.Info: console.log(`${event.message}::${event.context}`); break;
                case LogLevel.Warning: console.warn(`${event.message}::${event.context}`); break;
                case LogLevel.Error: console.error(`${event.message}::${event.context}`); break;
            }
        });
    }

    private logMessage(level: LogLevel, source: string, event: any): void {
        if (this.config.logLevel <= level) {
            this.subjectSource.next(new LogEvent(level, source, JSON.stringify(event, null, 4)));
        }
    }
}
