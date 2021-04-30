import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { LoggingService } from './logging.service';
import { ConfigurationService } from './configuration.service';
import { UserServiceAgent } from './serviceAgents/userServiceAgent.service';
import { SessionMementoService } from './sessionMemento.service';
import { FileUploadBody, FileUploadResponse } from '../models/fileUpload';

@Injectable()
export class FileUploadService extends UserServiceAgent<any> {

    constructor(
        session: SessionMementoService,
        @Inject('ddp.config') configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService) {
        super(session, configuration, http, logger, null);
    }

    getUploadUrl(studyGuid: string, activityGuid: string, requestBody: FileUploadBody): Observable<FileUploadResponse> {
        const path = `/studies/${studyGuid}/activities/${activityGuid}/uploads`;

        return this.postObservable(path, requestBody, {}, true).pipe(
            catchError(error => {
                console.log('getUploadUrl error', error);
                return throwError(error.error);
            }),
            map(x => !!x ? x.body as FileUploadResponse : null)
        );
    }

    uploadFile(path: string, formData: FormData, contentType: string): any {
        const headers = new HttpHeaders({
            'Content-Type': contentType
        });

        return this.http.put(path, formData, {headers}).pipe(
            catchError(error => {
                console.log('uploadFile error', error);
                return throwError(error.error);
            })
        );
    }
}
