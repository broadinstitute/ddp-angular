import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommunicationAspect } from '../communicationAspect.service';
import { ConfigurationService } from '../configuration.service';
import { LanguageService } from '../internationalization/languageService.service';
import { LoggingService } from '../logging.service';
import { beforeMethod } from 'kaop-ts';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, filter, switchMap, mergeMap } from 'rxjs/operators';

@Injectable()
export class ServiceAgent<TEntity> {
    private readonly LOG_SOURCE = 'ServiceAgent';

    constructor(
        @Inject('ddp.config') protected configuration: ConfigurationService,
        protected http: HttpClient,
        protected logger: LoggingService,
        private language: LanguageService) { }

    @beforeMethod(CommunicationAspect.intrcept)
    protected getObservable(
        path: string,
        options: any = {},
        unrecoverableStatuses: Array<number> = []): Observable<TEntity | null> {
        const url = this.getBackendUrl() + path;
        const getObservable: Observable<TEntity | null> = this.getHeaders(options).pipe(
            mergeMap(x => {
                if (x == null) {
                    this.logger.logError(`${this.LOG_SOURCE}.get::${path}`, 'Authorization required');
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
                            if (error && error.status) {
                                if (unrecoverableStatuses.indexOf(error.status) > -1) {
                                    return throwError(error);
                                }
                            }
                            this.logger.logError(this.LOG_SOURCE, `HTTP GET: ${url}. Error:`, error);
                            return of(null);
                        }),
                        map(data => data && data['body']),
                        map((data: TEntity) => data)
                    );
            })
        );

        if (this.language) {
            // For instances that get user text, call the main getObservable when the profile language changes
            return this.language.getProfileLanguageUpdateNotifier().pipe(
                switchMap(() => getObservable)
            );
        } else {
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
          mergeMap(x => {
                if (x == null) {
                    this.logger.logError(`${this.LOG_SOURCE}.post::${path}`, 'Authorization required');
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
                            this.logger.logError(this.LOG_SOURCE, `HTTP POST: ${url}. Error:`, error);
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
            mergeMap(x => {
                if (x == null) {
                    this.logger.logError(`${this.LOG_SOURCE}.patch::${path}`, 'Authorization required');
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
                            this.logger.logError(this.LOG_SOURCE, `HTTP PATCH: ${url}. Error:`, error);
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
            mergeMap(x => {
                if (x == null) {
                    this.logger.logError(`${this.LOG_SOURCE}.put::${path}`, 'Authorization required');
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
                            this.logger.logError(this.LOG_SOURCE, `HTTP PUT: ${url}. Error:`,  error);
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
            mergeMap(x => {
                if (x == null) {
                    this.logger.logError(`${this.LOG_SOURCE}.delete::${path}`, 'Authorization required');
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
                            this.logger.logError(this.LOG_SOURCE, `HTTP DELETE: ${url}. Error:`, error);
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
        this.logger.logEvent(this.LOG_SOURCE, 'About to get the headers');
        const headers = Object.assign({
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            withCredentials: false,
            observe: 'response',
            responseType: 'json'
        }, options);
        this.logger.logEvent(this.LOG_SOURCE, `The headers are: ${JSON.stringify(headers)}`);
        return of(headers);
    }

    protected getBackendUrl(): string {
        return this.configuration.backendUrl;
    }
}
