import {SharedLearningsStateService} from './sharedLearningsState.service';
import {SharedLearningsHTTPService} from './sharedLearningsHTTP.service';
import {DSMService} from '../../services/dsm.service';
import {SessionService} from '../../services/session.service';
import {of} from 'rxjs';
import {SomaticResultsFile} from '../interfaces/somaticResultsFile';
import {first} from 'rxjs/operators';
import {expect} from '@angular/flex-layout/_private-utils/testing';
import {HttpRequestStatusEnum} from '../enums/httpRequestStatus-enum';
import {SomaticResultsFileVirusStatusEnum} from '../enums/somaticResultsFileVirusStatus-enum';
import {LoggingService} from 'ddp-sdk';

const testDocuments: any = [
  {
    somaticDocumentId: 425,
    deletedByUserId: 0,
    deletedAt: 0,
    isVirusFree: true,
    sentAt: 1688053533693
  },
  {
    somaticDocumentId: 426,
    deletedByUserId: 0,
    deletedAt: 0,
    isVirusFree: true,
    sentAt: 0
  },
  // this object has been deleted by the user
  {
    somaticDocumentId: 427,
    deletedByUserId: 123,
    deletedAt: 1688109943725,
    isVirusFree: true,
    sentAt: 1688109943725
  }
];

const infectedTestDocument = {
  somaticDocumentId: 428,
  deletedByUserId: 0,
  deletedAt: 1688109943725,
  isVirusFree: false,
  sentAt: 0
};

const singleTestDocument = {
  somaticDocumentId: 429,
  deletedByUserId: 0,
  deletedAt: 0,
  isVirusFree: true,
  sentAt: 0
};


describe('Shared Learnings State Service', () => {
  let service: SharedLearningsStateService;

  beforeEach(() => {
    const sessionService = new SessionService();
    spyOnProperty(sessionService, 'selectedRealm', 'get').and.returnValue('test study');

    const httpService = new SharedLearningsHTTPService({} as DSMService, sessionService);
    spyOn(httpService, 'getFiles').and.returnValue(of(testDocuments));
    spyOn(httpService, 'getFile').and.returnValue(of(testDocuments[0]));
    spyOn(httpService, 'sendToParticipant').and.returnValue(of({data: 123}));
    spyOn(httpService, 'delete').and.returnValue(of(testDocuments[0]));

    service = new SharedLearningsStateService(httpService);
  });

  beforeEach(() => {
    service.getAndScanFiles('PT ID')
      .pipe(first())
      .subscribe();
  });

  it('should get all documents filtered', (done) => {
    service.getAndScanFiles('PT ID')
      .pipe(first())
      .subscribe();

    service.somaticResultsFiles$
      .pipe(first())
      .subscribe((files) => {
        // checks if documents have been filtered
        expect(files.every(file => !file.deletedByUserId))
          .toBeTruthy('Documents have not been filtered properly. They include deleted files as well');
        done();
      });
  });

  it('should detect infected file', (done) => {
    testDocuments.push(infectedTestDocument as SomaticResultsFile);
    service.addFile(infectedTestDocument as SomaticResultsFile, 'PT ID');

    service.somaticResultsFiles$
      .pipe(first())
      .subscribe((files) => {
        const addedFile = files.find(file => file.somaticDocumentId === 428);
        // checks if a document has been added based on its finding
        expect(addedFile).toBeTruthy('Infected file has not been added');
        expect(addedFile.virusStatus)
          .toBe(SomaticResultsFileVirusStatusEnum.INFECTED, 'Infected file\'s status is wrong');
        done();
      });
  });

  it('should add file', (done) => {
    testDocuments.push(singleTestDocument);
    service.addFile(singleTestDocument as SomaticResultsFile, 'PT ID');

    service.somaticResultsFiles$
      .pipe(first())
      .subscribe((files) => {
        const addedFile = files.find(file => file.somaticDocumentId === 429);
        // checks if a document has been added based on its finding
        expect(addedFile).toBeTruthy();
        expect(addedFile.virusStatus)
          .toBe(SomaticResultsFileVirusStatusEnum.CLEAN, 'Infected file\'s status is wrong');
        done();
      });
  });

  it('should send file to participant successfully', (done) => {
    service.sendFileToParticipant('PT ID', 425)
      .pipe(first())
      .subscribe();

    service.somaticResultsFiles$
      .pipe(first())
      .subscribe((files) => {
        const sentFile = files.find(file => file.somaticDocumentId === 425);
        // checks if a document has been sent to participant successfully based on the document status
        expect(sentFile.sendToParticipantStatus.status).toEqual(HttpRequestStatusEnum.SUCCESS);
        done();
      });
  });

  it('should delete file', (done) => {
    service.deleteFile(426)
      .pipe(first())
      .subscribe();

    service.somaticResultsFiles$
      .pipe(first())
      .subscribe((files) => {
        const sentFile = files.find(file => file.somaticDocumentId === 426);
        // checks if a document has been deleted based on removal of the document
        expect(sentFile).toBeFalsy();
        done();
      });
  });

});
