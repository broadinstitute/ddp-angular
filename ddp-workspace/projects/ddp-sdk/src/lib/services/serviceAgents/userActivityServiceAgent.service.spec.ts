import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ConfigurationService, LoggingService, SessionMementoService, UserActivityServiceAgent } from 'ddp-sdk';

describe('UserActivityServiceAgent', () => {
    let service: UserActivityServiceAgent;
    let httpTestingController: HttpTestingController;
    let sessionSpy: SessionMementoService;

    const backendUrl = 'https://pepper-dev.datadonationplatform.org';
    const sessionUserGuid = 'sessionUserGuidTest';
    const studyGuid = 'ANGIO';
    beforeEach(() => {
        const config = new ConfigurationService();
        config.backendUrl = backendUrl;
        config.studyGuid = studyGuid;
        const loggingServiceSpy: jasmine.SpyObj<LoggingService> = jasmine.createSpyObj('LoggingService', ['logException']);
        sessionSpy = new SessionMementoService({} as TranslateService, config);
        spyOnProperty(sessionSpy, 'sessionObservable').and.returnValue(of({ participantGuid: sessionUserGuid }));
        spyOnProperty(sessionSpy, 'session').and.returnValue({ participantGuid: sessionUserGuid });

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });

        const httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);

        service = new UserActivityServiceAgent(sessionSpy, config, httpClient, loggingServiceSpy, null);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be initialized', () => {
        expect(service).not.toBeNull();
    });

    it('should clean up participant id in the session after the observable is formed', (done) => {
        const setParticipantSpy = spyOn(sessionSpy, 'setParticipant');
        const participantGuid = '123';
        service.getActivities(of(studyGuid), participantGuid).subscribe(() => {
            expect(setParticipantSpy).toHaveBeenCalledTimes(2);
            expect(setParticipantSpy).toHaveBeenCalledWith(participantGuid);
            expect(setParticipantSpy).toHaveBeenCalledWith(sessionUserGuid);
            done();
        });

        const req = httpTestingController.expectOne(`${backendUrl}/pepper/v1/user/${sessionUserGuid}/studies/${studyGuid}/activities`);
        expect(req.request.method).toBe('GET');
        req.flush([]);
    });
});
