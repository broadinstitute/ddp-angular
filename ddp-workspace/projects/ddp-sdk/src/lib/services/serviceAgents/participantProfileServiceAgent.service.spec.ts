import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { forkJoin, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ConfigurationService, LoggingService, ParticipantProfileServiceAgent, SessionMementoService, UserProfile } from 'ddp-sdk';

describe('ParticipantProfileServiceAgent', () => {
    let service: ParticipantProfileServiceAgent;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let config: ConfigurationService;
    const backendUrl = 'https://pepper-dev.datadonationplatform.org';

    beforeEach(() => {
        config = new ConfigurationService();
        config.backendUrl = backendUrl;
        config.studyGuid = 'ATCP';
        const loggingServiceSpy: jasmine.SpyObj<LoggingService> = jasmine.createSpyObj('LoggingService', ['logException']);
        const sessionSpy = new SessionMementoService({} as TranslateService, config);
        spyOnProperty(sessionSpy, 'sessionObservable').and.returnValue(of({ participantGuid: 'USERGUID' }));

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });

        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);

        service = new ParticipantProfileServiceAgent(sessionSpy, config, httpClient, loggingServiceSpy);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('Service should be initialized', () => {
        expect(service).not.toBeNull();
    });

    it('should update participant profiles', (done) => {
        const participantGuid1 = 'participantGuid1';
        const participantGuid2 = 'participantGuid2';
        const participants = [
            {
                guid: participantGuid1,
                profile: {
                    preferredLanguage: 'en'
                } as UserProfile
            },
            {
                guid: participantGuid2,
                profile: {
                    preferredLanguage: 'en',
                    firstName: undefined,
                    lastName: undefined
                } as UserProfile
            }
        ];

        forkJoin(
            service.updateParticipantProfiles(participants)
        ).subscribe((result: any[]) => {
            expect(result.length).toEqual(2);
            done();
        });

        const req1 = httpTestingController.expectOne(`${backendUrl}/pepper/v1/user/${participantGuid1}/profile`);
        expect(req1.request.method).toBe('PATCH');
        expect(req1.request.body).toEqual(JSON.stringify({preferredLanguage: 'en'}));
        req1.flush({});

        const req2 = httpTestingController.expectOne(`${backendUrl}/pepper/v1/user/${participantGuid2}/profile`);
        expect(req2.request.method).toBe('PATCH');
        expect(req2.request.body).toEqual(JSON.stringify({preferredLanguage: 'en'}));
        req2.flush({});
    });
});


