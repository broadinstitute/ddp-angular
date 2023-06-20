import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, OnDestroy,
  Output, Renderer2,
} from "@angular/core";
import {SharedLearningsFile} from "../../interfaces/sharedLearningsFile";
import {HttpRequestStatusEnum} from "../../enums/httpRequestStatus-enum";
import {SharedLearningsHTTPService} from "../../services/sharedLearningsHTTP.service";
import {Subject, Subscription} from "rxjs";
import {MatIcon} from "@angular/material/icon";

interface SharedLearningsWithStatus extends SharedLearningsFile {
  sendToParticipantStatus: {
    status: HttpRequestStatusEnum;
    message: string | null;
  };
  deleteStatus: {
    status: HttpRequestStatusEnum.NONE | HttpRequestStatusEnum.IN_PROGRESS | HttpRequestStatusEnum.FAIL;
    message: string | null;
  }
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
  public sharedLearnings: SharedLearningsWithStatus[] = [];

  private sharedLearningsSubject$ = new Subject<SharedLearningsWithStatus[]>();
  private sharedLearningsSubscription: Subscription;

  @Input() set uploadedFiles(sharedLearnings: SharedLearningsFile[]) {
    const sharedLearningsWithStatuses: SharedLearningsWithStatus[] = sharedLearnings.map((file) =>
      ({...file,
        sendToParticipantStatus: {status: HttpRequestStatusEnum.NONE, message: null},
        deleteStatus: {status: HttpRequestStatusEnum.NONE, message: null}
      }))
    this.sharedLearningsSubject$.next(sharedLearningsWithStatuses)
  }
  @Output() sendToParticipant = new EventEmitter();
  @Output() delete = new EventEmitter();

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly sharedLearningsHTTPService: SharedLearningsHTTPService,
    private readonly renderer: Renderer2
  ) {
    this.sharedLearningsSubscription = this.sharedLearningsSubject$
      .subscribe((sharedLearnings: SharedLearningsWithStatus[]) => this.sharedLearnings = sharedLearnings)
  }

  ngOnDestroy(): void {
    this.sharedLearningsSubscription?.unsubscribe();
  }

  // @TODO mocked
  public onSendToParticipant(file: SharedLearningsWithStatus): void {
    console.log(file, 'SENDING_TO_PARTICIPANT');
    this.sharedLearningsSubject$
      .next(this.updateSendToStatus(this.sharedLearnings, file.id, HttpRequestStatusEnum.IN_PROGRESS, null))
    setTimeout(() => {
      this.cdr.markForCheck()
      const status = HttpRequestStatusEnum.SUCCESS;
      this.sharedLearningsSubject$
        .next(this.updateSendToStatus(this.sharedLearnings, file.id, status, 'Could not send the file'))
      // @ts-ignore
      if(status !== HttpRequestStatusEnum.FAIL) {
        setTimeout(() => {
          this.cdr.markForCheck()
          this.sharedLearningsSubject$
            .next(this.updateSendToStatus(this.sharedLearnings, file.id, HttpRequestStatusEnum.NONE, null))
        }, 2000)
      }
    }, 3000)
  }

  // @TODO mocked
  public onDelete(file: SharedLearningsWithStatus): void {
    console.log(file, 'DELETING');
    this.sharedLearningsSubject$
      .next(this.updateDeleteStatus(this.sharedLearnings, file.id, HttpRequestStatusEnum.IN_PROGRESS, null))
    setTimeout(() => {
      this.cdr.markForCheck();

      this.sharedLearningsSubject$.next(this.sharedLearnings.filter((sharedLearningFile) => sharedLearningFile.id !== file.id))

      // @TODO mocked fail case
      // this.sharedLearningsSubject$
      //   .next(this.updateDeleteStatus(this.sharedLearnings, file.id, HttpRequestStatusEnum.SUCCESS, "Could not delete the file"))
    }, 3000)
  }

  public retryOrNot(shouldRetry: boolean, matIcon: MatIcon): void {
    const matIconNative = matIcon._elementRef.nativeElement;
    matIconNative.innerText = shouldRetry ? 'replay' : 'error';
    shouldRetry ?
      this.renderer.addClass(matIconNative, 'retry-icon') :
      this.renderer.removeClass(matIconNative, 'retry-icon')
  }

  private updateSendToStatus(sharedLearnings: SharedLearningsWithStatus[], id: number, status: HttpRequestStatusEnum, message): SharedLearningsWithStatus[] {
    return sharedLearnings.map((sharedLearning: SharedLearningsWithStatus) =>
      sharedLearning.id === id ? {...sharedLearning, sendToParticipantStatus: {status, message}} : sharedLearning)
  }

  private updateDeleteStatus(sharedLearnings: SharedLearningsWithStatus[], id: number,
                             status: HttpRequestStatusEnum.NONE | HttpRequestStatusEnum.IN_PROGRESS | HttpRequestStatusEnum.FAIL, message): SharedLearningsWithStatus[] {
    return sharedLearnings.map((sharedLearning: SharedLearningsWithStatus) =>
      sharedLearning.id === id ? {...sharedLearning, deleteStatus: {status, message}} : sharedLearning)
  }

}
