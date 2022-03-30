import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { FileUploadService } from './fileUpload.service';
import { TranslateService } from '@ngx-translate/core';
import { SessionMementoService } from './sessionMemento.service';
import { LoggingService } from './logging.service';
import { ConfigurationService } from './configuration.service';
import { FileUploadResponse } from '../models/fileUploadResponse';
import { FileUploadBody } from '../models/fileUploadBody';
import { Session } from '../models/session';

describe('FileUploadService', () => {
    let service: FileUploadService;
    let httpTestingController;
    let session: SessionMementoService;
    let loggingServiceSpy: LoggingService;
    const backendUrl = 'https://pepper-dev.datadonationplatform.org';
    const studyGuid = 'studyGuid';
    const userGuid = 'userGuid';

    beforeEach(() => {
        const config = new ConfigurationService();
        config.studyGuid = studyGuid;
        config.backendUrl = backendUrl;
        loggingServiceSpy = jasmine.createSpyObj('LoggingService', ['logDebug', 'logError']);
        session = new SessionMementoService({} as TranslateService, config);
        session.updateSession(new Session('', '', userGuid, 'en', 999999999999999));

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        const httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);

        service = new FileUploadService(session, config, httpClient, loggingServiceSpy);
    });

    it('should create', () => {
        expect(service).toBeDefined();
    });

    describe('Get upload url', () => {
        const activityGuid = 'activityGuid';
        const questionStableId = 'stableId';
        const file = {
            name: 'fileName',
            size: 1000,
            type: '*.png'
        } as File;
        const requestBody: FileUploadBody = {
            questionStableId: 'stableId',
            fileName: 'fileName',
            fileSize: 1000,
            mimeType: '*.png'
        };
        const response: FileUploadResponse = {
            uploadGuid: 'guid',
            uploadUrl: 'url'
        };

        it('positive case (get)', (done) => {
            service.getUploadUrl(studyGuid, activityGuid, questionStableId, [file]).subscribe((res: FileUploadResponse[]) => {
                expect(res).toEqual([response]);
                done();
            });

            const req = httpTestingController.expectOne(`${backendUrl}/pepper/v1/user/${userGuid}/studies/${studyGuid}/activities/${activityGuid}/uploads`);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(requestBody);
            req.flush(response);
            httpTestingController.verify();
        });

        it('negative case (get)', (done) => {
            service.getUploadUrl(studyGuid, activityGuid, questionStableId, [file]).subscribe({
                next: () => fail('should have failed with an error'),
                error: (error) => {
                    expect(error.message).toEqual('An error occurred');
                    expect(error.error.status).toEqual(401);
                    expect(loggingServiceSpy.logDebug).toHaveBeenCalled();
                    done();
                }
            });

            const req = httpTestingController.expectOne(`${backendUrl}/pepper/v1/user/${userGuid}/studies/${studyGuid}/activities/${activityGuid}/uploads`);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(requestBody);

            const mockError = new ErrorEvent('Some error type', {
                message: 'An error occurred',
                error: {status: 401}
            });
            req.error(mockError);
        });
    });

    describe('Upload a file to Google Storage', () => {
        const path = 'https://storage.googleapis.com/ddp-dev-file-uploads/some-file-path';
        const file = {name: '1.png', size: 1000, type: 'image/png'} as File;

        it('positive case (upload)', (done) => {
            service.uploadFile(path, file).subscribe(() => {
                done();
            });

            const req = httpTestingController.expectOne(path);
            expect(req.request.method).toBe('PUT');
            expect(req.request.body).toBe(file);
            expect(req.request.headers.get('Content-Type')).toEqual(file.type);
            req.flush({});
        });

        it('negative case (upload)', (done) => {
            service.uploadFile(path, file).subscribe(
                () => fail('should have failed with an error'),
                (error) => {
                    expect(error.message).toEqual('Not found');
                    expect(error.error.status).toEqual(404);
                    expect(loggingServiceSpy.logDebug).toHaveBeenCalled();
                    done();
                });

            const req = httpTestingController.expectOne(path);
            expect(req.request.method).toBe('PUT');
            expect(req.request.body).toBe(file);
            expect(req.request.headers.get('Content-Type')).toEqual(file.type);

            const mockError = new ErrorEvent('Some error type', {
                message: 'Not found',
                error: {status: 404}
            });
            req.error(mockError);
        });
    });
});
