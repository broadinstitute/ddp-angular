import { TestBed } from '@angular/core/testing';
import { ConfigurationService } from './configuration.service';
import { LoggingService } from './logging.service';
import { LogLevel } from '../models/logLevel';

describe('LoggingService', () => {
    let service: LoggingService;
    const config = new ConfigurationService();

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                LoggingService,
                { provide: 'ddp.config', useValue: config }
            ]
        });
    });

    it('should create service', () => {
        const config = new ConfigurationService();
        service = new LoggingService(config);
        expect(service).toBeTruthy();
    });

    it('should create all types of loggers', () => {
        const config = new ConfigurationService();
        config.logLevel = LogLevel.Debug;
        service = new LoggingService(config);

        expect(service.logDebug).not.toEqual(() => { });
        expect(service.logEvent).not.toEqual(() => { });
        expect(service.logWarning).not.toEqual(() => { });
        expect(service.logError).not.toEqual(() => { });
    });

    it('should create only Info, Warning and Error loggers', () => {
        const config = new ConfigurationService();
        config.logLevel = LogLevel.Info;
        service = new LoggingService(config);

        expect(JSON.stringify(service.logDebug)).toEqual(JSON.stringify(() => { }));
        expect(service.logEvent).not.toEqual(() => { });
        expect(service.logWarning).not.toEqual(() => { });
        expect(service.logError).not.toEqual(() => { });
    });

    it('should create only Warning and Error loggers', () => {
        const config = new ConfigurationService();
        config.logLevel = LogLevel.Warning;
        service = new LoggingService(config);

        expect(JSON.stringify(service.logDebug)).toEqual(JSON.stringify(() => { }));
        expect(JSON.stringify(service.logEvent)).toEqual(JSON.stringify(() => { }));
        expect(service.logWarning).not.toEqual(() => { });
        expect(service.logError).not.toEqual(() => { });
    });

    it('should create only Error loggers', () => {
        const config = new ConfigurationService();
        config.logLevel = LogLevel.Error;
        service = new LoggingService(config);

        expect(JSON.stringify(service.logDebug)).toEqual(JSON.stringify(() => { }));
        expect(JSON.stringify(service.logEvent)).toEqual(JSON.stringify(() => { }));
        expect(JSON.stringify(service.logWarning)).toEqual(JSON.stringify(() => { }));
        expect(service.logError).not.toEqual(() => { });
    });
});
