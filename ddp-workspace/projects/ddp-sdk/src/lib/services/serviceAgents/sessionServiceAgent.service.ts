import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServiceAgent } from './serviceAgent.service';
import { LoggingService } from '../logging.service';
import { ConfigurationService } from '../configuration.service';
import { SessionMementoService } from '../sessionMemento.service';
import { LanguageService } from '../languageService.service';
import { Observable, of } from 'rxjs';
import { flatMap, switchMap, take } from 'rxjs/operators';

@Injectable()
export class SessionServiceAgent<TEntity> extends ServiceAgent<TEntity> {
    constructor(
        private _session: SessionMementoService,
        @Inject('ddp.config') protected _configuration: ConfigurationService,
        private _http: HttpClient,
        private _logger: LoggingService,
        private language: LanguageService = null) {
        super(_configuration, _http, _logger);
    }

    protected getHeaders(options: any): Observable<any> {
        return this._session.sessionObservable.pipe(
            flatMap(x => {
                if (x === null) {
                    return of(null);
                }
                let headers = new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Accept-Language': x && x.locale
                });
                if (x && x.idToken) {
                    headers = headers.set('Authorization', `Bearer ${x.idToken}`);
                }
                return of(Object.assign({
                    headers,
                    withCredentials: false,
                    observe: 'response',
                    responseType: 'json'
                }, options));
            }),
            // with token renew, sessionObservable is hot
            // take(1) to avoid pushing http calls everytime a renewal happens
            take(1)
        );
    }


    protected getBackendUrl(): string {
        return this.configuration.backendUrl + '/pepper/v1';
    }

    protected getObservable(path: string, options: any = {}, unrecoverableStatuses: Array<number> = []): Observable<TEntity | null> {
      if (this.language) {
        return this.language.getProfileLanguageUpdateNotifier()
          .pipe(switchMap(() =>
            super.getObservable(path, options, unrecoverableStatuses)));
      }
      else {
        return super.getObservable(path, options, unrecoverableStatuses);
      }
    }
}
