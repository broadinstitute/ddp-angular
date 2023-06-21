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
import {UploadedFileShortInfo} from "../../interfaces/helperInterfaces";

@Component({
  selector: 'app-upload-files',
  templateUrl: `uploadFile.component.html`,
  styleUrls: ['uploadFile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadFileComponent implements OnDestroy {
  private readonly NO_FILE = 'No File';

  public selectedFileName: string = this.NO_FILE;
  public uploadButtonText = UploadButtonText.UPLOAD;
  public isFileSelected = false;
  public uploadStatus: HttpRequestStatusEnum = HttpRequestStatusEnum.NONE;
  public errorMessage: string | null = null;
  public httpRequestStatusEnum = HttpRequestStatusEnum;

  private subscription: Subscription;

  @Input() participantId: string;
  @Input() unauthorized = false;
  @Output() fileUploaded = new EventEmitter<UploadedFileShortInfo>();

  @ViewChild('hiddenInput', {static: true}) inputElement: ElementRef<HTMLInputElement>;
  @ViewChild('uploadButton') uploadButton: ElementRef<HTMLButtonElement>;

  constructor(private readonly cdr: ChangeDetectorRef,
              private readonly sharedLearningsHTTPService: SharedLearningsHTTPService,
              private readonly matDialog: MatDialog) {
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  public browse(): void {
    this.inputElement.nativeElement.click();
  }

  public upload(): void {
    const selectedFiles: FileList = this.inputElement.nativeElement.files;
    const selectedFile: File = selectedFiles.item(0);
    this.updateUploadButton(HttpRequestStatusEnum.IN_PROGRESS);
    const openLoadingDialog = this.openLoadingDialog(selectedFile.name);
    let uploadedFileInfo: UploadedFileShortInfo;

    this.subscription = this.sharedLearningsHTTPService
      .getSignedUrl(selectedFile, this.participantId)
      .pipe(
        tap(({somaticResultUpload: {somaticDocumentId, fileName}}: SomaticResultSignedUrlResponse) =>
          uploadedFileInfo = {fileName, somaticDocumentId}),
        mergeMap(({signedUrl}: SomaticResultSignedUrlResponse) =>
          this.sharedLearningsHTTPService.upload(signedUrl, selectedFile)),
        finalize(() => openLoadingDialog.close())
      )
      .subscribe({
        next: () => this.handleSuccess(uploadedFileInfo),
        error: (error: any) => this.handleError(error)
      });
  }

  public onFileSelection(event: Event): void {
    const files: FileList = (event.target as HTMLInputElement).files;
    if (files.length) {
      this.selectedFileName &&= this.displayFileName(files.item(0).name);
      this.isFileSelected = true;
      this.errorMessage = null;
      this.uploadStatus = HttpRequestStatusEnum.NONE;
      this.uploadButtonText = UploadButtonText.UPLOAD;
    }
  }

  public retryOrNot(isMouseOver: boolean): void {
    if (this.uploadStatus === HttpRequestStatusEnum.FAIL || this.uploadStatus === HttpRequestStatusEnum.RETRY) {
      const currentStatus = isMouseOver ? HttpRequestStatusEnum.RETRY : HttpRequestStatusEnum.FAIL;
      this.updateUploadButton(currentStatus);
    }
  }

  private handleSuccess(uploadedFileInfo: UploadedFileShortInfo): void {
    this.updateUploadButton(HttpRequestStatusEnum.SUCCESS);
    this.fileUploaded.next(uploadedFileInfo);
    // Resetting the selected file, in order to be able to upload the same file multiple times at the same time
    setTimeout(() => {
      this.cdr.markForCheck();
      this.inputElement.nativeElement.value = '';
      this.selectedFileName = this.NO_FILE;
    }, 2000)
  }

  private handleError(error: any): void {
    this.updateUploadButton(HttpRequestStatusEnum.FAIL);
    this.errorMessage = error instanceof HttpErrorResponse ? error.error : null;
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

  private updateUploadButton(uploadStatus: HttpRequestStatusEnum): void {
    this.cdr.markForCheck();
    switch (uploadStatus) {
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
      default:
        this.uploadStatus = HttpRequestStatusEnum.NONE;
        this.uploadButtonText = UploadButtonText.UPLOAD;
        break;
    }
  }
}
