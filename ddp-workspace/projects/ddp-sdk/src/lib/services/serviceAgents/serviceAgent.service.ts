import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommunicationAspect } from './../communicationAspect.service';
import { ConfigurationService } from './../configuration.service';
import { LanguageService } from './../languageService.service'
import { LoggingService } from './../logging.service';
import { CommunicationException } from './../../models/exceptions/communicationException';
import { beforeMethod } from 'kaop-ts';
import { Observable, of, throwError } from 'rxjs';
import { flatMap, catchError, map, filter, switchMap } from 'rxjs/operators';

@Injectable()
export class ServiceAgent<TEntity> {
    constructor(
        @Inject('ddp.config') protected configuration: ConfigurationService,
        private http: HttpClient,
        private logger: LoggingService,
        private language: LanguageService) { }

    @beforeMethod(CommunicationAspect.intrcept)
    protected getObservable(
        path: string,
        options: any = {},
        unrecoverableStatuses: Array<number> = []): Observable<TEntity | null> {
      const url = this.getBackendUrl() + path;
      const getObservable: Observable<TEntity | null> = this.getHeaders(options).pipe(
        flatMap(x => {
          if (x == null) {
            this.logger.logError('serviceAgent.get::' + path, 'Authorization required');
            return of(null);
          }
          return this.http.get(
            url,
            {
              ...x.params ? { params: x.params } : {},
              headers: x.headers,
              observe: x.observe,
              responseType: x.responseType,
              withCredentials: x.withCredentials
            }).pipe(
            catchError((error: any) => {
              console.log('there is an error');
              if (error && error.status) {
                if (unrecoverableStatuses.indexOf(error.status) > -1) {
                  return throwError(error);
                }
              }
              const exception = new CommunicationException('HTTP GET: ' + url, error);
              this.logger.logException('serviceAgent', exception);
              return of(null);
            }),
            map(data => data && data['body']),
            map((data: TEntity) => data)
          );
        })
      );

      if (this.language) {
        //For instances that get user text, call the main getObservable when the profile language changes
        return this.language.getProfileLanguageUpdateNotifier().pipe(
          switchMap(() => getObservable)
        );
      }
      else {
        return getObservable;
      }
    }

    @beforeMethod(CommunicationAspect.intrcept)
    protected postObservable(
        path: string,
        body: any,
        options: any = {},
        throwErrorObject: boolean = false): Observable<any> {
        const url = this.getBackendUrl() + path;
        return this.getHeaders(options).pipe(
            flatMap(x => {
                if (x == null) {
                    this.logger.logError('serviceAgent.post::' + path, 'Authorization required');
                    return of(null);
                }
                return this.http.post(
                    url,
                    body,
                    {
                        headers: x.headers,
                        observe: x.observe,
                        responseType: x.responseType,
                        withCredentials: x.withCredentials
                    }).pipe(
                        catchError((error: any) => {
                            const exception = new CommunicationException('HTTP POST: ' + url, error);
                            this.logger.logException('serviceAgent', exception);
                            if (throwErrorObject) {
                                return throwError(error);
                            } else {
                                return of(null);
                            }
                        })
                    );
            })
        );
    }

    @beforeMethod(CommunicationAspect.intrcept)
    protected patchObservable(
        path: string,
        body: any,
        options: any = {},
        throwErrorObject: boolean = false): Observable<any> {
        const url = this.getBackendUrl() + path;
        return this.getHeaders(options).pipe(
            flatMap(x => {
                if (x == null) {
                    this.logger.logError('serviceAgent.patch::' + path, 'Authorization required');
                    if (throwErrorObject) {
                        return throwError(new Error('No user session available'));
                    } else {
                        return of(null);
                    }
                }
                return this.http.patch(
                    url,
                    body,
                    {
                        headers: x.headers,
                        observe: x.observe,
                        responseType: x.responseType,
                        withCredentials: x.withCredentials
                    }).pipe(
                        catchError((error: any) => {
                            const exception = new CommunicationException('HTTP PATCH: ' + url, error);
                            this.logger.logException('serviceAgent', exception);
                            if (throwErrorObject) {
                                return throwError(error);
                            } else {
                                return of(null);
                            }

                        })
                    );
            })
        );
    }

    @beforeMethod(CommunicationAspect.intrcept)
    protected putObservable(
        path: string,
        body: any,
        options: any = {},
        throwErrorObject: boolean = false): Observable<any> {
        const url = this.getBackendUrl() + path;
        return this.getHeaders(options).pipe(
            flatMap(x => {
                if (x == null) {
                    this.logger.logError('serviceAgent.put::' + path, 'Authorization required');
                    return of(null);
                }
                return this.http.put(
                    url,
                    body,
                    {
                        headers: x.headers,
                        observe: x.observe,
                        responseType: x.responseType,
                        withCredentials: x.withCredentials
                    }).pipe(
                        catchError((error: any) => {
                            const exception = new CommunicationException('HTTP PUT: ' + url, error);
                            this.logger.logException('serviceAgent', exception);
                            if (throwErrorObject) {
                                return throwError(error);
                            } else {
                                return of(null);
                            }
                        })
                    );
            })
        );
    }

    @beforeMethod(CommunicationAspect.intrcept)
    protected deleteObservable(
        path: string,
        options: any = {},
        throwErrorObject: boolean = false): Observable<any> {
        const url = this.getBackendUrl() + path;
        return this.getHeaders(options).pipe(
            filter(x => x != null),
            flatMap(x => {
                if (x == null) {
                    this.logger.logError('serviceAgent.delete::' + path, 'Authorization required');
                    return of(null);
                }
                return this.http.delete(
                    url,
                    {
                        headers: x.headers,
                        observe: x.observe,
                        responseType: x.responseType,
                        withCredentials: x.withCredentials
                    }).pipe(
                        catchError((error: any) => {
                            const exception = new CommunicationException('HTTP DELETE: ' + url, error);
                            this.logger.logException('serviceAgent', exception);
                            if (throwErrorObject) {
                                return throwError(error);
                            } else {
                                return of(null);
                            }
                        })
                    );
            })
        );
    }

    protected getHeaders(options: any): Observable<any> {
      console.log('about to get the headers');
      const headers = Object.assign({
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        withCredentials: false,
        observe: 'response',
        responseType: 'json'
      }, options);

      console.log('the headers are:' + JSON.stringify(headers));
        return of(headers);
    }

    protected getBackendUrl(): string {
        return this.configuration.backendUrl;
    }
}
