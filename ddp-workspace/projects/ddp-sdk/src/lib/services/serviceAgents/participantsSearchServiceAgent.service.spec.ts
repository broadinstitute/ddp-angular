import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ConfigurationService } from '../configuration.service';
import { ParticipantsSearchServiceAgent } from './participantsSearchServiceAgent.service';
import { LoggingService } from '../logging.service';
import { SessionMementoService } from '../sessionMemento.service';
import { of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { SearchParticipantResponse } from '../../models/searchParticipantResponse';
import { EnrollmentStatusType } from '../../models/enrollmentStatusType';

describe('ParticipantsSearchServiceAgent Test', () => {
    let service: ParticipantsSearchServiceAgent;
    let httpTestingController: HttpTestingController;

    const backendUrl = 'https://pepper-dev.datadonationplatform.org';
    const studyGuid = 'ANGIO';
    beforeEach(() => {
        const config = new ConfigurationService();
        config.studyGuid = studyGuid;
        config.backendUrl = backendUrl;
        const loggingServiceSpy: jasmine.SpyObj<LoggingService> = jasmine.createSpyObj('LoggingService', ['logException']);
        const sessionSpy = new SessionMementoService({} as TranslateService, config);
        spyOnProperty(sessionSpy, 'sessionObservable').and.returnValue(of({}));

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });

        const httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);

        service = new ParticipantsSearchServiceAgent(sessionSpy, config, httpClient, loggingServiceSpy);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be initialized', () => {
        expect(service).not.toBeNull();
    });

    it('should search for participants', (done) => {
        const response: SearchParticipantResponse = {
            totalCount: 1,
            results: [{
                guid: '1234',
                hruid: '5678',
                status: EnrollmentStatusType.COMPLETED,
            }]
        };

        const query = 'John Smith';
        service.search(query).subscribe((result: SearchParticipantResponse) => {
            expect(result).toEqual(response);
            done();
        });

        const req = httpTestingController.expectOne(`${backendUrl}/pepper/v1/admin/studies/${studyGuid}/participants-lookup`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({query});
        req.flush(response);
    });
});
