import {
  ChangeDetectionStrategy,
  Component, Input, OnDestroy, OnInit,
} from '@angular/core';
import {SomaticResultsFile, SomaticResultsFileWithStatus} from './interfaces/somaticResultsFile';
import {
  delay, mergeMap,
  Observable, repeatWhen,
  Subject, switchMap,
  takeUntil,
  takeWhile, tap,
  throwError
} from 'rxjs';
import {SharedLearningsHTTPService} from './services/sharedLearningsHTTP.service';
import {catchError, finalize, first, map, take} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {SharedLearningsStateService} from './services/sharedLearningsState.service';
import {SomaticResultsFileVirusStatusEnum} from './enums/somaticResultsFileVirusStatus-enum';
import {HttpRequestStatusEnum} from './enums/httpRequestStatus-enum';
import {ConfirmationModalComponent} from './components/confirmationModal/confirmationModal.component';
import {MatDialog} from '@angular/material/dialog';
import {RoleService} from '../services/role.service';

@Component({
  selector: 'app-shared-learnings-upload',
  templateUrl: 'sharedLearningsUpload.component.html',
  styleUrls: ['sharedLearningsUpload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SharedLearningsHTTPService, SharedLearningsStateService]
})
export class SharedLearningsUploadComponent implements OnInit, OnDestroy {
  public somaticResultsFilesWithStatus: SomaticResultsFileWithStatus[] = [];
  private somaticResultsFilesWithStatus$: Observable<SomaticResultsFileWithStatus[]> =
    this.stateService.somaticResultsFiles$;

  public isLoading = false;
  public isUnauthorized = false;
  public errorLoadingData: string | null;

  private takeUntilSubject$ = new Subject<void>();
  private isScanningForViruses = false;

  @Input() tabActivated$: Observable<void>;
  @Input() participantId: string;

  constructor(
    private readonly sharedLearningsHTTPService: SharedLearningsHTTPService,
    private readonly stateService: SharedLearningsStateService,
    private readonly matDialog: MatDialog,
    private readonly roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.loadData().subscribe();

    this.somaticResultsFilesWithStatus$
      .pipe(takeUntil(this.takeUntilSubject$))
      .subscribe((somaticResultsFilesWithStatus: SomaticResultsFileWithStatus[]) =>
        this.somaticResultsFilesWithStatus = somaticResultsFilesWithStatus);
  }

  ngOnDestroy(): void {
    this.takeUntilSubject$.next();
    this.takeUntilSubject$.complete();
  }

  /* Template functions*/
  public get allowToSeeTitle(): boolean {
    return this.roleService.allowUploadRorFile;
  }

  /* Event Listeners */
  public onFileUpload(somaticResultsFiles: SomaticResultsFile): void {
    this.handleUploadedFile(somaticResultsFiles);
    if(!this.isScanningForViruses) {
      this.getAndScanFiles
        .pipe(takeUntil(this.takeUntilSubject$))
        .subscribe();
    }
  }

  public onSendToParticipant({somaticDocumentId}: SomaticResultsFileWithStatus): void {
    const updatedState = this.updateSendToStatus(somaticDocumentId, HttpRequestStatusEnum.IN_PROGRESS, null);
    this.stateService.updateState(updatedState);

    this.sharedLearningsHTTPService.sendToParticipant(this.participantId, somaticDocumentId)
      .pipe(
        mergeMap(() => this.sharedLearningsHTTPService
          .getFile(this.participantId, somaticDocumentId)
          .pipe(catchError((error: any) => {
            if(error instanceof HttpErrorResponse) {
              this.handleSentDateUpdate(somaticDocumentId, null);
              this.handleSendToSuccess(somaticDocumentId);
            }
            return throwError(null);
          }))),
        takeUntil(this.takeUntilSubject$)
      )
      .subscribe({
        next: ({sentAt}: SomaticResultsFile) => {
          this.handleSentDateUpdate(somaticDocumentId, sentAt);
          this.handleSendToSuccess(somaticDocumentId);
        },
        error: (error: any) =>
          error !== null &&
          error instanceof HttpErrorResponse
          && this.handleSendToFail(somaticDocumentId, error.error)
      });
  }

  public deleteFile({somaticDocumentId, fileName}: SomaticResultsFileWithStatus): void {
    const activeConfirmationDialog = this.matDialog
      .open(ConfirmationModalComponent, {data: {fileName}, width: '500px'});

    activeConfirmationDialog.afterClosed()
      .pipe(
        take(1),
        takeUntil(this.takeUntilSubject$)
      )
      .subscribe({
        next: (deleteOrNot: boolean) => deleteOrNot && this.handleFileDeletion(somaticDocumentId)
      });
  }

  /* Initial Load */
  private loadData(): Observable<any> {
    this.isLoading = true;
    return this.tabActivated$.pipe(
      first(),
      switchMap(() => this.getAndScanFiles
        .pipe(finalize(() => this.isLoading = false))
      ),
      tap(() => this.isLoading = false),
      takeUntil(this.takeUntilSubject$),
      catchError((error: any) => this.handleError(error))
    );
  }

  private get getAndScanFiles(): Observable<any> {
    this.isScanningForViruses = true;
    return this.getFiles
      .pipe(
        tap((somaticResultsFilesWithStatus: SomaticResultsFileWithStatus[]) =>
          this.stateService.updateState(somaticResultsFilesWithStatus)),
        repeatWhen((notifications: Observable<void>) =>
          notifications.pipe(
            takeWhile(() =>
              this.somaticResultsFilesWithStatus
                .some(file => file.virusStatus === SomaticResultsFileVirusStatusEnum.SCANNING)),
            delay(3000)
          )),
        finalize(() => this.isScanningForViruses = false)
      );
  }

  private get getFiles(): Observable<SomaticResultsFileWithStatus[]> {
    return this.stateService
      .getSomaticResultsFiles(this.participantId)
      .pipe(
        map((somaticResultsFiles: SomaticResultsFile[]) => this.filterDeletedFiles(somaticResultsFiles)),
        map((somaticResultsFiles: SomaticResultsFile[]) =>
          somaticResultsFiles.map((somaticResultsFile: SomaticResultsFile) => this.mapStatusesToFile(somaticResultsFile)))
      );
  }

  /* Mappers */
  private mapStatusesToFile(somaticResultsFile: SomaticResultsFile): SomaticResultsFileWithStatus {
    return {
      ...somaticResultsFile,
      createdAt: somaticResultsFile.createdAt * 1000,
      deletedAt: somaticResultsFile.deletedAt * 1000,
      sendToParticipantStatus: {status: HttpRequestStatusEnum.NONE, message: null},
      deleteStatus: {status: HttpRequestStatusEnum.NONE, message: null},
      virusStatus: this.handleAndReturnVirusStatusFor(somaticResultsFile)
    };
  }

  /* Filter functions */
  private filterDeletedFiles(somaticResultsFiles: SomaticResultsFile[]): SomaticResultsFile[] {
    return somaticResultsFiles.filter((somaticFile: SomaticResultsFile) => !(!!somaticFile.deletedByUserId));
  }

  /* Virus scanner functions */
  private handleAndReturnVirusStatusFor({
                                          isVirusFree,
                                          deletedAt,
                                          somaticDocumentId
                                        }: SomaticResultsFile): SomaticResultsFileVirusStatusEnum {
    const isFileDeleted = !!deletedAt;

    if (!isVirusFree && isFileDeleted) { // file has been scanned and is infected
      return SomaticResultsFileVirusStatusEnum.INFECTED;
    } else if (!isVirusFree && !isFileDeleted) {
      // file has not been scanned, so it will scan file as well
      return SomaticResultsFileVirusStatusEnum.SCANNING;
    } else if (isVirusFree && !isFileDeleted) { // file has already been scanned for viruses and is clean
      return SomaticResultsFileVirusStatusEnum.CLEAN;
    } else {
      // file has been cleaned and it's deleted
      return SomaticResultsFileVirusStatusEnum.CLEAN;
    }
  }


  /** Handlers */
  private handleFileDeletion(somaticDocumentId: number): void {
    const updatedState = this.updateDeleteStatus(somaticDocumentId, HttpRequestStatusEnum.IN_PROGRESS, null);
    this.stateService.updateState(updatedState);

    this.sharedLearningsHTTPService.delete(somaticDocumentId)
      .pipe(takeUntil(this.takeUntilSubject$))
      .subscribe({
        next: () => this.handleDeleteSuccess(somaticDocumentId),
        error: (error: any) => error instanceof HttpErrorResponse &&
          this.handleDeleteFail(somaticDocumentId, error.error)
      });
  }

  private handleUploadedFile(somaticResultsFile: SomaticResultsFile): void {
    const updatedState = [...this.somaticResultsFilesWithStatus, this.mapStatusesToFile(somaticResultsFile)];
    this.stateService.updateState(updatedState);
  }

  private handleSendToSuccess(somaticDocumentId: number): void {
    const updatedState = this.updateSendToStatus(somaticDocumentId, HttpRequestStatusEnum.SUCCESS, null);
    this.stateService.updateState(updatedState);

    // Resetting back to send icon, as the file can be sent multiple times
    setTimeout(() => {
      const reUpdatedState = this.updateSendToStatus(somaticDocumentId, HttpRequestStatusEnum.NONE, null);
      this.stateService.updateState(reUpdatedState);
    }, 2000);
  }

  private handleDeleteSuccess(somaticDocumentId: number): void {
    const updatedState = this.somaticResultsFilesWithStatus.filter(({somaticDocumentId: id}) => id !== somaticDocumentId);
    this.stateService.updateState(updatedState);
  }

  private handleSendToFail(somaticDocumentId: number, error: string): void {
    const updatedState = this.updateSendToStatus(somaticDocumentId, HttpRequestStatusEnum.FAIL, error);
    this.stateService.updateState(updatedState);
  }

  private handleDeleteFail(somaticDocumentId: number, error: string): void {
    const updatedState = this.updateDeleteStatus(somaticDocumentId, HttpRequestStatusEnum.FAIL, error);
    this.stateService.updateState(updatedState);
  }

  private handleSentDateUpdate(id: number, sentDate: number | null): void {
    const updatedState = this.updateSentDate(id, sentDate);
    this.stateService.updateState(updatedState);
  }


  private handleError(error: any): Observable<any> {
    if (error instanceof HttpErrorResponse) {
      this.errorLoadingData = error.error;
      this.isUnauthorized = error.status === 403;
    }
    return throwError(() => error);
  }

  /** Actions */
  private updateSendToStatus(id: number, status: HttpRequestStatusEnum, message): SomaticResultsFileWithStatus[] {
    return this.somaticResultsFilesWithStatus.map((sharedLearning: SomaticResultsFileWithStatus) =>
      sharedLearning.somaticDocumentId === id ? {
        ...sharedLearning,
        sendToParticipantStatus: {status, message}
      } : sharedLearning);
  }

  private updateDeleteStatus(id: number,
                             status: HttpRequestStatusEnum.NONE | HttpRequestStatusEnum.IN_PROGRESS | HttpRequestStatusEnum.FAIL,
                             message): SomaticResultsFileWithStatus[] {
    return this.somaticResultsFilesWithStatus.map((sharedLearning: SomaticResultsFileWithStatus) =>
      sharedLearning.somaticDocumentId === id ? {...sharedLearning, deleteStatus: {status, message}} : sharedLearning);
  }

  private updateVirusStatus(id: number, virusStatus: SomaticResultsFileVirusStatusEnum):
    SomaticResultsFileWithStatus[] {
    return this.somaticResultsFilesWithStatus.map((sharedLearning: SomaticResultsFileWithStatus) =>
      sharedLearning.somaticDocumentId === id ? {...sharedLearning, virusStatus} : sharedLearning);
  }

  private updateSentDate(id: number, sentDate: number): SomaticResultsFileWithStatus[] {
    return this.somaticResultsFilesWithStatus.map((sharedLearning: SomaticResultsFileWithStatus) =>
      sharedLearning.somaticDocumentId === id ? {...sharedLearning, sentAt: sentDate} : sharedLearning);
  }

}
