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
import {RoleService} from '../../../services/role.service';


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
    private readonly roleService: RoleService
  ) {}

  /* Event handlers */
  public onSendToParticipant(somaticResultsFileWithStatus: SomaticResultsFileWithStatus): void {
    if (this.allowToSendFile && this.shouldAllowSendOrDelete(somaticResultsFileWithStatus.virusStatus)) {
      this.sendToParticipant.emit(somaticResultsFileWithStatus);
    }
  }

  public deleteFile(somaticResultsFileWithStatus: SomaticResultsFileWithStatus): void {
    if (this.allowToDeleteFile && this.shouldAllowSendOrDelete(somaticResultsFileWithStatus.virusStatus)) {
      this.delete.emit(somaticResultsFileWithStatus);
    }
  }

  /* Template methods */
  public retryOrNot(shouldRetry: boolean, matIcon: MatIcon): void {
    const matIconNative = matIcon._elementRef.nativeElement;
    matIconNative.innerText = shouldRetry ? 'replay' : 'error';
    shouldRetry ?
      this.renderer.addClass(matIconNative, 'retry-icon') :
      this.renderer.removeClass(matIconNative, 'retry-icon');
  }

  public shouldAllowSendOrDelete(virusStatus: SomaticResultsFileVirusStatusEnum): boolean {
    const disableStatesList = [
      SomaticResultsFileVirusStatusEnum.INFECTED,
      SomaticResultsFileVirusStatusEnum.SCANNING,
      SomaticResultsFileVirusStatusEnum.UNABLE_TO_SCAN
    ];
    return !disableStatesList.includes(virusStatus);
  }

  public sendIconTooltip(virusStatus: SomaticResultsFileVirusStatusEnum): string | null {
    const shouldAllowSend = this.shouldAllowSendOrDelete(virusStatus);
    return !this.allowToSendFile ? 'You don\'t have permission to send the file' :
      !shouldAllowSend ? 'File can not be sent' : null;
  }

  public deleteIconTooltip(virusStatus: SomaticResultsFileVirusStatusEnum): string | null {
    const shouldAllowDelete = this.shouldAllowSendOrDelete(virusStatus);
    return !this.allowToDeleteFile ? 'You don\'t have permission to delete the file' :
      !shouldAllowDelete ? 'File can not be deleted' : null;
  }

  public sendIconClass(virusStatus: SomaticResultsFileVirusStatusEnum): string {
    const shouldAllowDelete = this.shouldAllowSendOrDelete(virusStatus);
    return !this.allowToSendFile || !shouldAllowDelete ? 'disabled-icon' : 'send-icon';
  }

  public deleteIconClass(virusStatus: SomaticResultsFileVirusStatusEnum): string {
    const shouldAllowDelete = this.shouldAllowSendOrDelete(virusStatus);
    return !this.allowToDeleteFile || !shouldAllowDelete ? 'disabled-icon' : 'delete-icon';
  }

  /* Permissions */
  private get allowToSendFile(): boolean {
    return this.roleService.allowUploadRorFile && this.roleService.allowedToCreateSurveys();
  }

  private get allowToDeleteFile(): boolean {
    return this.roleService.allowUploadRorFile;
  }

}
