import { TestBed } from '@angular/core/testing';
import { ConfigurationService } from './configuration.service';
import { LoggingService } from './logging.service';
import { LogLevel } from '../models/logLevel';
import { StackdriverErrorReporterService } from './stackdriverErrorReporter.service';

describe('LoggingService', () => {
    let service: LoggingService;
    let config: ConfigurationService;
    const stackdriverErrorReporterServiceSpy = jasmine.createSpyObj('StackdriverErrorReporterService', ['handleError']);

    beforeEach(() => {
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
        service = new LoggingService(config, stackdriverErrorReporterServiceSpy);
        expect(service).toBeTruthy();
    });

    it('should create all types of loggers', () => {
        config.logLevel = LogLevel.Debug;
        service = new LoggingService(config, stackdriverErrorReporterServiceSpy);

        expect(service.logDebug).not.toEqual(() => { });
        expect(service.logEvent).not.toEqual(() => { });
        expect(service.logWarning).not.toEqual(() => { });
        expect(service.logError).not.toEqual(() => { });
    });

    it('should create only Info, Warning and Error loggers', () => {
        config.logLevel = LogLevel.Info;
        service = new LoggingService(config, stackdriverErrorReporterServiceSpy);

        expect(JSON.stringify(service.logDebug)).toEqual(JSON.stringify(() => { }));
        expect(service.logEvent).not.toEqual(() => { });
        expect(service.logWarning).not.toEqual(() => { });
        expect(service.logError).not.toEqual(() => { });
    });

    it('should create only Warning and Error loggers', () => {
        config.logLevel = LogLevel.Warning;
        service = new LoggingService(config, stackdriverErrorReporterServiceSpy);

        expect(JSON.stringify(service.logDebug)).toEqual(JSON.stringify(() => { }));
        expect(JSON.stringify(service.logEvent)).toEqual(JSON.stringify(() => { }));
        expect(service.logWarning).not.toEqual(() => { });
        expect(service.logError).not.toEqual(() => { });
    });

    it('should create only Error loggers', () => {
        config.logLevel = LogLevel.Error;
        service = new LoggingService(config, stackdriverErrorReporterServiceSpy);

        expect(JSON.stringify(service.logDebug)).toEqual(JSON.stringify(() => { }));
        expect(JSON.stringify(service.logEvent)).toEqual(JSON.stringify(() => { }));
        expect(JSON.stringify(service.logWarning)).toEqual(JSON.stringify(() => { }));
        expect(service.logError).not.toEqual(() => { });
    });

    it('should call StackdriverErrorReporterService.handleReport if logLevel is Error', () => {
      config.logLevel = LogLevel.Error;
      service = new LoggingService(config, stackdriverErrorReporterServiceSpy);

      service.logError('a deliberate error during Logging service test');
      expect(stackdriverErrorReporterServiceSpy.handleError).toHaveBeenCalledWith('a deliberate error during Logging service test');
    });
});
