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
import {Subject, takeUntil} from 'rxjs';
import {MatIcon} from '@angular/material/icon';
import {HttpErrorResponse} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationModalComponent} from '../confirmationModal/confirmationModal.component';
import {take} from 'rxjs/operators';


@Component({
  selector: 'app-files-table',
  templateUrl: 'filesTable.component.html',
  styleUrls: ['filesTable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilesTableComponent implements OnDestroy {
  public readonly columnNames: string[] = ['Name', 'UploadDate', 'SendToParticipant', 'SentDate', 'Delete'];
  public httpRequestStatusEnum = HttpRequestStatusEnum;
  public sharedLearnings: SomaticResultsFileWithStatus[] = [];

  private somaticResultsFilesWithStatuses$ = new Subject<SomaticResultsFileWithStatus[]>();
  private subscriptionSubject$ = new Subject<boolean>();

  @Input() participantId: string;
  @Input() set uploadedFiles(sharedLearnings: SomaticResultsFile[]) {
    const sharedLearningsWithStatuses: SomaticResultsFileWithStatus[] = sharedLearnings ? sharedLearnings.map((file) =>
      ({...file,
        sendToParticipantStatus: {status: HttpRequestStatusEnum.NONE, message: null},
        deleteStatus: {status: HttpRequestStatusEnum.NONE, message: null}
      })) : [];
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
    this.subscriptionSubject$.complete();
    this.subscriptionSubject$.unsubscribe();
  }

  public onSendToParticipant(somaticResultsFileWithStatus: SomaticResultsFileWithStatus): void {
    // @TODO when virus scan is on place, I should check for that before proceeding
    const { sendToParticipantStatus, deleteStatus, ...somaticResultsFile } = somaticResultsFileWithStatus;
    const {somaticDocumentId} = somaticResultsFile as SomaticResultsFile;

    this.somaticResultsFilesWithStatuses$
      .next(this.updateSendToStatus(this.sharedLearnings, somaticDocumentId, HttpRequestStatusEnum.IN_PROGRESS, null));

    this.sharedLearningsHTTPService.sendToParticipant(this.participantId, somaticDocumentId)
      .pipe(takeUntil(this.subscriptionSubject$))
      .subscribe({
        next: () => this.handleSendToSuccess(somaticDocumentId),
        error: (error: any) => error instanceof HttpErrorResponse &&
          this.handleSendToFail(somaticDocumentId, error.error)
      });
  }

  public deleteFile({somaticDocumentId, fileName}: SomaticResultsFileWithStatus): void {
    // @TODO when virus scan is on place, I should check for that before proceeding

    const activeConfirmationDialog = this.matDialog.open(ConfirmationModalComponent,
      {data: {fileName}, width: '500px', height: '230px'});
    activeConfirmationDialog.afterClosed()
      .pipe(
        take(1),
        takeUntil(this.subscriptionSubject$)
      )
      .subscribe({
        next: (deleteOrNot: boolean) => deleteOrNot && this.onDelete(somaticDocumentId)
      });
  }

  public retryOrNot(shouldRetry: boolean, matIcon: MatIcon): void {
    const matIconNative = matIcon._elementRef.nativeElement;
    matIconNative.innerText = shouldRetry ? 'replay' : 'error';
    shouldRetry ?
      this.renderer.addClass(matIconNative, 'retry-icon') :
      this.renderer.removeClass(matIconNative, 'retry-icon');
  }

  private onDelete(somaticDocumentId: number): void {
    // @TODO when virus scan is on place, I should check for that before proceeding

    this.cdr.markForCheck();
    this.somaticResultsFilesWithStatuses$
      .next(this.updateDeleteStatus(this.sharedLearnings, somaticDocumentId, HttpRequestStatusEnum.IN_PROGRESS, null));

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
    const updatedSomaticResultsFiles = this.updateSendToStatus(this.sharedLearnings,
      somaticDocumentId, HttpRequestStatusEnum.SUCCESS, null);
    this.somaticResultsFilesWithStatuses$.next(updatedSomaticResultsFiles);

    // Resetting back to send icon, as the file can be sent multiple times
    setTimeout(() => {
      this.cdr.markForCheck();
      const updatedSomaticResultsFiles2 = this.updateSendToStatus(this.sharedLearnings,
        somaticDocumentId, HttpRequestStatusEnum.NONE, null);
      this.somaticResultsFilesWithStatuses$.next(updatedSomaticResultsFiles2);
    }, 2000);
  }

  private handleDeleteSuccess(somaticDocumentId: number): void {
    this.cdr.markForCheck();
    this.somaticResultsFilesWithStatuses$
      .next(this.sharedLearnings.filter(({somaticDocumentId : id}) => id !== somaticDocumentId));
  }

  private handleSendToFail(somaticDocumentId: number, error: string): void {
    this.cdr.markForCheck();
    this.somaticResultsFilesWithStatuses$
      .next(this.updateSendToStatus(this.sharedLearnings, somaticDocumentId, HttpRequestStatusEnum.FAIL, error));
  }

  private handleDeleteFail(somaticDocumentId: number, error: string): void {
    this.cdr.markForCheck();
    this.somaticResultsFilesWithStatuses$
      .next(this.updateDeleteStatus(this.sharedLearnings, somaticDocumentId, HttpRequestStatusEnum.FAIL, error));
  }

  private updateSendToStatus(sharedLearnings: SomaticResultsFileWithStatus[], id: number,
                             status: HttpRequestStatusEnum, message): SomaticResultsFileWithStatus[] {
    return sharedLearnings.map((sharedLearning: SomaticResultsFileWithStatus) =>
      sharedLearning.somaticDocumentId === id ? {...sharedLearning, sendToParticipantStatus: {status, message}} : sharedLearning);
  }

  private updateDeleteStatus(sharedLearnings: SomaticResultsFileWithStatus[], id: number,
                             status: HttpRequestStatusEnum.NONE | HttpRequestStatusEnum.IN_PROGRESS | HttpRequestStatusEnum.FAIL,
                             message): SomaticResultsFileWithStatus[] {
    return sharedLearnings.map((sharedLearning: SomaticResultsFileWithStatus) =>
      sharedLearning.somaticDocumentId === id ? {...sharedLearning, deleteStatus: {status, message}} : sharedLearning);
  }

}
