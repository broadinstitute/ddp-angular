import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter, Input, OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import {SharedLearningsHTTPService} from '../../services/sharedLearningsHTTP.service';
import {mergeMap, Subscription, tap} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {UploadButtonText} from '../../enums/uploadButtonText-enum';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {LoadingModalComponent} from '../../../modals/loading-modal.component';
import {HttpRequestStatusEnum} from '../../enums/httpRequestStatus-enum';
import {HttpErrorResponse} from '@angular/common/http';
import {SomaticResultSignedUrlResponse} from '../../interfaces/somaticResultSignedUrlRequest';
import {SomaticResultsFile} from '../../interfaces/somaticResultsFile';
import {RoleService} from '../../../services/role.service';

@Component({
  selector: 'app-upload-files',
  templateUrl: `uploadFile.component.html`,
  styleUrls: ['uploadFile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadFileComponent implements OnDestroy {
  private readonly NO_FILE = 'No File';
  private readonly MAX_FILE_SIZE = 30000000;
  private readonly MAX_FILE_NAME_LENGTH = 255;

  private subscription: Subscription;

  public selectedFileName: string = this.NO_FILE;
  public uploadButtonText = UploadButtonText.UPLOAD;
  public isFileSelected = false;
  public uploadStatus: HttpRequestStatusEnum = HttpRequestStatusEnum.NONE;
  public errorMessage: string | null = null;


  @Input() participantId: string;
  @Output() fileUploaded = new EventEmitter<SomaticResultsFile>();

  @ViewChild('hiddenInput') inputElement: ElementRef<HTMLInputElement>;
  @ViewChild('uploadButton') uploadButton: ElementRef<HTMLButtonElement>;

  constructor(private readonly cdr: ChangeDetectorRef,
              private readonly sharedLearningsHTTPService: SharedLearningsHTTPService,
              private readonly matDialog: MatDialog,
              private readonly roleService: RoleService) {
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  public browse(): void {
    this.inputElement.nativeElement.click();
  }

  public upload(): void {
    if(!this.doNotAllowUpload) {
      const selectedFiles: FileList = this.inputElement.nativeElement.files;
      const selectedFile: File = selectedFiles.item(0);
      this.updateUploadButtonBy(HttpRequestStatusEnum.IN_PROGRESS);
      const openLoadingDialog = this.openLoadingDialog(selectedFile.name);
      let somaticResultsFile: SomaticResultsFile;

      this.subscription?.unsubscribe();

      this.subscription = this.sharedLearningsHTTPService
        .getSignedUrl(selectedFile, this.participantId)
        .pipe(
          tap(({somaticResultUpload}: SomaticResultSignedUrlResponse) =>
            somaticResultsFile = somaticResultUpload),
          mergeMap(({signedUrl}: SomaticResultSignedUrlResponse) =>
            this.sharedLearningsHTTPService.upload(signedUrl, selectedFile)),
          finalize(() => openLoadingDialog.close())
        )
        .subscribe({
          next: () => this.handleSuccess(somaticResultsFile),
          error: (error: any) => {
            // if there's an error storing the file, remove the file
            // and inform the user to retry
            this.sharedLearningsHTTPService.delete(somaticResultsFile.somaticDocumentId);
            this.updateUploadButtonBy(HttpRequestStatusEnum.ERROR_RETRY);
            console.log(error);
          }
        });
    }
  }

  public onFileSelection(event: Event): void {
    const selectedFiles: FileList = (event.target as HTMLInputElement).files;
    if (selectedFiles.length) {
      this.isFileSelected = true;
      this.errorMessage = null;
      const {name: fileName, size: fileSize} = selectedFiles.item(0);
      this.selectedFileName &&= this.displayFileName(fileName);
      if(fileName.length > this.MAX_FILE_NAME_LENGTH) {
        this.uploadStatus = HttpRequestStatusEnum.FAIL;
        this.uploadButtonText = UploadButtonText.FILE_NAME_TOO_LARGE;
        this.errorMessage = 'File name size has exceeded 255 characters';
      } else if(fileSize > this.MAX_FILE_SIZE) {
        this.uploadStatus = HttpRequestStatusEnum.FAIL;
        this.uploadButtonText = UploadButtonText.FILE_SIZE_TOO_LARGE;
        this.errorMessage = 'File size has exceeded 30MB';
      } else {
        this.uploadStatus = HttpRequestStatusEnum.NONE;
        this.uploadButtonText = UploadButtonText.UPLOAD;
      }
    }
  }

  public retryOrNot(isMouseOver: boolean): void {
    if (this.retryOnHoverOrNot) {
      const currentStatus = isMouseOver ? HttpRequestStatusEnum.RETRY : HttpRequestStatusEnum.FAIL;
      this.updateUploadButtonBy(currentStatus);
    }
  }

  public get shouldDisableButton(): boolean {
    return !this.isFileSelected || this.uploadStatus === HttpRequestStatusEnum.SUCCESS;
  }

  public get btnClass(): string {
    return this.uploadStatus === HttpRequestStatusEnum.SUCCESS ? 'uploadSuccess'
      : this.uploadStatus === HttpRequestStatusEnum.FAIL ? 'uploadFail'
        : this.uploadStatus === HttpRequestStatusEnum.RETRY ? 'uploadRetry'
          : '';
  }

  public get isAllowedToUpload(): boolean {
    return this.roleService.allowUploadRorFile;
  }

  private get retryOnHoverOrNot(): boolean {
    return (this.uploadStatus === HttpRequestStatusEnum.FAIL || this.uploadStatus === HttpRequestStatusEnum.RETRY) &&
      this.fileMeetsCriteria;
  }

  private get fileMeetsCriteria(): boolean {
    return this.uploadButtonText !== UploadButtonText.FILE_SIZE_TOO_LARGE &&
      this.uploadButtonText !== UploadButtonText.FILE_NAME_TOO_LARGE;
  }

  private get doNotAllowUpload(): boolean {
    return this.uploadButtonText === UploadButtonText.FILE_SIZE_TOO_LARGE ||
      this.uploadButtonText === UploadButtonText.FILE_NAME_TOO_LARGE;
  }

  private handleSuccess(uploadedFileInfo: SomaticResultsFile): void {
    this.updateUploadButtonBy(HttpRequestStatusEnum.SUCCESS);
    this.fileUploaded.next(uploadedFileInfo);
    // Resetting the selected file, in order to be able to upload the same file multiple times at the same time
    setTimeout(() => {
      this.cdr.markForCheck();
      this.inputElement.nativeElement.value = '';
      this.selectedFileName = this.NO_FILE;
    });
  }

  private handleError(error: any): void {
    this.updateUploadButtonBy(HttpRequestStatusEnum.FAIL);
    if(error instanceof HttpErrorResponse) {
      if(error.error instanceof Object && error.error.hasOwnProperty('authorizeResultType')) {
        this.errorMessage = error.error.authorizeResultType.split('_').join(' ').toLowerCase();
      } else {
        this.errorMessage = error.error;
      }
    }
  }

  private openLoadingDialog(fileName: string): MatDialogRef<LoadingModalComponent> {
    return this.matDialog.open(LoadingModalComponent,
      {data: {message: `${fileName} is uploading. Please wait...`}, disableClose: true});
  }

  private displayFileName(name: string): string {
    const splitName = name.trim().split('.');
    const fileExtension = splitName.slice(-1);
    const fileName = splitName.slice(0, -1).join('.');
    return `${fileName.length > 16 ? fileName.slice(0, 8) + ' ... ' + fileName.slice(-8) :
      fileName}.${fileExtension}`;
  }

  private updateUploadButtonBy(uploadHttpStatus: HttpRequestStatusEnum): void {
    this.cdr.markForCheck();
    switch (uploadHttpStatus) {
      case  HttpRequestStatusEnum.SUCCESS:
        this.errorMessage = null;
        this.uploadStatus = HttpRequestStatusEnum.SUCCESS;
        this.uploadButtonText = UploadButtonText.UPLOAD_SUCCESS;
        break;
      case  HttpRequestStatusEnum.FAIL:
        this.uploadStatus = HttpRequestStatusEnum.FAIL;
        this.uploadButtonText = UploadButtonText.UPLOAD_FAIL;
        break;
      case  HttpRequestStatusEnum.IN_PROGRESS:
        this.uploadStatus = HttpRequestStatusEnum.NONE;
        this.uploadButtonText = UploadButtonText.UPLOAD_IN_PROGRESS;
        break;
      case  HttpRequestStatusEnum.RETRY:
        this.uploadStatus = HttpRequestStatusEnum.RETRY;
        this.uploadButtonText = UploadButtonText.UPLOAD_RETRY;
        break;
      case  HttpRequestStatusEnum.ERROR_RETRY:
        this.uploadStatus = HttpRequestStatusEnum.ERROR_RETRY;
        this.uploadButtonText = UploadButtonText.ERROR_RETRY;
        break;
      default:
        this.uploadStatus = HttpRequestStatusEnum.NONE;
        this.uploadButtonText = UploadButtonText.UPLOAD;
        break;
    }
  }
}
