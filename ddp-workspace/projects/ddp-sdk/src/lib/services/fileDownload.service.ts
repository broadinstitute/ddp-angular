import {Inject, Injectable} from '@angular/core';
import { LoggingService } from './logging.service';
import { ConfigurationService } from './configuration.service';
import { SessionMementoService } from './sessionMemento.service';
import { UserServiceAgent } from './serviceAgents/userServiceAgent.service';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {mergeMap, Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {CommunicationAspect} from './communicationAspect.service';
import { beforeMethod } from 'kaop-ts';

@Injectable()
export class FileDownloadService extends UserServiceAgent<any> {
    constructor(
        session: SessionMementoService,
        @Inject('ddp.config') configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService) {
        super(session, configuration, http, logger, null);
    }

    @beforeMethod(CommunicationAspect.intrcept)
    public getDownloadUrl(studyGuid: string, activityGuid: string, questionStableId: string):
        Observable<any> {
        const path = `/studies/${studyGuid}/activities/${activityGuid}/questions/${questionStableId}/download`;
        const url = this.getBackendUrl() + path;
        return this.getHeaders(null)
            .pipe(
                mergeMap((data) => this.http.get(url, {
                    headers: data.headers,
                    observe: data.observe,
                    responseType: data.responseType,
                    withCredentials: data.withCredentials
                })
                .pipe(
                    map((responseData: any) =>
                        responseData instanceof HttpResponse ? responseData?.body : responseData),
                    catchError(error => {
                        this.logger.logDebug('getDownloadUrl error', error);
                        return throwError(() => error);
                    })
                ))
            );
    }
}
