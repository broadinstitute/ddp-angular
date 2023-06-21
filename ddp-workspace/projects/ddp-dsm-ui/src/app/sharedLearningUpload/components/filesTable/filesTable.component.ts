import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, OnDestroy,
  Output, Renderer2,
} from '@angular/core';
import {SomaticResultsFile, SomaticResultsFileWithStatus} from '../../interfaces/somaticResultsFile';
import {HttpRequestStatusEnum} from '../../enums/httpRequestStatus-enum';
import {SharedLearningsHTTPService} from '../../services/sharedLearningsHTTP.service';
import {delay, mergeMap, Observable, repeatWhen, Subject, takeUntil, takeWhile, tap} from 'rxjs';
import {MatIcon} from '@angular/material/icon';
import {HttpErrorResponse} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationModalComponent} from '../confirmationModal/confirmationModal.component';
import {take} from 'rxjs/operators';
import {SomaticResultsFileVirusStatusEnum} from "../../enums/somaticResultsFileVirusStatus-enum";


@Component({
  selector: 'app-files-table',
  templateUrl: 'filesTable.component.html',
  styleUrls: ['filesTable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilesTableComponent implements OnDestroy {
  public readonly columnNames: string[] = ['VirusStatus', 'Name', 'UploadDate', 'SendToParticipant', 'SentDate', 'Delete'];
  public httpRequestStatusEnum = HttpRequestStatusEnum;
  public SRFVirusStatusEnum = SomaticResultsFileVirusStatusEnum;
  public sharedLearnings: SomaticResultsFileWithStatus[] = [];

  private somaticResultsFilesWithStatuses$ = new Subject<SomaticResultsFileWithStatus[]>();
  private subscriptionSubject$ = new Subject<void>();

  @Input() participantId: string;

  @Input() set uploadedFile(somaticResultsFile: SomaticResultsFile | null | undefined) {
    somaticResultsFile && this.handleUploadedFile(somaticResultsFile);
  }

  @Input() set uploadedFiles(sharedLearnings: SomaticResultsFile[]) {
    const sharedLearningsWithStatuses: SomaticResultsFileWithStatus[] = sharedLearnings ?
      sharedLearnings.map((somaticResultsFile: SomaticResultsFile) => this.mapFile(somaticResultsFile)) : [];
    this.somaticResultsFilesWithStatuses$.next(sharedLearningsWithStatuses);
  }

  @Output() sendToParticipant = new EventEmitter();
  @Output() delete = new EventEmitter();

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly sharedLearningsHTTPService: SharedLearningsHTTPService,
    private readonly renderer: Renderer2,
    private readonly matDialog: MatDialog
  ) {
    this.somaticResultsFilesWithStatuses$
      .pipe(takeUntil(this.subscriptionSubject$))
      .subscribe((sharedLearnings: SomaticResultsFileWithStatus[]) => this.sharedLearnings = sharedLearnings);
  }

  ngOnDestroy(): void {
    this.subscriptionSubject$.next();
    this.subscriptionSubject$.complete();
  }

  public onSendToParticipant({somaticDocumentId, isInfected}: SomaticResultsFileWithStatus): void {
    if (!this.shouldNotAllowSendOrDelete(isInfected)) {
      this.somaticResultsFilesWithStatuses$
        .next(this.updateSendToStatus(somaticDocumentId, HttpRequestStatusEnum.IN_PROGRESS, null));

      this.sharedLearningsHTTPService.sendToParticipant(this.participantId, somaticDocumentId)
        .pipe(
          mergeMap(() => this.sharedLearningsHTTPService.getFile(this.participantId, somaticDocumentId)),
          takeUntil(this.subscriptionSubject$)
        )
        .subscribe({
          next: ({sentAt}: SomaticResultsFile) => {
            this.handleSentDateUpdate(somaticDocumentId, sentAt);
            this.handleSendToSuccess(somaticDocumentId);
          },
          error: (error: any) => error instanceof HttpErrorResponse &&
            this.handleSendToFail(somaticDocumentId, error.error)
        });
    }
  }

  public deleteFile({somaticDocumentId, fileName, isInfected}: SomaticResultsFileWithStatus): void {
    if (!this.shouldNotAllowSendOrDelete(isInfected)) {
      const activeConfirmationDialog = this.matDialog.open(ConfirmationModalComponent,
        {data: {fileName}, width: '500px'});
      activeConfirmationDialog.afterClosed()
        .pipe(
          take(1),
          takeUntil(this.subscriptionSubject$)
        )
        .subscribe({
          next: (deleteOrNot: boolean) => deleteOrNot && this.onDelete(somaticDocumentId)
        });
    }
  }

  public retryOrNot(shouldRetry: boolean, matIcon: MatIcon): void {
    const matIconNative = matIcon._elementRef.nativeElement;
    matIconNative.innerText = shouldRetry ? 'replay' : 'error';
    shouldRetry ?
      this.renderer.addClass(matIconNative, 'retry-icon') :
      this.renderer.removeClass(matIconNative, 'retry-icon');
  }

  public shouldNotAllowSendOrDelete(isInfected: SomaticResultsFileVirusStatusEnum): boolean {
    return isInfected === SomaticResultsFileVirusStatusEnum.INFECTED ||
      isInfected === SomaticResultsFileVirusStatusEnum.SCANNING
  }

  private mapFile(somaticResultsFile: SomaticResultsFile): SomaticResultsFileWithStatus {
    return {
      ...somaticResultsFile,
      createdAt: somaticResultsFile.createdAt * 1000,
      deletedAt: somaticResultsFile.deletedAt * 1000,
      sendToParticipantStatus: {status: HttpRequestStatusEnum.NONE, message: null},
      deleteStatus: {status: HttpRequestStatusEnum.NONE, message: null},
      isInfected: this.handleAndReturnVirusStatusFor(somaticResultsFile)
    }
  }

  private onDelete(somaticDocumentId: number): void {
    this.cdr.markForCheck();
    this.somaticResultsFilesWithStatuses$
      .next(this.updateDeleteStatus(somaticDocumentId, HttpRequestStatusEnum.IN_PROGRESS, null));

    this.sharedLearningsHTTPService.delete(somaticDocumentId)
      .pipe(takeUntil(this.subscriptionSubject$))
      .subscribe({
        next: () => this.handleDeleteSuccess(somaticDocumentId),
        error: (error: any) => error instanceof HttpErrorResponse &&
          this.handleDeleteFail(somaticDocumentId, error.error)
      });
  }

  private handleSendToSuccess(somaticDocumentId: number): void {
    this.cdr.markForCheck();
    const updatedSomaticResultsFiles =
      this.updateSendToStatus(somaticDocumentId, HttpRequestStatusEnum.SUCCESS, null);
    this.somaticResultsFilesWithStatuses$.next(updatedSomaticResultsFiles);

    // Resetting back to send icon, as the file can be sent multiple times
    setTimeout(() => {
      this.cdr.markForCheck();
      const updatedSomaticResultsFiles2 =
        this.updateSendToStatus(somaticDocumentId, HttpRequestStatusEnum.NONE, null);
      this.somaticResultsFilesWithStatuses$.next(updatedSomaticResultsFiles2);
    }, 2000);
  }

  private handleDeleteSuccess(somaticDocumentId: number): void {
    this.cdr.markForCheck();
    this.somaticResultsFilesWithStatuses$
      .next(this.sharedLearnings.filter(({somaticDocumentId: id}) => id !== somaticDocumentId));
  }

  private handleSendToFail(somaticDocumentId: number, error: string): void {
    this.cdr.markForCheck();
    this.somaticResultsFilesWithStatuses$
      .next(this.updateSendToStatus(somaticDocumentId, HttpRequestStatusEnum.FAIL, error));
  }

  private handleDeleteFail(somaticDocumentId: number, error: string): void {
    this.cdr.markForCheck();
    this.somaticResultsFilesWithStatuses$
      .next(this.updateDeleteStatus(somaticDocumentId, HttpRequestStatusEnum.FAIL, error));
  }

  private handleInfectedStatusUpdate(id: number, isInfected: SomaticResultsFileVirusStatusEnum): void {
    this.cdr.markForCheck();
    this.somaticResultsFilesWithStatuses$
      .next(this.updateInfectedStatus(id, isInfected));
  }

  private handleSentDateUpdate(id: number, sentDate: number): void {
    this.cdr.markForCheck();
    this.somaticResultsFilesWithStatuses$
      .next(this.updateSentDate(id, sentDate));
  }

  private handleUploadedFile(somaticResultsFile: SomaticResultsFile): void {
    this.somaticResultsFilesWithStatuses$
      .next([...this.sharedLearnings, this.mapFile(somaticResultsFile)]);
  }

  private updateSendToStatus(id: number, status: HttpRequestStatusEnum, message): SomaticResultsFileWithStatus[] {
    return this.sharedLearnings.map((sharedLearning: SomaticResultsFileWithStatus) =>
      sharedLearning.somaticDocumentId === id ? {
        ...sharedLearning,
        sendToParticipantStatus: {status, message}
      } : sharedLearning);
  }

  private updateDeleteStatus(id: number,
                             status: HttpRequestStatusEnum.NONE | HttpRequestStatusEnum.IN_PROGRESS | HttpRequestStatusEnum.FAIL,
                             message): SomaticResultsFileWithStatus[] {
    return this.sharedLearnings.map((sharedLearning: SomaticResultsFileWithStatus) =>
      sharedLearning.somaticDocumentId === id ? {...sharedLearning, deleteStatus: {status, message}} : sharedLearning);
  }

  private updateInfectedStatus(id: number, isInfected: SomaticResultsFileVirusStatusEnum):
    SomaticResultsFileWithStatus[] {
    return this.sharedLearnings.map((sharedLearning: SomaticResultsFileWithStatus) =>
      sharedLearning.somaticDocumentId === id ? {...sharedLearning, isInfected} : sharedLearning);
  }

  private updateSentDate(id: number, sentDate: number): SomaticResultsFileWithStatus[] {
    return this.sharedLearnings.map((sharedLearning: SomaticResultsFileWithStatus) =>
      sharedLearning.somaticDocumentId === id ? {...sharedLearning, sentAt: sentDate} : sharedLearning);
  }

  private handleAndReturnVirusStatusFor({
                                          isVirusFree,
                                          deletedAt,
                                          somaticDocumentId
                                        }: SomaticResultsFile): SomaticResultsFileVirusStatusEnum {
    let isFileDeleted = !!deletedAt;

    if (!isVirusFree && isFileDeleted) { // file has been scanned and is infected
      return SomaticResultsFileVirusStatusEnum.INFECTED
    } else if (!isVirusFree && !isFileDeleted) {
      // file has not been scanned, so it till scan file as well
      this.scanForVirus(somaticDocumentId);
      return SomaticResultsFileVirusStatusEnum.SCANNING
    } else if (isVirusFree && !isFileDeleted) { // file has already been scanned for viruses and is clean
      return SomaticResultsFileVirusStatusEnum.CLEAN
    } else {
      // It should not happen, but anyway:
      // file has already been scanned for viruses and is clean but still deleted, so it's assumed as an infected
      return SomaticResultsFileVirusStatusEnum.INFECTED
    }
  }

  private scanForVirus(somaticDocumentId: number): void {
    let uploadedFileHasBeenScanned = false;
    this.sharedLearningsHTTPService
      .getFile(this.participantId, somaticDocumentId)
      .pipe(
        repeatWhen((notifications: Observable<any>) =>
          notifications.pipe(
            takeWhile(() => !uploadedFileHasBeenScanned),
            delay(3000)
          )
        ),
        takeUntil(this.subscriptionSubject$)
      )
      .subscribe(({isVirusFree, deletedAt, somaticDocumentId}: SomaticResultsFile) => {
        let isFileDeleted = !!deletedAt;
        if (isVirusFree && !isFileDeleted) {
          uploadedFileHasBeenScanned = true;
          this.handleInfectedStatusUpdate(somaticDocumentId, SomaticResultsFileVirusStatusEnum.CLEAN);
        } else if (!isVirusFree && isFileDeleted) {
          uploadedFileHasBeenScanned = true;
          this.handleInfectedStatusUpdate(somaticDocumentId, SomaticResultsFileVirusStatusEnum.INFECTED);
        }
      })
  }

}
