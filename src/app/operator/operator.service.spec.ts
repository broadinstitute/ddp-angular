import {TestBed, inject, ComponentFixture} from '@angular/core/testing';

import { OperatorService } from './operator.service';
import {MockBackend} from "@angular/http/testing";
import {XHRBackend, ResponseOptions, Response, HttpModule} from "@angular/http";
import {GenericErrorHandler} from "../generic-error-handler";
import {LoggingErrorHandler} from "../logging-error-handler";
import {UmbrellaConfig} from "../umbrella-config/umbrella-config";

describe('OperatorService', () => {
  let umbrellaConfig:UmbrellaConfig = new UmbrellaConfig("cmi","v2","https://localhost");


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [OperatorService,
        { provide: XHRBackend, useClass: MockBackend },
        { provide: UmbrellaConfig, useValue: umbrellaConfig},
        { provide: GenericErrorHandler, useValue: new LoggingErrorHandler()}]
    });
  });

  it('should respond with reasonable data under normal circumstances', inject([OperatorService,XHRBackend], (service: OperatorService,mockBackend) => {
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

    service.getParticipants("123").subscribe(
      participants => {
        expect(participants.length).toBe(mockResponse.length);
      },
      error => {
        fail("should not have error'd out.")
      }
    );
  }));

  it('should handle re-auth gracefully ', inject([OperatorService,XHRBackend,GenericErrorHandler], (service: OperatorService,mockBackend,errorHandler) => {
    mockBackend.connections.subscribe((connection) => {
      let authTimeoutResponse = new Response(new ResponseOptions({
        status:401
      }));
      connection.mockRespond(authTimeoutResponse);
    });
    spyOn(errorHandler,'handleReAuth');

    service.getParticipants("123").subscribe(
      participants => {
        fail("Should have error'd out.")
      },
      error => {
        expect(error.authRequired).toBe(true);
        expect(errorHandler.handleReAuth).toHaveBeenCalledTimes(1);
      },
    )
  }));

  it('should explode with non-auth errors ', inject([OperatorService,XHRBackend,GenericErrorHandler], (service: OperatorService,mockBackend,errorHandler) => {
    mockBackend.connections.subscribe((connection) => {
      let authTimeoutResponse = new Response(new ResponseOptions({
        status:500
      }));
      connection.mockRespond(authTimeoutResponse);
    });
    spyOn(errorHandler,'handleGenericError');


    service.getParticipants("123").subscribe(
      participants => {
        fail("Should have error'd out.")
      },
      error => {
        expect(errorHandler.handleGenericError).toHaveBeenCalledTimes(1);
      },

    )
  }));
});
