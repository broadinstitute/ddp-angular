import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie';
import { IrbPasswordService } from './irbPassword.service';
import { ConfigurationService } from './configuration.service';
import { LoggingService } from './logging.service';

describe('IrbPasswordService', () => {
    let service: IrbPasswordService;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    const config = new ConfigurationService();
    config.backendUrl = 'https://pepper-mock-backend.org';
    config.studyGuid = 'study';
    const mockRequestUrl = `${config.backendUrl}/pepper/v1/studies/${config.studyGuid}/irb-password-check`;
    // Faking out the cookieservice
    const cookieServiceSpy: jasmine.SpyObj<CookieService> = jasmine.createSpyObj('CookieService', ['put']);
    // called within the parent class
    const loggingServiceSpy: jasmine.SpyObj<LoggingService> = jasmine.createSpyObj('LoggingService', ['logException']);

    beforeEach(() => {
        TestBed.configureTestingModule({
            // this the import to get a real httpclient
            imports: [
                HttpClientModule,
                HttpClientTestingModule
            ],
            providers: [
                IrbPasswordService,
                CookieService,
                LoggingService,
                { provide: 'ddp.config', useValue: config }
            ]
        });
        // For some reason TestBed is willing to inject Configuration into service, but not httpclient
        // So we need to instantiate ourselves
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
        service = new IrbPasswordService(config, cookieServiceSpy, httpClient, loggingServiceSpy);
    });

    afterEach(() => {
        httpTestingController.verify();
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
        });
        // mock backend request
        const request = httpTestingController.expectOne(mockRequestUrl);
        request.flush({
            result: false
        });
    });
});
