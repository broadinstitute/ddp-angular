import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ConfigurationService } from '../configuration.service';
import { SuggestionServiceAgent } from './suggestionServiceAgent.service';
import { LoggingService } from '../logging.service';
import { SessionMementoService } from '../sessionMemento.service';
import { DrugSuggestionResponse } from '../../models/drugSuggestionResponse';
import { CancerSuggestionResponse } from '../../models/cancerSuggestionResponse';
import { CookieService } from 'ngx-cookie';
import { of } from 'rxjs';

describe('SuggestionServiceAgent Test', () => {
    let service: SuggestionServiceAgent;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let config: ConfigurationService;

    beforeEach(() => {
        config = new ConfigurationService();
        config.backendUrl = 'https://pepper-dev.datadonationplatform.org';
        // config.backendUrl = 'http://localhost:5555';
        config.studyGuid = 'ANGIO';
        // Faking out the cookieservice
        const cookieServiceSpy: jasmine.SpyObj<CookieService> = jasmine.createSpyObj('CookieService', ['put']);
        // called within the parent class
        const loggingServiceSpy: jasmine.SpyObj<LoggingService> = jasmine.createSpyObj('LoggingService', ['logException']);
        // const sessionSpy: jasmine.SpyObj<SessionMementoService> = jasmine.createSpyObj('SessionMementoService', ['sessionObservable']);
        const sessionSpy = new SessionMementoService();
        spyOnProperty(sessionSpy, 'sessionObservable').and.returnValue(of({ participanteGuid: 'USERGUID' }));

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });

        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);

        service = new SuggestionServiceAgent(sessionSpy, config, httpClient, loggingServiceSpy);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('Service should be initialized', () => {
        expect(service).not.toBeNull();
    });

    it('Call findDrugSuggestions', (done) => {
        const suggestionJson: DrugSuggestionResponse = {
            query: 'Br', results: [{
                drug: {
                    name: 'Brain Candy',
                    description: 'Delicious'
                },
                matches: [{
                    length: 2,
                    offset: 0
                }]
            }]
        };

        service.findDrugSuggestions('Br', 8).subscribe((suggestion: DrugSuggestionResponse) => {
            console.log(JSON.stringify(suggestion));
            expect(suggestion).toBeTruthy();
            expect(suggestion.query).toBe(suggestionJson.query);
            expect(suggestion.results.length).toBe(1);
            done();
        });

        const req = httpTestingController.expectOne(`${config.backendUrl}/pepper/v1/studies/ANGIO/suggestions/drugs?q=Br&limit=8`);
        expect(req.request.method).toBe('GET');
        expect(req.request.params.toString()).toEqual('q=Br&limit=8');
        req.flush(suggestionJson);
    });

    it('Call findCancerSuggestions', (done) => {
        const suggestionJson: CancerSuggestionResponse = {
            query: 'Br', results: [{
                cancer: {
                    name: 'Brain Cancer',
                    description: null
                },
                matches: [{
                    length: 2,
                    offset: 0
                }]
            }]
        };

        service.findCancerSuggestions('Br', 8).subscribe((suggestion: CancerSuggestionResponse) => {
            console.log(JSON.stringify(suggestion));
            expect(suggestion).toBeTruthy();
            expect(suggestion.query).toBe(suggestionJson.query);
            expect(suggestion.results.length).toBe(1);
            done();
        });

        const req = httpTestingController.expectOne(`${config.backendUrl}/pepper/v1/studies/ANGIO/suggestions/cancers?q=Br&limit=8`);
        expect(req.request.method).toBe('GET');
        expect(req.request.params.toString()).toEqual('q=Br&limit=8');
        req.flush(suggestionJson);
    });
});
