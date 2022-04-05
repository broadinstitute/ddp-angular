import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService, LoggingService, LogLevel, StackdriverErrorReporterService, Session, SessionMementoService } from 'ddp-sdk';

describe('LoggingService', () => {
    let service: LoggingService;
    let config: ConfigurationService;
    let stackdriverErrorReporterServiceSpy: jasmine.SpyObj<StackdriverErrorReporterService>;
    let httpClientSpy: jasmine.SpyObj<HttpClient>;
    let sessionMock: SessionMementoService;

    beforeEach(() => {
        sessionMock = {
            isTemporarySession: () => true,
            session: ({ userGuid: '1243' } as Session)
        } as SessionMementoService;
        stackdriverErrorReporterServiceSpy = jasmine.createSpyObj('StackdriverErrorReporterService', ['handleError']);
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
        TestBed.configureTestingModule({
            providers: [
                LoggingService,
                { provide: 'ddp.config', useValue: new ConfigurationService() },
                { provide: StackdriverErrorReporterService, useValue: stackdriverErrorReporterServiceSpy }
            ]
        });

      config = new ConfigurationService();
    });

    it('should create service', () => {
        service = new LoggingService(config, stackdriverErrorReporterServiceSpy, httpClientSpy, sessionMock);
        expect(service).toBeTruthy();
    });

    it('should create all types of loggers', () => {
        config.logLevel = LogLevel.Debug;
        service = new LoggingService(config, stackdriverErrorReporterServiceSpy, httpClientSpy, sessionMock);

        expect(service.logDebug).not.toEqual(() => { });
        expect(service.logEvent).not.toEqual(() => { });
        expect(service.logWarning).not.toEqual(() => { });
        expect(service.logError).not.toEqual(() => { });
    });

    it('should create only Info, Warning and Error loggers', () => {
        config.logLevel = LogLevel.Info;
        service = new LoggingService(config, stackdriverErrorReporterServiceSpy, httpClientSpy, sessionMock);

        expect(JSON.stringify(service.logDebug)).toEqual(JSON.stringify(() => { }));
        expect(service.logEvent).not.toEqual(() => { });
        expect(service.logWarning).not.toEqual(() => { });
        expect(service.logError).not.toEqual(() => { });
    });

    it('should create only Warning and Error loggers', () => {
        config.logLevel = LogLevel.Warning;
        service = new LoggingService(config, stackdriverErrorReporterServiceSpy, httpClientSpy, sessionMock);

        expect(JSON.stringify(service.logDebug)).toEqual(JSON.stringify(() => { }));
        expect(JSON.stringify(service.logEvent)).toEqual(JSON.stringify(() => { }));
        expect(service.logWarning).not.toEqual(() => { });
        expect(service.logError).not.toEqual(() => { });
    });

    it('should create only Error loggers', () => {
        config.logLevel = LogLevel.Error;
        service = new LoggingService(config, stackdriverErrorReporterServiceSpy, httpClientSpy, sessionMock);

        expect(JSON.stringify(service.logDebug)).toEqual(JSON.stringify(() => { }));
        expect(JSON.stringify(service.logEvent)).toEqual(JSON.stringify(() => { }));
        expect(JSON.stringify(service.logWarning)).toEqual(JSON.stringify(() => { }));
        expect(service.logError).not.toEqual(() => { });
    });

    it('should call StackdriverErrorReporterService.handleReport if logLevel is Error', () => {
      config.logLevel = LogLevel.Error;
      service = new LoggingService(config, stackdriverErrorReporterServiceSpy, httpClientSpy, sessionMock);

      service.logError('a deliberate error during Logging service test');
      expect(stackdriverErrorReporterServiceSpy.handleError).toHaveBeenCalledWith('a deliberate error during Logging service test');
    });
});
