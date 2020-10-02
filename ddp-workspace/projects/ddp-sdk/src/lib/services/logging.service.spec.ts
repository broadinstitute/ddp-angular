import { TestBed } from '@angular/core/testing';
import { LogEvent } from './../models/logEvent';
import { ConfigurationService } from './configuration.service';
import { LoggingService } from './logging.service';
import { ExceptionDispatcher } from './exceptionHandling/exceptionDispatcher.service';
import { LogLevel } from '../models/logLevel';
import { DdpException } from './../models/exceptions/ddpException';
import { take } from 'rxjs/operators';

describe('LoggingService', () => {
    let service: LoggingService;
    const config = new ConfigurationService();
    const exceptionDispatcherServiceSpy: jasmine.SpyObj<ExceptionDispatcher> = jasmine.createSpyObj('ExceptionDispatcher', ['consume']);

    const SOURCE = 'LoggingService Test';
    const SIMPLE_EVENT = 'Simple Event';
    const WARNING_EVENT = 'Warning Event';
    const ERROR_EVENT = 'Error Event';

    const createMessage = (message: string, context: any) => `${message}::${stringify(context)}`;
    const stringify = (context: any) => JSON.stringify(context, null, 4);

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                LoggingService,
                ExceptionDispatcher,
                { provide: 'ddp.config', useValue: config }
            ]
        });
    });

    it('should create service', () => {
        const config = new ConfigurationService();
        service = new LoggingService(exceptionDispatcherServiceSpy, config);
        expect(service).toBeTruthy();
    });

    it('should log all types of events', () => {
        const config = new ConfigurationService();
        config.logLevel = LogLevel.Info;
        service = new LoggingService(exceptionDispatcherServiceSpy, config);

        console.log = jasmine.createSpy('log');
        service.logEvent(SOURCE, SIMPLE_EVENT);
        expect(console.log).toHaveBeenCalledWith(createMessage(SOURCE, SIMPLE_EVENT));

        console.warn = jasmine.createSpy('warn');
        service.logWarning(SOURCE, WARNING_EVENT);
        expect(console.warn).toHaveBeenCalledWith(createMessage(SOURCE, WARNING_EVENT));

        console.error = jasmine.createSpy('error');
        service.logError(SOURCE, ERROR_EVENT);
        expect(console.error).toHaveBeenCalledWith(createMessage(SOURCE, ERROR_EVENT));
    });

    it('should log only Warning and Error events', () => {
        const config = new ConfigurationService();
        config.logLevel = LogLevel.Warning;
        service = new LoggingService(exceptionDispatcherServiceSpy, config);

        console.log = jasmine.createSpy('log');
        service.logEvent(SOURCE, SIMPLE_EVENT);
        expect(console.log).not.toHaveBeenCalled();

        console.warn = jasmine.createSpy('warn');
        service.logWarning(SOURCE, WARNING_EVENT);
        expect(console.warn).toHaveBeenCalledWith(createMessage(SOURCE, WARNING_EVENT));

        console.error = jasmine.createSpy('error');
        service.logError(SOURCE, ERROR_EVENT);
        expect(console.error).toHaveBeenCalledWith(createMessage(SOURCE, ERROR_EVENT));
    });

    it('should log only Error events', () => {
        const config = new ConfigurationService();
        config.logLevel = LogLevel.Error;
        service = new LoggingService(exceptionDispatcherServiceSpy, config);

        console.log = jasmine.createSpy('log');
        service.logEvent(SOURCE, SIMPLE_EVENT);
        expect(console.log).not.toHaveBeenCalled();

        console.warn = jasmine.createSpy('warn');
        service.logWarning(SOURCE, WARNING_EVENT);
        expect(console.warn).not.toHaveBeenCalled();

        console.error = jasmine.createSpy('error');
        service.logError(SOURCE, ERROR_EVENT);
        expect(console.error).toHaveBeenCalledWith(createMessage(SOURCE, ERROR_EVENT));
    });

    it('should handle exceptions', () => {
        const config = new ConfigurationService();
        config.logLevel = LogLevel.Info;
        service = new LoggingService(exceptionDispatcherServiceSpy, config);

        console.error = jasmine.createSpy('error');
        const exception = new DdpException('exception');
        service.logException(SOURCE, exception);
        expect(console.error).toHaveBeenCalledWith(createMessage(SOURCE, exception));
        expect(exceptionDispatcherServiceSpy.consume).toHaveBeenCalledWith(exception);
    });

    it('should allow external entities to receive logging events', () => {
        const config = new ConfigurationService();
        config.logLevel = LogLevel.Info;
        service = new LoggingService(exceptionDispatcherServiceSpy, config);

        service.logEvent(SOURCE, SIMPLE_EVENT);
        service.getSubscription().pipe(
            take(1)
        ).subscribe(event => {
            expect(event).toEqual(new LogEvent(LogLevel.Info, SOURCE, stringify(SIMPLE_EVENT)));
        });
    });
});
