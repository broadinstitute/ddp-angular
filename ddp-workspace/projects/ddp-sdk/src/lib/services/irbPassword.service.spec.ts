import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie';
import { IrbPasswordService } from './irbPassword.service';
import { ConfigurationService } from './configuration.service';
import { LoggingService } from './logging.service';

describe('IrbPasswordService', () => {
    let service: IrbPasswordService;
    let httpClient: HttpClient;
    const config = new ConfigurationService();
    config.backendUrl = 'https://pepper-dev.datadonationplatform.org';
    // config.backendUrl = 'http://localhost:5555';
    config.studyGuid = 'ANGIO';
    // Faking out the cookieservice
    const cookieServiceSpy: jasmine.SpyObj<CookieService> = jasmine.createSpyObj('CookieService', ['put']);
    // called within the parent class
    const loggingServiceSpy: jasmine.SpyObj<LoggingService> = jasmine.createSpyObj('LoggingService', ['logException']);
    beforeEach(() => {
        TestBed.configureTestingModule({
            // this the import to get a real httpclient
            imports: [HttpClientModule],
            providers: [IrbPasswordService, { provide: CookieService, useValue: cookieServiceSpy },
                { provide: 'ddp.config', useValue: config }, LoggingService]
        });
        // For some reason TestBed is willing to inject Configuration into service, but not httpclient
        // So we need to instantiate ourselves
        httpClient = TestBed.get(HttpClient);
        service = new IrbPasswordService(config, cookieServiceSpy, httpClient, loggingServiceSpy);

    });
    afterEach(() => {
    });
    it('Check http password call', (done) => {
        // spy on handle error. Checking that we can make call cleanly
        // not the callThrough!!!!
        const handleErrorSpy = spyOn(service, 'handleError').and.callThrough();
        service.checkPassword('total-non-sense').subscribe(result => {
            // expect a false if study exists but we got the password wrong
            expect(result).toBe(false, 'We were expecting a false from server!');
            expect(handleErrorSpy).not.toHaveBeenCalled();
            done();
        }, (error) => {
            fail(error);
            done();

        });
    });
    it('bogus test', () => {
        expect(1).toBe(0);
    });
});
