import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, OnDestroy,
  Output, Renderer2,
} from '@angular/core';
import {SomaticResultsFile} from '../../interfaces/somaticResultsFile';
import {HttpRequestStatusEnum} from '../../enums/httpRequestStatus-enum';
import {SharedLearningsHTTPService} from '../../services/sharedLearningsHTTP.service';
import {pipe, Subject, Subscription, takeUntil} from 'rxjs';
import {MatIcon} from '@angular/material/icon';

interface SomaticResultsFileWithStatus extends SomaticResultsFile {
  sendToParticipantStatus: {
    status: HttpRequestStatusEnum;
    message: string | null;
  };
  deleteStatus: {
    status: HttpRequestStatusEnum.NONE | HttpRequestStatusEnum.IN_PROGRESS | HttpRequestStatusEnum.FAIL;
    message: string | null;
  };
}

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

  private sharedLearningsSubject$ = new Subject<SomaticResultsFileWithStatus[]>();
  private subscriptionSubject = new Subject<boolean>();

  @Input() set uploadedFiles(sharedLearnings: SomaticResultsFile[]) {
    const sharedLearningsWithStatuses: SomaticResultsFileWithStatus[] = sharedLearnings.map((file) =>
      ({...file,
        sendToParticipantStatus: {status: HttpRequestStatusEnum.NONE, message: null},
        deleteStatus: {status: HttpRequestStatusEnum.NONE, message: null}
      }));
    this.sharedLearningsSubject$.next(sharedLearningsWithStatuses);
  }
  @Output() sendToParticipant = new EventEmitter();
  @Output() delete = new EventEmitter();

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly sharedLearningsHTTPService: SharedLearningsHTTPService,
    private readonly renderer: Renderer2
  ) {
    this.sharedLearningsSubject$
      .pipe(takeUntil(this.subscriptionSubject))
      .subscribe((sharedLearnings: SomaticResultsFileWithStatus[]) => this.sharedLearnings = sharedLearnings);
  }

  ngOnDestroy(): void {
    this.subscriptionSubject.complete();
    this.subscriptionSubject.unsubscribe();
  }

  // @TODO mocked
  public onSendToParticipant(somaticResultsFile: SomaticResultsFileWithStatus): void {
    console.log(somaticResultsFile, 'SENDING_TO_PARTICIPANT');
    if(somaticResultsFile.isVirusFree) {
      this.sharedLearningsSubject$
        .next(this.updateSendToStatus(this.sharedLearnings, somaticResultsFile.somaticDocumentId, HttpRequestStatusEnum.IN_PROGRESS, null));
      setTimeout(() => {
        this.cdr.markForCheck();
        const status = HttpRequestStatusEnum.SUCCESS;
        this.sharedLearningsSubject$
          .next(this.updateSendToStatus(this.sharedLearnings, somaticResultsFile.somaticDocumentId, status, 'Could not send the file'));
        // if(status !== HttpRequestStatusEnum.FAIL) {
        //   setTimeout(() => {
        //     this.cdr.markForCheck();
        //     this.sharedLearningsSubject$
        //       .next(this.updateSendToStatus(this.sharedLearnings,
        //       somaticResultsFile.somaticDocumentId, HttpRequestStatusEnum.NONE, null));
        //   }, 2000);
        // }
      }, 3000);
    }
  }

  // @TODO mocked
  public onDelete(somaticDocumentId: number): void {
    this.sharedLearningsHTTPService.delete(somaticDocumentId)
      .pipe(takeUntil(this.subscriptionSubject))
      .subscribe((data: any) => {
        console.log(data, 'DELETED_RESPONSE');
      });
    // this.sharedLearningsSubject$
    //   .next(this.updateDeleteStatus(this.sharedLearnings, somaticDocumentId, HttpRequestStatusEnum.IN_PROGRESS, null))
    // setTimeout(() => {
    //   this.cdr.markForCheck();
    //
    //   this.sharedLearningsSubject$.next(this.sharedLearnings.filter(({somaticDocumentId : id}) => id !== somaticDocumentId))
    //
    //   // @TODO mocked fail case
    //   // this.sharedLearningsSubject$
    //   //   .next(this.updateDeleteStatus(this.sharedLearnings, file.id, HttpRequestStatusEnum.FAIL, "Could not delete the file"))
    // }, 3000)
  }

  public retryOrNot(shouldRetry: boolean, matIcon: MatIcon): void {
    const matIconNative = matIcon._elementRef.nativeElement;
    matIconNative.innerText = shouldRetry ? 'replay' : 'error';
    shouldRetry ?
      this.renderer.addClass(matIconNative, 'retry-icon') :
      this.renderer.removeClass(matIconNative, 'retry-icon');
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
