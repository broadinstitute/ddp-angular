import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AnnouncementMessage, AnnouncementsServiceAgent, ConfigurationService, LoggingService, SessionMementoService } from 'ddp-sdk';

describe('AnnouncementsServiceAgent', () => {
    let service: AnnouncementsServiceAgent;
    let httpTestingController: HttpTestingController;

    const backendUrl = 'https://pepper-dev.datadonationplatform.org';
    const sessionUserGuid = 'sessionUserGuidTest';
    const response: AnnouncementMessage[] = [{
        guid: '123',
        permanent: true,
        message: 'test'
    }];
    const studyGuid = 'BRAIN';
    beforeEach(() => {
        const config = new ConfigurationService();
        config.backendUrl = backendUrl;
        const loggingServiceSpy: jasmine.SpyObj<LoggingService> = jasmine.createSpyObj('LoggingService', ['logException']);
        const sessionSpy = new SessionMementoService({} as TranslateService, config);
        spyOnProperty(sessionSpy, 'sessionObservable').and.returnValue(of({ participantGuid: sessionUserGuid }));

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });

        const httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);

        service = new AnnouncementsServiceAgent(sessionSpy, config, httpClient, loggingServiceSpy, null);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be initialized', () => {
        expect(service).not.toBeNull();
    });

    it('should make request with selected user in url', (done) => {
        const guid = '568CD';
        service.updateSelectedUser(guid);

        service.getMessages(studyGuid).subscribe((result: AnnouncementMessage[]) => {
            expect(result).toEqual(response);
            done();
        });

        const req = httpTestingController.expectOne(`${backendUrl}/pepper/v1/user/${guid}/studies/${studyGuid}/announcements`);
        expect(req.request.method).toBe('GET');
        req.flush(response);
    });

    it('should make request with user from session in url', (done) => {
        const guid = '568CD';
        service.updateSelectedUser(guid);
        service.resetSelectedUser();

        service.getMessages(studyGuid).subscribe((result: AnnouncementMessage[]) => {
            expect(result).toEqual(response);
            done();
        });

        const req = httpTestingController.expectOne(`${backendUrl}/pepper/v1/user/${sessionUserGuid}/studies/${studyGuid}/announcements`);
        expect(req.request.method).toBe('GET');
        req.flush(response);
    });
});
