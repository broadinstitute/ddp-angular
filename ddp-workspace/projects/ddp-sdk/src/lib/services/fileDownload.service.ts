import {Inject, Injectable} from '@angular/core';
import { LoggingService } from './logging.service';
import { ConfigurationService } from './configuration.service';
import { SessionMementoService } from './sessionMemento.service';
import { UserServiceAgent } from './serviceAgents/userServiceAgent.service';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {FileDownloadResponse} from '../models/fileDownloadResponse';
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
        Observable<FileDownloadResponse> {
        const backendUrl = this.configuration.backendUrl;
        const path = `/studies/${studyGuid}/activities/${activityGuid}/questions/${questionStableId}/download`;

        return this.http.get<FileDownloadResponse>(backendUrl + path)
            .pipe(
                catchError(error => {
                    this.logger.logDebug('getDownloadUrl error', error);
                    return throwError(() => error.error);
                })
            );
    }
}
