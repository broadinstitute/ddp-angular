import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ActivityInstance, ConfigurationService, LoggingService, SessionMementoService, UserActivityServiceAgent } from 'ddp-sdk';

describe('UserActivityServiceAgent', () => {
    let service: UserActivityServiceAgent;
    let httpTestingController: HttpTestingController;

    const backendUrl = 'https://pepper-dev.datadonationplatform.org';
    const sessionUserGuid = 'sessionUserGuidTest';
    const response: ActivityInstance[] = [{
        instanceGuid: '123',
        activityName: 'name',
        activityTitle: 'title',
        activitySubtitle: 'subtitle',
        activityType: 'type',
        activitySubtype: 'subtype',
        activityCode: '234',
        activitySummary: 'test',
        activityDescription: 'test',
        statusCode: 'status',
        readonly: true,
        numQuestions: 1,
        numQuestionsAnswered: 1,
        isFollowup: true,
        isHidden: false,
        canDelete: true,
    }];
    const studyGuidValue = 'BRAIN';
    const studyGuid = of(studyGuidValue);
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

        service = new UserActivityServiceAgent(sessionSpy, config, httpClient, loggingServiceSpy, null);
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

        service.getActivities(studyGuid).subscribe((result: ActivityInstance[]) => {
            expect(result).toEqual(response);
            done();
        });

        const req = httpTestingController.expectOne(`${backendUrl}/pepper/v1/user/${guid}/studies/${studyGuidValue}/activities`);
        expect(req.request.method).toBe('GET');
        req.flush(response);
    });

    it('should make request with user from session in url', (done) => {
        const guid = '568CD';
        service.updateSelectedUser(guid);
        service.resetSelectedUser();

        service.getActivities(studyGuid).subscribe((result: ActivityInstance[]) => {
            expect(result).toEqual(response);
            done();
        });

        const req = httpTestingController.expectOne(`${backendUrl}/pepper/v1/user/${sessionUserGuid}/studies/${studyGuidValue}/activities`);
        expect(req.request.method).toBe('GET');
        req.flush(response);
    });
});
