import { TestBed } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Observable, of } from 'rxjs';
import { DrugSuggestionResponse } from '../../models/drugSuggestionResponse';
import { ConfigurationService } from '../configuration.service';
import { LoggingService } from '../logging.service';
import { DrugServiceAgent } from './drugServiceAgent.service';
import { SessionMementoService } from '../sessionMemento.service';


describe('DrugServiceAgent Test', () => {
    let service: DrugServiceAgent;
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

        httpClient = TestBed.get(HttpClient)
        httpTestingController = TestBed.get(HttpTestingController);

        service = new DrugServiceAgent(sessionSpy, config, httpClient, loggingServiceSpy);
    });
    afterEach(() => {
        httpTestingController.verify();
    });
    it('Call getDrugSuggestion', (done) => {
        expect(service).not.toBeNull();
        // const stringVal = JSON.stringify([new DrugSuggestion(new Drug('drugGuid', 'Brain Candy', 'Delicious'),
        //     [new SuggestionMatch(0, 2)])]);
        const suggestionJson: DrugSuggestionResponse = {
            query: 'Br', results: [{
                drug: {
                    guid: 'drugGuid', name: 'Brain Candy',
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
});
