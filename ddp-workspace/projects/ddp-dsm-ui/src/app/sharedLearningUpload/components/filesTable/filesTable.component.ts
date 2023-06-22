import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, Output, Renderer2
} from '@angular/core';
import {SomaticResultsFileWithStatus} from '../../interfaces/somaticResultsFile';
import {HttpRequestStatusEnum} from '../../enums/httpRequestStatus-enum';
import {SharedLearningsHTTPService} from '../../services/sharedLearningsHTTP.service';
import {MatIcon} from '@angular/material/icon';
import {SomaticResultsFileVirusStatusEnum} from '../../enums/somaticResultsFileVirusStatus-enum';


@Component({
  selector: 'app-files-table',
  templateUrl: 'filesTable.component.html',
  styleUrls: ['filesTable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilesTableComponent {
  public readonly columnNames: string[] = ['VirusStatus', 'Name', 'UploadDate', 'SendToParticipant', 'SentDate', 'Delete'];
  public httpRequestStatusEnum = HttpRequestStatusEnum;
  public SRFVirusStatusEnum = SomaticResultsFileVirusStatusEnum;

  @Input() somaticResultsFiles: SomaticResultsFileWithStatus[] = [];

  @Output() sendToParticipant = new EventEmitter<SomaticResultsFileWithStatus>();
  @Output() delete = new EventEmitter<SomaticResultsFileWithStatus>();

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly sharedLearningsHTTPService: SharedLearningsHTTPService,
    private readonly renderer: Renderer2,
  ) {}

  public onSendToParticipant(somaticResultsFileWithStatus: SomaticResultsFileWithStatus): void {
    if (!this.shouldNotAllowSendOrDelete(somaticResultsFileWithStatus.isInfected)) {
      this.sendToParticipant.emit(somaticResultsFileWithStatus);
    }
  }

  public deleteFile(somaticResultsFileWithStatus: SomaticResultsFileWithStatus): void {
    if (!this.shouldNotAllowSendOrDelete(somaticResultsFileWithStatus.isInfected)) {
      this.delete.emit(somaticResultsFileWithStatus);
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
    const disableStatesList = [
      SomaticResultsFileVirusStatusEnum.INFECTED,
      SomaticResultsFileVirusStatusEnum.SCANNING,
      SomaticResultsFileVirusStatusEnum.UNABLE_TO_SCAN
    ];
    return  disableStatesList.includes(isInfected);
  }

}
