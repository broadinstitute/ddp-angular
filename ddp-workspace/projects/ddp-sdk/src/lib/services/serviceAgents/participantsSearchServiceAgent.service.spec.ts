import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import {
    ConfigurationService,
    ParticipantsSearchServiceAgent,
    LoggingService,
    SessionMementoService,
    SearchParticipant,
    EnrollmentStatusType,
    Session
} from 'ddp-sdk';
import { TranslateService } from '@ngx-translate/core';
import { SearchParticipantResponse } from '../../models/searchParticipantResponse';

describe('ParticipantsSearchServiceAgent Test', () => {
    let service: ParticipantsSearchServiceAgent;
    let httpTestingController: HttpTestingController;
    let sessionService: SessionMementoService;
    const backendUrl = 'https://pepper-dev.datadonationplatform.org';
    const studyGuid = 'ANGIO';

    beforeEach(() => {
        const config = new ConfigurationService();
        config.studyGuid = studyGuid;
        config.backendUrl = backendUrl;
        const loggingServiceSpy: jasmine.SpyObj<LoggingService> = jasmine.createSpyObj('LoggingService', ['logException']);
        sessionService = new SessionMementoService({} as TranslateService, config);
        sessionService.updateSession({} as Session);
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });

        const httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);

        service = new ParticipantsSearchServiceAgent(sessionService, config, httpClient, loggingServiceSpy);
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

    it('should return participant data', (done) => {
        const response: SearchParticipant = {
            guid: '1234',
            hruid: '5678',
            status: EnrollmentStatusType.COMPLETED,
        };

        const guid = 'ABC123';
        sessionService.updateSession({ participantGuid: guid } as Session);
        service.getParticipant().subscribe((result: SearchParticipant) => {
            expect(result).toEqual(response);
            done();
        });

        const req = httpTestingController.expectOne(`${backendUrl}/pepper/v1/admin/studies/${studyGuid}/participants/${guid}`);
        expect(req.request.method).toBe('GET');
        req.flush(response);
    });

    it('should return null if no participant guid', (done) => {
        service.getParticipant().subscribe((result: SearchParticipant|null) => {
            expect(result).toEqual(null);
            done();
        });
        sessionService.updateSession({ participantGuid: null } as Session);
    });
});
