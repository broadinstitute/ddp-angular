import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Address, AddressService, ConfigurationService, LoggingService, SessionMementoService } from 'ddp-sdk';

describe('AddressService', () => {
    let service: AddressService;
    let httpTestingController: HttpTestingController;
    let config: ConfigurationService;

    const backendUrl = 'https://pepper-dev.datadonationplatform.org';
    const sessionUserGuid = 'sessionUserGuidTest';
    beforeEach(() => {
        config = new ConfigurationService();
        config.backendUrl = backendUrl;
        const loggingServiceSpy: jasmine.SpyObj<LoggingService> = jasmine.createSpyObj('LoggingService', ['logException']);
        const sessionSpy = new SessionMementoService({} as TranslateService, config);
        spyOnProperty(sessionSpy, 'sessionObservable').and.returnValue(of({ participantGuid: sessionUserGuid }));

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });

        const httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);

        service = new AddressService(sessionSpy, config, httpClient, loggingServiceSpy, null, null);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be initialized', (done) => {
        const addressGuid = 'ABCD678';
        const addressJson = {
            guid: '123',
            name: 'test',
            street1: 'road',
            street2: 'road2',
            city: 'Moscow',
            state: 'Moscow',
            zip: '666777',
            country: 'Russia',
            phone: '9678465',
        };

        service.getAddress(addressGuid).subscribe((address: Address) => {
            expect(address).toEqual(jasmine.objectContaining(addressJson));
            done();
        });

        const req = httpTestingController
            .expectOne(`${config.backendUrl}/pepper/v1/user/${sessionUserGuid}/profile/address/${addressGuid}`);
        expect(req.request.method).toBe('GET');
        req.flush(addressJson);
    });
});
