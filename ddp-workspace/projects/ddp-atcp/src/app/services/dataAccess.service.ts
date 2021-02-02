import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { ConfigurationService, LoggingService } from 'ddp-sdk';

import { DataAccessParameters } from '../models/dataAccessParameters';

declare global {
  interface Window {
    DDP_ENV: {
      [key: string]: any;
      darUrl?: string;
    };
  }
}

interface DARFormResponse {
  url: string;
}

@Injectable({ providedIn: 'root' })
export class DataAccessService {
  private darUrl: string;

  private readonly LOG_SOURCE = 'DataAccessService';

  constructor(
    private http: HttpClient,
    private loggingService: LoggingService,
    @Inject('ddp.config') private config: ConfigurationService
  ) {
    this.getFunctionUrl();
  }

  public send(
    params: DataAccessParameters,
    biosketch: File,
    recaptchaToken: string
  ): Observable<any> {
    return this.http
      .post<DARFormResponse>(this.darUrl, {
        'g-recaptcha-response': recaptchaToken,
        data: params,
        attachment: {
          name: biosketch.name,
          size: biosketch.size,
        },
        clientId: this.config.auth0ClientId,
        domain: this.config.auth0Domain,
      })
      .pipe(
        concatMap(res =>
          this.http.put(res.url, biosketch, {
            headers: new HttpHeaders({
              'Content-Type': biosketch.type,
            }),
          })
        )
      );
  }

  private getFunctionUrl(): void {
    const darUrl = window.DDP_ENV.darUrl;

    if (!darUrl) {
      this.loggingService.logError(
        this.LOG_SOURCE,
        'No "darUrl" property found in DDP_ENV'
      );
    } else {
      this.darUrl = darUrl;
    }
  }
}
