import { ConfigurationService } from './configuration.service';
import { LogEvent } from '../models/logEvent';
import { Injectable, Inject, OnDestroy, OnInit } from '@angular/core';
import { LogLevel } from '../models/logLevel';
import { DdpException } from '../models/exceptions/ddpException';
import { ExceptionDispatcher } from './exceptionHandling/exceptionDispatcher.service';
import { Observable, Subscription, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable()
export class LoggingService implements OnInit, OnDestroy {
    private subjectSource = new ReplaySubject<LogEvent>();
    private anchor: Subscription;

    constructor(
        @Inject("ddp.config") private config: ConfigurationService,
        private dispatcher: ExceptionDispatcher) {
    }

    public ngOnInit(): void {
        this.anchor = this.getSubscription().subscribe(x => {
            switch (x.level) {
                case LogLevel.Info: console.log(`${x.message}::${x.context}`); break;
                case LogLevel.Warning: console.warn(`${x.message}::${x.context}`); break;
                case LogLevel.Error: console.error(`${x.message}::${x.context}`); break;
            }
        });
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
            filter(x => x.level >= this.config.logLevel)
        );
    }

    private logMessage(level: LogLevel, source: string, event: any): void {
        if (this.config.logLevel <= level) {
            this.subjectSource.next(new LogEvent(level, source, JSON.stringify(event, null, 4)));
        }
    }
}
