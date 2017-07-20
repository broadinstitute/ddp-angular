import {TestBed, async, ComponentFixture, inject} from '@angular/core/testing';

import { AppComponent } from './app.component';
import {FooModule} from "./foo/foo.module";
import {HttpModule, XHRBackend, ResponseOptions, Response} from "@angular/http";
import {LoggingErrorHandler} from "./logging-error-handler";
import {GenericErrorHandler} from "./generic-error-handler";
import {MockBackend} from "@angular/http/testing";
import {OperatorService} from "./operator/operator.service";
import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";
import {UmbrellaConfig} from "./umbrella-config/umbrella-config";

describe('AppComponent', () => {
  let app:AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports:[HttpModule,FooModule],
      providers: [OperatorService,
        { provide:UmbrellaConfig, useValue: new UmbrellaConfig("cmi","v1",null) },
        { provide: XHRBackend, useClass: MockBackend },
        { provide: GenericErrorHandler, useValue: new LoggingErrorHandler()}
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  it('should create the app', async(() => {
    fixture.detectChanges();
    expect(app).toBeTruthy();
  }));

  it('should show some results', async(inject([OperatorService,XHRBackend], (service: OperatorService,mockBackend) => {
    const mockResponse = [
      { participantId: '0', alias: 'Larry' },
      { participantId: '5', alias: 'Moe' },
      { participantId: '12930am', alias: 'Curly' }
    ];

    mockBackend.connections.subscribe((connection) => {
      let goodResponse = new Response(new ResponseOptions({
        status:200,
        body: JSON.stringify(mockResponse)
      }));

      connection.mockRespond(goodResponse);
    });

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      console.log('stablizied after async');
      let participantElts:DebugElement[] = fixture.debugElement.queryAll(By.css('.participant'));
      expect(participantElts.length).toBe(mockResponse.length);

      let participant:any;
      for (participant of mockResponse) {
        let isParticipantShown = false;
        let participantElt:any;
        for (participantElt of participantElts) {
          let displayedAlias = participantElt.nativeElement.textContent;
          if (displayedAlias.indexOf(participant.alias)) {
            isParticipantShown = true;
          }
        }
        expect(isParticipantShown).toBeTruthy("Did not find " + participant.alias + " displayed on page");
      }
    });
  })));
});
